import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const handler = async (req: Request): Promise<Response> => {
  try {
    const callbackData = await req.json();
    console.log("M-Pesa callback received:", JSON.stringify(callbackData, null, 2));

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { Body } = callbackData;
    const { stkCallback } = Body;

    if (stkCallback.ResultCode === 0) {
      // Payment successful
      const checkoutRequestId = stkCallback.CheckoutRequestID;
      const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];

      const mpesaReceiptNumber = callbackMetadata.find(
        (item: any) => item.Name === "MpesaReceiptNumber"
      )?.Value;

      console.log("Payment successful. Receipt:", mpesaReceiptNumber);

      // Update reservation
      const { error } = await supabase
        .from("reservations")
        .update({
          payment_status: "completed",
          mpesa_transaction_id: mpesaReceiptNumber,
          status: "confirmed",
        })
        .eq("mpesa_transaction_id", checkoutRequestId);

      if (error) {
        console.error("Error updating reservation:", error);
      }
    } else {
      // Payment failed
      console.log("Payment failed:", stkCallback.ResultDesc);
      
      const checkoutRequestId = stkCallback.CheckoutRequestID;
      await supabase
        .from("reservations")
        .update({
          payment_status: "failed",
          status: "cancelled",
        })
        .eq("mpesa_transaction_id", checkoutRequestId);
    }

    return new Response(
      JSON.stringify({ ResultCode: 0, ResultDesc: "Success" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in mpesa-callback:", error);
    return new Response(
      JSON.stringify({ ResultCode: 1, ResultDesc: "Failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
