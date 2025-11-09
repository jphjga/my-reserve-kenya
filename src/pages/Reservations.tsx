import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import MessageDialog from "@/components/MessageDialog";

interface Reservation {
  id: string;
  businesses: {
    id: string;
    name: string;
    location: string;
  };
  date: string;
  time: string;
  number_of_people: number;
  total_amount: number;
  payment_status: string;
  status: string;
}

const mockReservations: Reservation[] = [
  {
    id: "1",
    businesses: {
      id: "bus-1",
      name: "Grand Hotel & Spa",
      location: "Nairobi, Kenya",
    },
    date: "2024-12-25",
    time: "14:00",
    number_of_people: 2,
    total_amount: 25000,
    payment_status: "completed",
    status: "confirmed",
  },
  {
    id: "2",
    businesses: {
      id: "bus-2",
      name: "Ocean View Restaurant",
      location: "Mombasa, Kenya",
    },
    date: "2024-12-24",
    time: "19:00",
    number_of_people: 4,
    total_amount: 8000,
    payment_status: "pending",
    status: "pending",
  },
];

const Reservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    // Mock auth check
    const isLoggedIn = sessionStorage.getItem("mock-logged-in");
    if (!isLoggedIn) {
      navigate("/auth");
      return;
    }

    // Load mock reservations
    setReservations(mockReservations);
  }, [navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Reservations</h1>
        {reservations.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No reservations yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {reservations.map((reservation) => (
              <Card key={reservation.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{reservation.businesses.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {reservation.businesses.location}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusColor(reservation.status)}>
                      {reservation.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{reservation.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{reservation.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{reservation.number_of_people} people</span>
                    </div>
                    <div>
                      <span className="text-sm font-semibold">
                        KSh {reservation.total_amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant={reservation.payment_status === "completed" ? "default" : "outline"}>
                      Payment: {reservation.payment_status}
                    </Badge>
                    <MessageDialog
                      reservationId={reservation.id}
                      businessId={reservation.businesses.id}
                      businessName={reservation.businesses.name}
                    />
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
