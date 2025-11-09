import { useNavigate } from "react-router-dom";
import { GlowingCard } from "@/components/GlowingCard";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AIChatbot } from "@/components/AIChatbot";
import { mockBusinesses } from "@/mocks/businesses";
import { mockEvents } from "@/mocks/events";
import { CardContent } from "@/components/ui/card";
import { MapPin, Star, Calendar, TrendingUp, Sparkles } from "lucide-react";

const CustomerDashboard = () => {
  const navigate = useNavigate();

  // Mock data for prototype
  const recommendedBusinesses = mockBusinesses.slice(0, 3);
  const trendingEvents = mockEvents.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/myreserve.png" alt="MyReserve" className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-foreground">MyReserve</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/events')}>
              Events
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
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-2">
            Welcome Back! 👋
          </h2>
          <p className="text-muted-foreground text-lg">
            Discover amazing venues and events tailored just for you
          </p>
        </div>

        {/* AI Recommendations */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-bold text-foreground">
              Recommended For You
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedBusinesses.map((business) => (
              <GlowingCard
                key={business.id}
                glowColor={business.glow_color}
                onClick={() => navigate(`/business/${business.id}`)}
              >
                <CardContent className="p-0">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <div className="p-4">
                    <h4 className="font-semibold text-foreground mb-1">
                      {business.name}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{business.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="text-sm font-medium">{business.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        • {business.price_range}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </GlowingCard>
            ))}
          </div>
        </section>

        {/* Trending Events */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6 text-secondary" />
            <h3 className="text-2xl font-bold text-foreground">
              Trending Events
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingEvents.map((event) => (
              <GlowingCard
                key={event.id}
                glowColor={event.glow_color}
                onClick={() => navigate(`/book/${event.business_id}`)}
              >
                <CardContent className="p-0">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <div className="p-4">
                    <h4 className="font-semibold text-foreground mb-1">
                      {event.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {event.business_name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-lg font-bold text-primary">
                        KSH {event.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </GlowingCard>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h3 className="text-2xl font-bold text-foreground mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              size="lg"
              className="h-24 flex-col gap-2"
              onClick={() => navigate('/events?type=restaurant')}
            >
              <span className="text-2xl">🍽️</span>
              <span>Restaurants</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-24 flex-col gap-2"
              onClick={() => navigate('/events?type=hotel')}
            >
              <span className="text-2xl">🏨</span>
              <span>Hotels</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-24 flex-col gap-2"
              onClick={() => navigate('/events?type=club')}
            >
              <span className="text-2xl">🎉</span>
              <span>Clubs</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-24 flex-col gap-2"
              onClick={() => navigate('/events?type=garden')}
            >
              <span className="text-2xl">🌺</span>
              <span>Gardens</span>
            </Button>
          </div>
        </section>
      </main>

      <AIChatbot />
    </div>
  );
};

export default CustomerDashboard;
