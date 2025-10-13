import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, ArrowRight, UtensilsCrossed, Hotel } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Business {
  id: string;
  name: string;
  business_type: 'restaurant' | 'hotel' | 'garden' | 'club';
  description: string;
  location: string;
  phone: string;
  image_url: string;
  rating: number;
  price_range: string;
}

const Home = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filter, setFilter] = useState<'all' | 'restaurant' | 'hotel'>('all');

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('rating', { ascending: false });

    if (error) {
      console.error('Error loading businesses:', error);
    } else {
      setBusinesses(data || []);
    }
  };

  const filteredBusinesses = filter === 'all' 
    ? businesses 
    : businesses.filter(b => b.business_type === filter);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary-glow text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold mb-4">Reserve Your Perfect Experience</h1>
              <p className="text-xl mb-8 opacity-90">
                Book restaurants and hotels across Kenya with secure M-Pesa payments
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link to="#browse">
                  Browse Businesses <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
            <div>
              <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link to="/business-auth">
                  Business Portal
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Section */}
      <section id="browse" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Discover Amazing Places</h2>
            <p className="text-xl text-muted-foreground">
              From fine dining to luxury stays, find your next experience
            </p>
          </div>

          <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="restaurant">
                <UtensilsCrossed className="w-4 h-4 mr-2" />
                Restaurants
              </TabsTrigger>
              <TabsTrigger value="hotel">
                <Hotel className="w-4 h-4 mr-2" />
                Hotels
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <Card key={business.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={business.image_url}
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-1">{business.name}</CardTitle>
                    <Badge variant={business.business_type === 'restaurant' ? 'default' : 'secondary'}>
                      {business.business_type === 'restaurant' ? (
                        <UtensilsCrossed className="w-3 h-3 mr-1" />
                      ) : (
                        <Hotel className="w-3 h-3 mr-1" />
                      )}
                      {business.business_type}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {business.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {business.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-accent text-accent mr-1" />
                        <span className="font-semibold">{business.rating}</span>
                      </div>
                      <span className="text-sm font-medium">{business.price_range}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to={`/business/${business.id}`}>
                      Reserve Now
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
