import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import ConversationList from "@/components/ConversationList";
import ConversationView from "@/components/ConversationView";

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

const mockConversations: Conversation[] = [
  {
    id: "1",
    conversationId: "conv-1",
    customerName: "John Doe",
    businessName: "Grand Hotel",
    businessId: "bus-1",
    reservationDate: "2024-12-25",
    reservationTime: "14:00",
    reservationPeople: 2,
    lastMessage: "What time is check-in?",
    unreadCount: 2,
    lastMessageTime: "2 hours ago",
  },
  {
    id: "2",
    conversationId: "conv-2",
    customerName: "Jane Smith",
    businessName: "Ocean View Restaurant",
    businessId: "bus-2",
    reservationDate: "2024-12-24",
    reservationTime: "19:00",
    reservationPeople: 4,
    lastMessage: "Can we add dietary restrictions?",
    unreadCount: 0,
    lastMessageTime: "5 hours ago",
  },
];

const Messages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>();

  useEffect(() => {
    // Mock auth check
    const isLoggedIn = sessionStorage.getItem("mock-logged-in");
    if (!isLoggedIn) {
      navigate("/auth");
      return;
    }

    // Load mock conversations
    setConversations(mockConversations);
    
    // Auto-select conversation from URL
    const conversationId = searchParams.get("conversation");
    if (conversationId) {
      const conv = mockConversations.find(c => c.conversationId === conversationId);
      if (conv) setSelectedConversationId(conv.id);
    }
  }, [navigate, searchParams]);

  const selectedConv = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Messages</h1>
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
      </div>
    </div>
  );
};

export default Messages;
