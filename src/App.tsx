import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
const NewHome = lazy(() => import("./pages/NewHome"));
const NewAuth = lazy(() => import("./pages/NewAuth"));
const NewProfile = lazy(() => import("./pages/NewProfile"));
const NewEvents = lazy(() => import("./pages/NewEvents"));
const BusinessDetails = lazy(() => import("./pages/BusinessDetails"));
const Booking = lazy(() => import("./pages/Booking"));
const Reservations = lazy(() => import("./pages/Reservations"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Messages = lazy(() => import("./pages/Messages"));
const BusinessAuth = lazy(() => import("./pages/BusinessAuth"));
const BusinessDashboard = lazy(() => import("./pages/BusinessDashboard"));
const CustomerDashboard = lazy(() => import("./pages/CustomerDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }
        >
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
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
