import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BusinessDetailsManager from "@/components/BusinessDetailsManager";
import EventsManager from "@/components/EventsManager";
import BusinessMessagesRefactored from "@/components/BusinessMessagesRefactored";
import BusinessProfileCompletion from "@/components/BusinessProfileCompletion";
import { Building2, Calendar, MessageSquare, LogOut, Home } from "lucide-react";
import { Link } from "react-router-dom";

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/business-auth");
        return;
      }

      const { data: businessUser, error } = await supabase
        .from("business_users")
        .select("business_id")
        .eq("id", user.id)
        .single();

      if (error || !businessUser) {
        await supabase.auth.signOut();
        navigate("/business-auth");
        return;
      }

      setBusinessId(businessUser.business_id);

      // Check if profile is completed
      const { data: businessData, error: businessDataError } = await supabase
        .from("businesses")
        .select("profile_completed")
        .eq("id", businessUser.business_id)
        .single();

      if (!businessDataError && businessData) {
        setProfileCompleted(businessData.profile_completed || false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      navigate("/business-auth");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/business-auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!businessId) {
    return null;
  }

  if (!profileCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <div className="mb-4 flex justify-end">
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
          <BusinessProfileCompletion 
            businessId={businessId} 
            onComplete={() => setProfileCompleted(true)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Business Dashboard</h1>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">
              <Building2 className="mr-2 h-4 w-4" />
              Business Details
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="mr-2 h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Manage Business Details</CardTitle>
                <CardDescription>Update your business information and images</CardDescription>
              </CardHeader>
              <CardContent>
                <BusinessDetailsManager businessId={businessId} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Manage Events</CardTitle>
                <CardDescription>Create and manage your business events</CardDescription>
              </CardHeader>
              <CardContent>
                <EventsManager businessId={businessId} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Customer conversations</CardDescription>
              </CardHeader>
              <CardContent>
                <BusinessMessagesRefactored businessId={businessId} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BusinessDashboard;