import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface Reservation {
  id: string;
  reservation_date: string;
  reservation_time: string;
  number_of_people: number;
  status: string;
  total_amount: number;
  payment_status: string;
  businesses: {
    name: string;
    location: string;
    business_type: string;
  };
}

const Reservations = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      loadReservations(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      loadReservations(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadReservations = async (userId: string) => {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        businesses (
          name,
          location,
          business_type
        )
      `)
      .eq('user_id', userId)
      .order('reservation_date', { ascending: false });

    if (error) {
      console.error('Error loading reservations:', error);
    } else {
      setReservations(data || []);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      case 'completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Reservations</h1>

        {reservations.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No reservations yet</h3>
              <p className="text-muted-foreground">Start exploring and book your first experience!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations.map((reservation) => (
              <Card key={reservation.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-1">
                      {reservation.businesses.name}
                    </CardTitle>
                    <Badge variant={getStatusColor(reservation.status)}>
                      {reservation.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-1">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {reservation.businesses.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                    {new Date(reservation.reservation_date).toLocaleDateString('en-GB')}
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    {reservation.reservation_time}
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                    {reservation.number_of_people} {reservation.number_of_people === 1 ? 'person' : 'people'}
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total:</span>
                      <span className="text-lg font-bold">KSh {reservation.total_amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Payment:</span>
                      <Badge variant={reservation.payment_status === 'completed' ? 'default' : 'secondary'}>
                        {reservation.payment_status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservations;
