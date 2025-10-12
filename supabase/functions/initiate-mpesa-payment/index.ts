import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  phone: string;
  amount: number;
  reservationId: string;
}

const getMpesaAccessToken = async () => {
  const consumerKey = Deno.env.get("MPESA_CONSUMER_KEY");
  const consumerSecret = Deno.env.get("MPESA_CONSUMER_SECRET");
  
  const auth = btoa(`${consumerKey}:${consumerSecret}`);
  
  const response = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );
  
  const data = await response.json();
  return data.access_token;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, amount, reservationId }: PaymentRequest = await req.json();

    console.log("Initiating M-Pesa payment for reservation:", reservationId);

    // Get M-Pesa access token
    const accessToken = await getMpesaAccessToken();

    // Prepare STK Push request
    const businessShortCode = Deno.env.get("MPESA_BUSINESS_SHORTCODE");
    const passkey = Deno.env.get("MPESA_PASSKEY");
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    const password = btoa(`${businessShortCode}${passkey}${timestamp}`);

    // Format phone number (remove leading + or 0, ensure it starts with 254)
    let formattedPhone = phone.replace(/^\+/, "").replace(/^0/, "254");
    if (!formattedPhone.startsWith("254")) {
      formattedPhone = "254" + formattedPhone;
    }

    const stkPushPayload = {
      BusinessShortCode: businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.floor(amount),
      PartyA: formattedPhone,
      PartyB: businessShortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: `${Deno.env.get("SUPABASE_URL")}/functions/v1/mpesa-callback`,
      AccountReference: `RES${reservationId.slice(0, 8)}`,
      TransactionDesc: "My Reserve Payment",
    };

    console.log("Sending STK Push request to M-Pesa");

    const stkResponse = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stkPushPayload),
      }
    );

    const stkData = await stkResponse.json();
    console.log("M-Pesa STK Push response:", stkData);

    if (stkData.ResponseCode === "0") {
      // Update reservation with checkout request ID
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      await supabase
        .from("reservations")
        .update({
          mpesa_transaction_id: stkData.CheckoutRequestID,
          payment_status: "processing",
        })
        .eq("id", reservationId);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Payment request sent to your phone",
          checkoutRequestId: stkData.CheckoutRequestID,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else {
      throw new Error(stkData.ResponseDescription || "Failed to initiate payment");
    }
  } catch (error: any) {
    console.error("Error in initiate-mpesa-payment:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to process payment",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
