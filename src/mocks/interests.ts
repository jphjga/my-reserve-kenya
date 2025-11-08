export interface Interest {
  id: string;
  name: string;
  icon: string;
  category: 'dining' | 'nightlife' | 'accommodation' | 'events' | 'activities';
}

export const interests: Interest[] = [
  // Dining
  { id: '1', name: 'Fine Dining', icon: '🍽️', category: 'dining' },
  { id: '2', name: 'Casual Dining', icon: '🍔', category: 'dining' },
  { id: '3', name: 'Street Food', icon: '🌮', category: 'dining' },
  { id: '4', name: 'Brunch', icon: '🥞', category: 'dining' },
  { id: '5', name: 'Rooftop Dining', icon: '🌆', category: 'dining' },
  
  // Nightlife
  { id: '6', name: 'Nightclubs', icon: '🎉', category: 'nightlife' },
  { id: '7', name: 'Live Music', icon: '🎵', category: 'nightlife' },
  { id: '8', name: 'Cocktail Bars', icon: '🍸', category: 'nightlife' },
  { id: '9', name: 'DJ Events', icon: '🎧', category: 'nightlife' },
  { id: '10', name: 'Karaoke', icon: '🎤', category: 'nightlife' },
  
  // Accommodation
  { id: '11', name: 'Luxury Hotels', icon: '⭐', category: 'accommodation' },
  { id: '12', name: 'Budget Hotels', icon: '🏨', category: 'accommodation' },
  { id: '13', name: 'Boutique Hotels', icon: '🏩', category: 'accommodation' },
  { id: '14', name: 'Resort Stays', icon: '🏖️', category: 'accommodation' },
  { id: '15', name: 'City Center', icon: '🏙️', category: 'accommodation' },
  
  // Events
  { id: '16', name: 'Weddings', icon: '💒', category: 'events' },
  { id: '17', name: 'Corporate Events', icon: '💼', category: 'events' },
  { id: '18', name: 'Birthday Parties', icon: '🎂', category: 'events' },
  { id: '19', name: 'Concerts', icon: '🎸', category: 'events' },
  { id: '20', name: 'Sports Events', icon: '⚽', category: 'events' },
  
  // Activities
  { id: '21', name: 'Garden Events', icon: '🌺', category: 'activities' },
  { id: '22', name: 'Pool Parties', icon: '🏊', category: 'activities' },
  { id: '23', name: 'Wine Tasting', icon: '🍷', category: 'activities' },
  { id: '24', name: 'Cultural Shows', icon: '🎭', category: 'activities' },
  { id: '25', name: 'Outdoor Activities', icon: '🏕️', category: 'activities' },
];
