import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface Business {
  id: string;
  name: string;
  business_type: 'restaurant' | 'hotel' | 'garden' | 'club';
  price_range: string;
}

interface Event {
  id: string;
  title: string;
  event_type: 'time_based_event' | 'service_booking';
  requires_upfront_payment: boolean;
  booking_item_type?: string;
  available_tickets: number;
  ticket_price: number;
  business_id: string;
}

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    people: '2',
    amount: '5000',
    phone: '',
    specialRequests: '',
    bookingItem: '',
  });

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      
      // Check if user is a business user
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
        navigate('/');
        return;
      }
      
      setUser(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      
      // Check if user is a business user
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
        navigate('/');
        return;
      }
      
      setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  useEffect(() => {
    if (id) {
      loadEventAndBusiness();
    }
  }, [id]);

  const loadEventAndBusiness = async () => {
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('id, title, event_type, requires_upfront_payment, booking_item_type, available_tickets, ticket_price, business_id')
      .eq('id', id)
      .maybeSingle();

    if (eventError || !eventData) {
      console.error('Error loading event:', eventError);
      toast({
        title: 'Event not found',
        description: 'The selected event could not be found. Please try another.',
        variant: 'destructive',
      });
      navigate('/events');
      return;
    }

    setEvent(eventData);

    const { data: businessData, error: businessError } = await supabase
      .from('businesses')
      .select('id, name, business_type, price_range')
      .eq('id', eventData.business_id)
      .maybeSingle();

    if (businessError || !businessData) {
      console.error('Error loading business:', businessError);
      toast({
        title: 'Business not found',
        description: 'We could not load the business for this event.',
        variant: 'destructive',
      });
      navigate('/events');
      return;
    } else {
      setBusiness(businessData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !event) return;

    if (event.available_tickets === 0) {
      toast({
        title: "Sold Out",
        description: "This event is fully booked",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const reservationData: any = {
        user_id: user.id,
        business_id: business?.id,
        reservation_date: formData.date,
        reservation_time: formData.time,
        number_of_people: parseInt(formData.people),
        special_requests: formData.specialRequests,
        total_amount: parseFloat(formData.amount),
        status: 'pending',
        payment_status: event.requires_upfront_payment ? 'pending' : 'pay_on_arrival',
      };

      if (event.event_type === 'service_booking') {
        reservationData.booking_item_description = formData.bookingItem;
      }

      const { data: reservation, error: reservationError } = await supabase
        .from('reservations')
        .insert(reservationData)
        .select()
        .single();

      if (reservationError) throw reservationError;

      if (event.requires_upfront_payment) {
        const { data: paymentData, error: paymentError } = await supabase.functions.invoke('initiate-mpesa-payment', {
          body: {
            phone: formData.phone,
            amount: parseFloat(formData.amount),
            reservationId: reservation.id,
          },
        });

        if (paymentError) throw paymentError;

        toast({
          title: "Payment initiated!",
          description: "Please check your phone and enter your M-Pesa PIN to complete the payment.",
        });
      } else {
        toast({
          title: "Booking confirmed!",
          description: "You can pay when you arrive at the venue.",
        });
      }

      await supabase
        .from('events')
        .update({ available_tickets: event.available_tickets - 1 })
        .eq('id', id);

      setTimeout(() => {
        navigate('/reservations');
      }, 3000);

    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create reservation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!event || !business) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/events">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Events
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Complete Your Booking</CardTitle>
            <CardDescription>{event.title} at {business.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="people">Number of People</Label>
                <Input
                  id="people"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.people}
                  onChange={(e) => setFormData({ ...formData, people: e.target.value })}
                  required
                />
              </div>

              {event.event_type === 'service_booking' && (
                <div className="space-y-2">
                  <Label htmlFor="bookingItem">What are you booking? ({event.booking_item_type})</Label>
                  <Input
                    id="bookingItem"
                    placeholder={`e.g., ${event.booking_item_type}`}
                    value={formData.bookingItem}
                    onChange={(e) => setFormData({ ...formData, bookingItem: e.target.value })}
                    required
                  />
                </div>
              )}

              {event.requires_upfront_payment ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (KSh)</Label>
                    <Input
                      id="amount"
                      type="number"
                      min={event.ticket_price}
                      step="100"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Ticket price: KSh {event.ticket_price}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">M-Pesa Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="254712345678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter your M-Pesa registered phone number (format: 254XXXXXXXXX)
                    </p>
                  </div>
                </>
              ) : (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-semibold">Payment on Arrival</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    You will pay when you arrive at the venue
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="requests">Special Requests (Optional)</Label>
                <Textarea
                  id="requests"
                  placeholder="Any special requirements or preferences?"
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  rows={4}
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading || event.available_tickets === 0}>
                {event.available_tickets === 0 ? (
                  "Sold Out"
                ) : loading ? (
                  "Processing..."
                ) : event.requires_upfront_payment ? (
                  <>
                    <CreditCard className="mr-2 w-5 h-5" />
                    Pay KSh {formData.amount} via M-Pesa
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Booking;
