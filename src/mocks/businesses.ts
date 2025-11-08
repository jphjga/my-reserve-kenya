export interface Business {
  id: string;
  name: string;
  business_type: 'restaurant' | 'hotel' | 'club' | 'garden';
  description: string;
  location: string;
  rating: number;
  price_range: string;
  image_url: string;
  glow_color: string;
  amenities: string[];
  hours: string;
  phone: string;
  email: string;
}

export const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'The Olive Garden Restaurant',
    business_type: 'restaurant',
    description: 'Experience fine Italian dining with a Kenyan twist. Fresh ingredients, authentic recipes, and stunning ambiance.',
    location: 'Westlands, Nairobi',
    rating: 4.8,
    price_range: 'KSH 2,000 - 5,000',
    image_url: '/placeholder.svg',
    glow_color: 'rgba(255, 100, 50, 0.3)',
    amenities: ['Outdoor Seating', 'Wine Selection', 'Private Dining', 'Valet Parking'],
    hours: '11:00 AM - 11:00 PM',
    phone: '+254 712 345 678',
    email: 'info@olivegardenke.com'
  },
  {
    id: '2',
    name: 'Sarova Stanley Hotel',
    business_type: 'hotel',
    description: 'Luxury accommodation in the heart of Nairobi. Experience world-class service and comfort.',
    location: 'CBD, Nairobi',
    rating: 4.9,
    price_range: 'KSH 15,000 - 35,000',
    image_url: '/placeholder.svg',
    glow_color: 'rgba(50, 150, 255, 0.3)',
    amenities: ['Swimming Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Conference Rooms'],
    hours: '24/7',
    phone: '+254 720 123 456',
    email: 'reservations@sarovastanley.com'
  },
  {
    id: '3',
    name: 'Club Hypnotic',
    business_type: 'club',
    description: "Nairobi's premier nightclub. Experience the best DJs, drinks, and vibes every weekend.",
    location: 'Kilimani, Nairobi',
    rating: 4.6,
    price_range: 'KSH 1,000 - 3,000',
    image_url: '/placeholder.svg',
    glow_color: 'rgba(200, 50, 255, 0.3)',
    amenities: ['VIP Section', 'DJ Booth', 'Dance Floor', 'Bar', 'Outdoor Area'],
    hours: 'Thu-Sat: 9:00 PM - 6:00 AM',
    phone: '+254 735 678 901',
    email: 'bookings@clubhypnotic.com'
  },
  {
    id: '4',
    name: 'Karura Gardens',
    business_type: 'garden',
    description: 'Beautiful garden venue perfect for weddings, corporate events, and private celebrations.',
    location: 'Karura, Nairobi',
    rating: 4.7,
    price_range: 'KSH 50,000 - 150,000',
    image_url: '/placeholder.svg',
    glow_color: 'rgba(50, 200, 100, 0.3)',
    amenities: ['Outdoor Space', 'Gazebo', 'Catering Kitchen', 'Parking', 'Decor Setup'],
    hours: '8:00 AM - 10:00 PM',
    phone: '+254 745 234 567',
    email: 'events@karuragardens.com'
  },
  {
    id: '5',
    name: 'Mama Oliech Restaurant',
    business_type: 'restaurant',
    description: 'Authentic Kenyan cuisine. Famous for fresh fish and traditional dishes.',
    location: 'South B, Nairobi',
    rating: 4.5,
    price_range: 'KSH 800 - 2,000',
    image_url: '/placeholder.svg',
    glow_color: 'rgba(255, 150, 50, 0.3)',
    amenities: ['Outdoor Seating', 'Takeaway', 'Family Friendly'],
    hours: '10:00 AM - 10:00 PM',
    phone: '+254 722 345 678',
    email: 'info@mamaoliech.com'
  },
  {
    id: '6',
    name: 'Tribe Hotel',
    business_type: 'hotel',
    description: 'Boutique hotel with contemporary African design and exceptional service.',
    location: 'Village Market, Nairobi',
    rating: 4.8,
    price_range: 'KSH 20,000 - 45,000',
    image_url: '/placeholder.svg',
    glow_color: 'rgba(100, 100, 255, 0.3)',
    amenities: ['Rooftop Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Business Center'],
    hours: '24/7',
    phone: '+254 730 123 000',
    email: 'stay@tribehotel.com'
  }
];
