import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlowingCard } from "@/components/GlowingCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AIChatbot } from "@/components/AIChatbot";
import { mockEvents } from "@/mocks/events";
import { CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

const NewEvents = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const [filter, setFilter] = useState<'all' | 'restaurant' | 'hotel' | 'club' | 'garden'>(
    (typeParam as any) || 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = mockEvents.filter(event => {
    const matchesFilter = filter === 'all' || event.business_type === filter;
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.business_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/myreserve.png" alt="MyReserve" className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-foreground">MyReserve</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
            <Button variant="ghost" onClick={() => navigate('/reservations')}>
              My Reservations
            </Button>
            <Button variant="ghost" onClick={() => navigate('/messages')}>
              Messages
            </Button>
            <Button variant="ghost" onClick={() => navigate('/profile')}>
              Profile
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-4xl font-bold text-foreground">
              Discover Events
            </h2>
          </div>
          <p className="text-muted-foreground text-lg">
            Find the perfect event or make a reservation
          </p>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md glass-card"
          />
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-8">
          <TabsList className="glass-card">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="restaurant">🍽️ Restaurants</TabsTrigger>
            <TabsTrigger value="hotel">🏨 Hotels</TabsTrigger>
            <TabsTrigger value="club">🎉 Clubs</TabsTrigger>
            <TabsTrigger value="garden">🌺 Gardens</TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No events found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <GlowingCard
                key={event.id}
                glowColor={event.glow_color}
                onClick={() => navigate(`/book/${event.business_id}`)}
              >
                <CardContent className="p-0">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm px-2 py-1 rounded-full bg-muted capitalize">
                        {event.event_type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {event.business_type}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {event.business_name}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(event.date).toLocaleDateString()} at {event.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>
                          {event.available_slots} / {event.capacity} slots available
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-2xl font-bold text-primary">
                        KSH {event.price.toLocaleString()}
                      </span>
                      <Button size="sm">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </GlowingCard>
            ))}
          </div>
        )}
      </main>

      <AIChatbot />
    </div>
  );
};

export default NewEvents;
