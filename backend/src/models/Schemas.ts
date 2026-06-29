import mongoose, { Schema } from 'mongoose';
import { User, Item, Booking, Review, ItineraryItem } from '../types';

const UserSchema = new Schema<User>({
  _id: { type: String, required: true }, // Clerk or Firebase Auth UID
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'manager', 'admin'], default: 'user' },
  avatarUrl: { type: String },
  phoneNumber: { type: String },
  preferences: {
    interests: [{ type: String }],
    budget: { type: String, enum: ['budget', 'moderate', 'luxury'] },
    travelStyle: { type: String }
  },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

const ItinerarySchema = new Schema<ItineraryItem>({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  activities: [{ type: String, required: true }]
}, { _id: false });

const ItemSchema = new Schema<Item>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  rating: { type: Number, default: 5 },
  reviewsCount: { type: Number, default: 0 },
  availability: {
    startDate: { type: String, required: true },
    endDate: { type: String, required: true }
  },
  images: [{ type: String }],
  included: [{ type: String }],
  itinerary: [ItinerarySchema],
  highlights: [{ type: String }],
  tags: [{ type: String }],
  managerId: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

const BookingSchema = new Schema<Booking>({
  _id: { type: String, required: true },
  itemId: { type: String, required: true },
  userId: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  guests: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  contactName: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  notes: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

const ReviewSchema = new Schema<Review>({
  _id: { type: String, required: true },
  itemId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

export const UserModel = mongoose.models.User || mongoose.model<User>('User', UserSchema);
export const ItemModel = mongoose.models.Item || mongoose.model<Item>('Item', ItemSchema);
export const BookingModel = mongoose.models.Booking || mongoose.model<Booking>('Booking', BookingSchema);
export const ReviewModel = mongoose.models.Review || mongoose.model<Review>('Review', ReviewSchema);
export default { UserModel, ItemModel, BookingModel, ReviewModel };
