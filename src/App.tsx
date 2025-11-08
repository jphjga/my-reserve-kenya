import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewHome from "./pages/NewHome";
import NewAuth from "./pages/NewAuth";
import NewProfile from "./pages/NewProfile";
import NewEvents from "./pages/NewEvents";
import BusinessDetails from "./pages/BusinessDetails";
import Booking from "./pages/Booking";
import Reservations from "./pages/Reservations";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import BusinessAuth from "./pages/BusinessAuth";
import BusinessDashboard from "./pages/BusinessDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NewHome />} />
          <Route path="/auth" element={<NewAuth />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/business/:id" element={<BusinessDetails />} />
          <Route path="/book/:id" element={<Booking />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/profile" element={<NewProfile />} />
          <Route path="/events" element={<NewEvents />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/business" element={<BusinessAuth />} />
          <Route path="/business-dashboard" element={<BusinessDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
