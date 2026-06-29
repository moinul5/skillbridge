export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'manager' | 'admin';
  avatarUrl?: string;
  phoneNumber?: string;
  preferences?: {
    interests?: string[];
    budget?: 'budget' | 'moderate' | 'luxury';
    travelStyle?: string;
  };
  createdAt: string;
}

export interface ItineraryItem {
  day: number;
  title: string;
  activities: string[];
}

export interface Item {
  _id: string;
  name: string;
  description: string;
  longDescription: string;
  category: string; // e.g. Adventure, Beach, Cultural, Eco-tourism
  location: string;
  price: number;
  duration: number; // in days
  rating: number;
  reviewsCount: number;
  availability: {
    startDate: string;
    endDate: string;
  };
  images: string[];
  included: string[];
  itinerary: ItineraryItem[];
  highlights: string[];
  tags: string[];
  managerId: string;
  createdAt: string;
}

export interface Booking {
  _id: string;
  itemId: string;
  userId: string;
  startDate: string;
  endDate: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  itemId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}
