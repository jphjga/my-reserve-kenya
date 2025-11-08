export interface Event {
  id: string;
  business_id: string;
  business_name: string;
  business_type: 'restaurant' | 'hotel' | 'club' | 'garden';
  event_type: string;
  title: string;
  description: string;
  date: string;
  time: string;
  price: number;
  image_url: string;
  glow_color: string;
  capacity: number;
  available_slots: number;
}

export const mockEvents: Event[] = [
  {
    id: '1',
    business_id: '1',
    business_name: 'The Olive Garden Restaurant',
    business_type: 'restaurant',
    event_type: 'special_menu',
    title: 'Wine & Dine Wednesday',
    description: 'Special 3-course Italian meal with complimentary wine pairing',
    date: '2025-11-15',
    time: '19:00',
    price: 3500,
    image_url: '/placeholder.svg',
    glow_color: 'rgba(255, 100, 50, 0.3)',
    capacity: 40,
    available_slots: 25
  },
  {
    id: '2',
    business_id: '3',
    business_name: 'Club Hypnotic',
    business_type: 'club',
    event_type: 'party_event',
    title: 'Neon Nights Party',
    description: 'Glow-in-the-dark party with international DJ',
    date: '2025-11-20',
    time: '21:00',
    price: 1500,
    image_url: '/placeholder.svg',
    glow_color: 'rgba(200, 50, 255, 0.3)',
    capacity: 300,
    available_slots: 180
  },
  {
    id: '3',
    business_id: '2',
    business_name: 'Sarova Stanley Hotel',
    business_type: 'hotel',
    event_type: 'spa_package',
    title: 'Weekend Wellness Retreat',
    description: 'Full spa package with accommodation and meals',
    date: '2025-11-22',
    time: '14:00',
    price: 25000,
    image_url: '/placeholder.svg',
    glow_color: 'rgba(50, 150, 255, 0.3)',
    capacity: 20,
    available_slots: 8
  },
  {
    id: '4',
    business_id: '4',
    business_name: 'Karura Gardens',
    business_type: 'garden',
    event_type: 'wedding_venue',
    title: 'Garden Wedding Package',
    description: 'Complete wedding setup with decoration and catering',
    date: '2025-12-07',
    time: '10:00',
    price: 120000,
    image_url: '/placeholder.svg',
    glow_color: 'rgba(50, 200, 100, 0.3)',
    capacity: 200,
    available_slots: 1
  },
  {
    id: '5',
    business_id: '3',
    business_name: 'Club Hypnotic',
    business_type: 'club',
    event_type: 'concert',
    title: 'Afrobeats Live Concert',
    description: 'Live performance by top Kenyan artists',
    date: '2025-11-30',
    time: '20:00',
    price: 2000,
    image_url: '/placeholder.svg',
    glow_color: 'rgba(200, 50, 255, 0.3)',
    capacity: 500,
    available_slots: 320
  },
  {
    id: '6',
    business_id: '5',
    business_name: 'Mama Oliech Restaurant',
    business_type: 'restaurant',
    event_type: 'meal_reservation',
    title: 'Sunday Family Lunch',
    description: 'Special family menu with traditional Kenyan dishes',
    date: '2025-11-17',
    time: '12:00',
    price: 1200,
    image_url: '/placeholder.svg',
    glow_color: 'rgba(255, 150, 50, 0.3)',
    capacity: 60,
    available_slots: 35
  }
];
