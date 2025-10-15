import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import ConversationList from "@/components/ConversationList";
import ConversationView from "@/components/ConversationView";

interface Conversation {
  id: string;
  customerName: string;
  reservationDetails: string;
  lastMessage: string;
  unreadCount: number;
  lastMessageTime: string;
  reservation: {
    date: string;
    time: string;
    people: number;
  };
  businessName: string;
  businessId: string;
}

const Messages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | undefined>(
    searchParams.get("conversation") || undefined
  );

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchConversations();
  };

  useEffect(() => {
    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('customer-messages')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `sender_id=eq.${user.id}`,
          },
          () => fetchConversations()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };
    
    setupRealtime();
  }, []);

  const fetchConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: messages, error } = await supabase
        .from("messages")
        .select(`
          *,
          reservations (
            reservation_date,
            reservation_time,
            number_of_people,
            business_id
          )
        `)
        .eq("sender_id", user.id)
        .eq("is_from_business", false)
        .not("conversation_id", "is", null)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const conversationMap = new Map<string, any>();

      for (const msg of messages || []) {
        const convId = msg.conversation_id;
        if (!conversationMap.has(convId)) {
          const { data: business } = await supabase
            .from("businesses")
            .select("name")
            .eq("id", msg.reservations?.business_id)
            .single();

          const { data: unreadMessages } = await supabase
            .from("messages")
            .select("id", { count: "exact" })
            .eq("conversation_id", convId)
            .eq("is_from_business", true)
            .eq("is_read", false);

          conversationMap.set(convId, {
            id: convId,
            customerName: "You",
            businessName: business?.name || "Business",
            businessId: msg.reservations?.business_id || "",
            reservationDetails: msg.reservations 
              ? `${new Date(msg.reservations.reservation_date).toLocaleDateString()} at ${msg.reservations.reservation_time}`
              : "No reservation",
            lastMessage: msg.message,
            unreadCount: unreadMessages?.length || 0,
            lastMessageTime: new Date(msg.created_at).toLocaleString(),
            reservation: {
              date: msg.reservations?.reservation_date || "",
              time: msg.reservations?.reservation_time || "",
              people: msg.reservations?.number_of_people || 0,
            },
          });
        }
      }

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      <div className="container mx-auto p-4 pt-20">
        <h1 className="text-4xl font-bold mb-6">My Messages</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
          <div className="md:col-span-1">
            <ConversationList
              conversations={conversations}
              onSelectConversation={setSelectedConversation}
              selectedConversationId={selectedConversation}
            />
          </div>
          <div className="md:col-span-2">
            {selectedConv ? (
              <ConversationView
                conversationId={selectedConv.id}
                businessId={selectedConv.businessId}
                reservationDetails={{
                  customerName: selectedConv.businessName,
                  date: selectedConv.reservation.date,
                  time: selectedConv.reservation.time,
                  people: selectedConv.reservation.people,
                }}
                isCustomerView={true}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a conversation to view messages
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
