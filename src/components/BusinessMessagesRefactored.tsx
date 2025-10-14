import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ConversationList from "./ConversationList";
import ConversationView from "./ConversationView";

interface BusinessMessagesRefactoredProps {
  businessId: string;
}

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
}

const BusinessMessagesRefactored = ({ businessId }: BusinessMessagesRefactoredProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | undefined>();

  useEffect(() => {
    fetchConversations();

    const channel = supabase
      .channel('business-conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `business_id=eq.${businessId}`,
        },
        () => fetchConversations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId]);

  const fetchConversations = async () => {
    try {
      const { data: messages, error } = await supabase
        .from("messages")
        .select(`
          *,
          reservations (
            reservation_date,
            reservation_time,
            number_of_people
          )
        `)
        .eq("business_id", businessId)
        .not("conversation_id", "is", null)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const conversationMap = new Map<string, any>();

      for (const msg of messages || []) {
        const convId = msg.conversation_id;
        if (!conversationMap.has(convId)) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", msg.sender_id)
            .single();

          const { data: unreadMessages } = await supabase
            .from("messages")
            .select("id", { count: "exact" })
            .eq("conversation_id", convId)
            .eq("is_from_business", false)
            .eq("is_read", false);

          conversationMap.set(convId, {
            id: convId,
            customerName: profile?.full_name || "Customer",
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
            businessId={businessId}
            reservationDetails={{
              customerName: selectedConv.customerName,
              date: selectedConv.reservation.date,
              time: selectedConv.reservation.time,
              people: selectedConv.reservation.people,
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select a conversation to view messages
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessMessagesRefactored;
