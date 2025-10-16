import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  ticket_price: number;
  available_tickets: number;
  image_url: string;
  businesses: {
    name: string;
  };
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();

    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
        },
        () => fetchEvents()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          businesses (name)
        `)
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      <div className="container mx-auto p-4 pt-20">
        <h1 className="text-4xl font-bold mb-8">Upcoming Events</h1>

        {loading ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No upcoming events at the moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>{event.businesses.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">{event.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(event.event_date), 'PPP')} at {event.event_time}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4" />
                      <span className="font-semibold">
                        {event.ticket_price > 0 ? `KSh ${event.ticket_price}` : 'Free Entry'}
                      </span>
                    </div>
                    {event.ticket_price > 0 && (
                      <Badge variant={event.available_tickets > 0 ? "default" : "destructive"}>
                        {event.available_tickets > 0 ? `${event.available_tickets} tickets left` : "Sold Out"}
                      </Badge>
                    )}
                  </div>

                  <Button 
                    className="w-full" 
                    disabled={event.available_tickets === 0}
                    onClick={async () => {
                      // Check if user is logged in and if they're a business user
                      const { data: { session } } = await supabase.auth.getSession();
                      
                      if (!session) {
                        toast({
                          title: "Sign in required",
                          description: "Please sign in to book this event",
                          variant: "destructive",
                        });
                        navigate('/auth');
                        return;
                      }
                      
                      const { data: businessUser } = await supabase
                        .from('business_users')
                        .select('*')
                        .eq('id', session.user.id)
                        .maybeSingle();
                      
                      if (businessUser) {
                        toast({
                          title: "Access Restricted",
                          description: "Business accounts cannot make reservations. Please use a customer account.",
                          variant: "destructive",
                        });
                        return;
                      }
                      
                      navigate(`/book/${event.id}`);
                    }}
                  >
                    {event.available_tickets > 0 ? (event.ticket_price > 0 ? "Buy Tickets" : "Book Now") : "Sold Out"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;