import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SmartSearch } from "@/components/SmartSearch";
import { GlowingCard } from "@/components/GlowingCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AIChatbot } from "@/components/AIChatbot";
import { mockBusinesses } from "@/mocks/businesses";
import { CardContent } from "@/components/ui/card";
import { MapPin, Star, Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import heroImage from "@/assets/hero-celebration.jpg";

const NewHome = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'restaurant' | 'hotel' | 'club' | 'garden'>('all');

  const filteredBusinesses = mockBusinesses.filter(business => {
    const matchesFilter = filter === 'all' || business.business_type === filter;
    const matchesSearch = searchQuery === '' || 
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/myreserve.png" alt="MyReserve" className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-foreground">MyReserve Kenya</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Get Started
            </Button>
            <Button variant="secondary" onClick={() => navigate('/business')}>
              Business Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">
                AI-Powered Venue Discovery
              </span>
            </div>
            <h1 className="text-6xl font-bold text-foreground mb-6">
              Discover & Reserve Amazing Venues
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              Find the perfect restaurant, hotel, club, or event space in Kenya. 
              Let our AI help you discover venues that match your style.
            </p>
            <SmartSearch
              onSearch={(query) => setSearchQuery(query)}
              className="max-w-3xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Explore Top Venues
            </h2>
            <p className="text-muted-foreground">
              Browse restaurants, hotels, clubs, and gardens
            </p>
          </div>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-8">
          <TabsList className="glass-card">
            <TabsTrigger value="all">All Venues</TabsTrigger>
            <TabsTrigger value="restaurant">🍽️ Restaurants</TabsTrigger>
            <TabsTrigger value="hotel">🏨 Hotels</TabsTrigger>
            <TabsTrigger value="club">🎉 Clubs</TabsTrigger>
            <TabsTrigger value="garden">🌺 Gardens</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <GlowingCard
              key={business.id}
              glowColor={business.glow_color}
              onClick={() => navigate(`/business/${business.id}`)}
            >
              <CardContent className="p-0">
                <div className="h-56 bg-muted rounded-t-lg" />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">
                      {business.business_type === 'restaurant' ? '🍽️' :
                       business.business_type === 'hotel' ? '🏨' :
                       business.business_type === 'club' ? '🎉' : '🌺'}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">
                      {business.business_type}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {business.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {business.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{business.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="text-sm font-medium">{business.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {business.price_range}
                    </span>
                  </div>
                </div>
              </CardContent>
            </GlowingCard>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="glass-card p-12 text-center glow-primary">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users discovering amazing venues every day
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')}>
              Sign Up Now
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/events')}>
              Browse Events
            </Button>
          </div>
        </div>
      </section>

      <AIChatbot />
    </div>
  );
};

export default NewHome;
