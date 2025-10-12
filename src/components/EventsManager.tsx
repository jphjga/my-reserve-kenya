import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";

interface EventsManagerProps {
  businessId: string;
}

const EventsManager = ({ businessId }: EventsManagerProps) => {
  const { toast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [businessId]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("business_id", businessId)
        .order("event_date", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const totalTickets = parseInt(formData.get("total_tickets") as string);

      const newEvent = {
        business_id: businessId,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        event_date: formData.get("event_date") as string,
        event_time: formData.get("event_time") as string,
        location: formData.get("location") as string,
        ticket_price: parseFloat(formData.get("ticket_price") as string),
        total_tickets: totalTickets,
        available_tickets: totalTickets,
        image_url: formData.get("image_url") as string,
      };

      const { error } = await supabase
        .from("events")
        .insert(newEvent);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event created successfully",
      });

      setShowForm(false);
      fetchEvents();
      (e.target as HTMLFormElement).reset();
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

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event deleted successfully",
      });

      fetchEvents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Button onClick={() => setShowForm(!showForm)} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        {showForm ? "Cancel" : "Create New Event"}
      </Button>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" name="title" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event_date">Date</Label>
                  <Input id="event_date" name="event_date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event_time">Time</Label>
                  <Input id="event_time" name="event_time" type="time" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ticket_price">Ticket Price (KSh)</Label>
                  <Input id="ticket_price" name="ticket_price" type="number" step="0.01" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total_tickets">Total Tickets</Label>
                  <Input id="total_tickets" name="total_tickets" type="number" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input id="image_url" name="image_url" />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating..." : "Create Event"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{event.title}</CardTitle>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(event.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><strong>Date:</strong> {event.event_date}</p>
                <p><strong>Time:</strong> {event.event_time}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Price:</strong> KSh {event.ticket_price}</p>
                <p><strong>Available:</strong> {event.available_tickets}/{event.total_tickets}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventsManager;