import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Phone, Calendar, ArrowLeft, Hotel, UtensilsCrossed } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface Business {
  id: string;
  name: string;
  business_type: 'restaurant' | 'hotel' | 'garden' | 'club';
  description: string;
  location: string;
  phone: string;
  email: string;
  image_url: string;
  rating: number;
  price_range: string;
}

const BusinessDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (id) {
      loadBusiness();
    }
  }, [id]);

  const loadBusiness = async () => {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error loading business:', error);
    } else {
      setBusiness(data);
    }
  };

  const handleReserveClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate(`/book/${id}`);
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
      
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Browse
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img
              src={business.image_url}
              alt={business.name}
              className="w-full aspect-video object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-4xl font-bold">{business.name}</h1>
                <Badge variant={business.business_type === 'restaurant' ? 'default' : 'secondary'}>
                  {business.business_type === 'restaurant' ? (
                    <UtensilsCrossed className="w-4 h-4 mr-2" />
                  ) : (
                    <Hotel className="w-4 h-4 mr-2" />
                  )}
                  {business.business_type}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 fill-accent text-accent mr-1" />
                  <span className="font-semibold text-lg">{business.rating}</span>
                </div>
                <span>•</span>
                <span className="font-medium">{business.price_range}</span>
              </div>

              <p className="text-lg">{business.description}</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-muted-foreground" />
                  <span>{business.location}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-muted-foreground" />
                  <span>{business.phone}</span>
                </div>
              </CardContent>
            </Card>

            <Button size="lg" className="w-full" onClick={handleReserveClick}>
              <Calendar className="mr-2 w-5 h-5" />
              Make a Reservation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;
