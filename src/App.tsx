import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import BusinessDetails from "./pages/BusinessDetails";
import Booking from "./pages/Booking";
import Reservations from "./pages/Reservations";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import BusinessAuth from "./pages/BusinessAuth";
import BusinessDashboard from "./pages/BusinessDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/business/:id" element={<BusinessDetails />} />
          <Route path="/book/:id" element={<Booking />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/events" element={<Events />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/business-auth" element={<BusinessAuth />} />
          <Route path="/business-dashboard" element={<BusinessDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
