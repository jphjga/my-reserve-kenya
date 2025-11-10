import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import ConversationList from "@/components/ConversationList";
import ConversationView from "@/components/ConversationView";
import { supabase } from "@/integrations/supabase/client";

interface Conversation {
  id: string;
  conversationId: string;
  customerName: string;
  businessName: string;
  businessId: string;
  reservationDate: string;
  reservationTime: string;
  reservationPeople: number;
  lastMessage: string;
  unreadCount: number;
  lastMessageTime: string;
}

const Messages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    await fetchConversations(session.user.id);
  };

  const fetchConversations = async (userId: string) => {
    try {
      const { data: messages } = await supabase
        .from("messages")
        .select(`
          *,
          reservations (
            id,
            reservation_date,
            reservation_time,
            number_of_people,
            businesses (
              id,
              name
            )
          )
        `)
        .eq("sender_id", userId)
        .not("conversation_id", "is", null)
        .order("created_at", { ascending: false });

      const conversationMap = new Map<string, any>();

      for (const msg of messages || []) {
        const convId = msg.conversation_id;
        if (!conversationMap.has(convId) && msg.reservations) {
          const { data: unreadMessages } = await supabase
            .from("messages")
            .select("id", { count: "exact" })
            .eq("conversation_id", convId)
            .eq("is_from_business", true)
            .eq("is_read", false);

          conversationMap.set(convId, {
            id: convId,
            conversationId: convId,
            customerName: "You",
            businessName: (msg.reservations as any).businesses.name,
            businessId: (msg.reservations as any).businesses.id,
            reservationDate: (msg.reservations as any).reservation_date,
            reservationTime: (msg.reservations as any).reservation_time,
            reservationPeople: (msg.reservations as any).number_of_people,
            lastMessage: msg.message,
            unreadCount: unreadMessages?.length || 0,
            lastMessageTime: new Date(msg.created_at).toLocaleString(),
          });
        }
      }

      setConversations(Array.from(conversationMap.values()));
      
      // Auto-select from URL
      const conversationId = searchParams.get("conversation");
      if (conversationId) {
        setSelectedConversationId(conversationId);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Messages</h1>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No conversations yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-[350px_1fr] gap-6">
            <ConversationList
              conversations={conversations.map(c => ({
                id: c.id,
                customerName: c.customerName,
                reservationDetails: `${c.businessName} - ${c.reservationDate}`,
                lastMessage: c.lastMessage,
                unreadCount: c.unreadCount,
                lastMessageTime: c.lastMessageTime,
              }))}
              selectedConversationId={selectedConversationId}
              onSelectConversation={setSelectedConversationId}
            />
            <div>
              {selectedConv ? (
                <ConversationView
                  conversationId={selectedConv.conversationId}
                  businessId={selectedConv.businessId}
                  reservationDetails={{
                    customerName: selectedConv.customerName,
                    date: selectedConv.reservationDate,
                    time: selectedConv.reservationTime,
                    people: selectedConv.reservationPeople,
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-96 text-muted-foreground">
                  Select a conversation to view messages
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
