import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

interface Conversation {
  id: string;
  customerName: string;
  reservationDetails: string;
  lastMessage: string;
  unreadCount: number;
  lastMessageTime: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (conversationId: string) => void;
  selectedConversationId?: string;
}

const ConversationList = ({
  conversations,
  onSelectConversation,
  selectedConversationId,
}: ConversationListProps) => {
  if (conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <Card
          key={conversation.id}
          className={`cursor-pointer transition-colors hover:bg-accent ${
            selectedConversationId === conversation.id ? "bg-accent" : ""
          }`}
          onClick={() => onSelectConversation(conversation.id)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{conversation.customerName}</h3>
                <p className="text-sm text-muted-foreground">{conversation.reservationDetails}</p>
              </div>
              {conversation.unreadCount > 0 && (
                <Badge variant="destructive">{conversation.unreadCount}</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
            <p className="text-xs text-muted-foreground mt-1">{conversation.lastMessageTime}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ConversationList;
