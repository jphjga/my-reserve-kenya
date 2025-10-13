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

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    people: '2',
    amount: '5000',
    phone: '',
    specialRequests: '',
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (id) {
      loadBusiness();
    }
  }, [id]);

  const loadBusiness = async () => {
    const { data, error } = await supabase
      .from('businesses')
      .select('id, name, business_type, price_range')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error loading business:', error);
      toast({
        title: "Error",
        description: "Failed to load business details",
        variant: "destructive",
      });
    } else {
      setBusiness(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !business) return;

    setLoading(true);

    try {
      // Create reservation
      const { data: reservation, error: reservationError } = await supabase
        .from('reservations')
        .insert({
          user_id: user.id,
          business_id: business.id,
          reservation_date: formData.date,
          reservation_time: formData.time,
          number_of_people: parseInt(formData.people),
          special_requests: formData.specialRequests,
          total_amount: parseFloat(formData.amount),
          status: 'pending',
        })
        .select()
        .single();

      if (reservationError) throw reservationError;

      // Initiate M-Pesa payment
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

      // Poll for payment confirmation
      setTimeout(() => {
        navigate('/reservations');
      }, 5000);

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

  if (!business) {
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
          <Link to={`/business/${id}`}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Business
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Complete Your Reservation</CardTitle>
            <CardDescription>Book at {business.name}</CardDescription>
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
                <Label htmlFor="people">Number of {business.business_type === 'hotel' ? 'Guests' : 'People'}</Label>
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

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (KSh)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="100"
                  step="100"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Estimated range: {business.price_range}
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

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                <CreditCard className="mr-2 w-5 h-5" />
                {loading ? "Processing..." : `Pay KSh ${formData.amount} via M-Pesa`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Booking;
