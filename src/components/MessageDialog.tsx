import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

interface MessageDialogProps {
  reservationId: string;
  businessId: string;
  businessName: string;
}

const MessageDialog = ({ reservationId, businessId, businessName }: MessageDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const conversationId = `${reservationId}-${user.id}`;

      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        reservation_id: reservationId,
        business_id: businessId,
        sender_id: user.id,
        message: message,
        is_from_business: false,
        is_read: false,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message sent to business",
      });

      setMessage("");
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="mr-2 h-4 w-4" />
          Message Business
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Message to {businessName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            rows={5}
          />
          <Button onClick={handleSend} disabled={loading || !message.trim()} className="w-full">
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
