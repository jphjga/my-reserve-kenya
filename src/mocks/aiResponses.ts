export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  recommendations?: string[];
}

export const aiGreeting = "Hello! 👋 I'm your AI assistant for MyReserve Kenya. I can help you find restaurants, hotels, clubs, and event venues based on your preferences. What are you looking for today?";

export const aiResponsePatterns = {
  greetings: [
    "Hi there! How can I help you find the perfect venue today?",
    "Hello! I'm here to help you discover amazing places in Nairobi.",
    "Hey! Looking for a great restaurant, hotel, or event venue?"
  ],
  
  search: {
    restaurant: [
      "I found some excellent restaurants based on your preferences. Would you like to see fine dining, casual, or both?",
      "Here are top-rated restaurants in your area. I can filter by cuisine, price range, or location.",
      "Great choice! I've found several restaurants that match your interests."
    ],
    hotel: [
      "I found some wonderful hotels for you. Are you looking for luxury, boutique, or budget-friendly options?",
      "Here are the best hotels in Nairobi. Would you like to filter by amenities or location?",
      "Perfect! I've curated a list of hotels that match your preferences."
    ],
    club: [
      "I found exciting clubs and nightlife spots. Are you interested in DJ nights, live music, or themed parties?",
      "Here are the hottest clubs in town. Would you like to see upcoming events?",
      "Great! I've found clubs that match your nightlife preferences."
    ],
    garden: [
      "I found beautiful garden venues perfect for events. Are you planning a wedding, corporate event, or private celebration?",
      "Here are stunning garden venues available. Would you like to see availability for specific dates?",
      "Excellent! I've found garden venues that match your event needs."
    ]
  },
  
  recommendations: [
    "Based on your interests in {interests}, I recommend checking out these venues:",
    "Given your preference for {category}, you'll love these options:",
    "Perfect match! These venues align with your interests in {interests}:"
  ],
  
  help: [
    "I can help you with:\n• Finding venues by type or location\n• Getting personalized recommendations\n• Checking availability and making bookings\n• Discovering upcoming events\n\nWhat would you like to do?",
    "Here's what I can assist you with:\n• Search for restaurants, hotels, clubs, or gardens\n• Filter by your interests and preferences\n• View event calendars\n• Make reservations\n\nHow can I help?",
    "I'm here to help you:\n• Discover new places\n• Find events that match your interests\n• Compare venues and prices\n• Make bookings quickly\n\nWhat are you looking for?"
  ],
  
  clarification: [
    "Could you tell me more about what you're looking for? For example, what type of venue or event?",
    "I'd love to help! Can you provide more details about your preferences?",
    "To give you the best recommendations, could you share more about what you need?"
  ],
  
  booking: [
    "I can help you book that! Let me show you the available options and you can complete the reservation.",
    "Great choice! I'll guide you through the booking process.",
    "Perfect! Let me pull up the booking form with all the details filled in."
  ],
  
  location: [
    "I'm showing you venues near {location}. Would you like to adjust the search radius?",
    "Based on your location, here are the closest options:",
    "I found several places in {location} that match your criteria."
  ],
  
  fallback: [
    "I'm not sure I understood that. Could you rephrase or ask me about restaurants, hotels, clubs, or garden venues?",
    "I'd love to help! Try asking me about finding a venue, checking events, or making a booking.",
    "I didn't quite catch that. I can help you discover venues, events, and make reservations. What would you like to know?"
  ]
};

export const mockAIRecommendations = [
  {
    id: '1',
    title: 'Weekend Getaway Recommendation',
    description: 'Based on your interest in luxury hotels and fine dining',
    venues: ['2', '1']
  },
  {
    id: '2',
    title: 'Nightlife Experience',
    description: 'Perfect for those who love clubs and live music',
    venues: ['3']
  },
  {
    id: '3',
    title: 'Special Event Planning',
    description: 'Ideal venues for weddings and celebrations',
    venues: ['4']
  }
];

export function getAIResponse(userMessage: string, userInterests: string[] = []): string {
  const message = userMessage.toLowerCase();
  
  // Greetings
  if (message.match(/^(hi|hello|hey|good morning|good evening)/)) {
    return aiResponsePatterns.greetings[Math.floor(Math.random() * aiResponsePatterns.greetings.length)];
  }
  
  // Help requests
  if (message.includes('help') || message.includes('what can you do')) {
    return aiResponsePatterns.help[Math.floor(Math.random() * aiResponsePatterns.help.length)];
  }
  
  // Search by business type
  if (message.includes('restaurant') || message.includes('food') || message.includes('dinner') || message.includes('lunch')) {
    return aiResponsePatterns.search.restaurant[Math.floor(Math.random() * aiResponsePatterns.search.restaurant.length)];
  }
  
  if (message.includes('hotel') || message.includes('stay') || message.includes('accommodation')) {
    return aiResponsePatterns.search.hotel[Math.floor(Math.random() * aiResponsePatterns.search.hotel.length)];
  }
  
  if (message.includes('club') || message.includes('party') || message.includes('nightlife')) {
    return aiResponsePatterns.search.club[Math.floor(Math.random() * aiResponsePatterns.search.club.length)];
  }
  
  if (message.includes('garden') || message.includes('venue') || message.includes('wedding') || message.includes('event')) {
    return aiResponsePatterns.search.garden[Math.floor(Math.random() * aiResponsePatterns.search.garden.length)];
  }
  
  // Booking
  if (message.includes('book') || message.includes('reserve') || message.includes('reservation')) {
    return aiResponsePatterns.booking[Math.floor(Math.random() * aiResponsePatterns.booking.length)];
  }
  
  // Recommendations
  if (message.includes('recommend') || message.includes('suggest') || message.includes('best')) {
    const template = aiResponsePatterns.recommendations[Math.floor(Math.random() * aiResponsePatterns.recommendations.length)];
    return template.replace('{interests}', userInterests.join(', ')) + '\n\n[View Recommendations]';
  }
  
  // Fallback
  return aiResponsePatterns.fallback[Math.floor(Math.random() * aiResponsePatterns.fallback.length)];
}
