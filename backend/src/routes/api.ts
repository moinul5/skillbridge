import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { requireRole } from '../middlewares/roleGuard';
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} from '../controllers/item.controller';
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
} from '../controllers/booking.controller';
import {
  getReviews,
  createReview,
  deleteReview
} from '../controllers/review.controller';
import {
  getUsers,
  getCurrentUser,
  updateCurrentUserProfile,
  updateUserRole
} from '../controllers/user.controller';
import {
  getAnalyticsOverview,
  getBookingCharts
} from '../controllers/analytics.controller';
import {
  generateTripPlan,
  getSmartRecommendations,
  generateListingDescription
} from '../controllers/ai.controller';

const router = Router();

// --- PUBLIC ITEMS ROUTES ---
router.get('/items', getItems);
router.get('/items/:id', getItemById);

// --- PROTECTED ITEMS ROUTES (Managers/Admins) ---
router.post('/items', requireAuth, requireRole(['manager', 'admin']), createItem);
router.patch('/items/:id', requireAuth, requireRole(['manager', 'admin']), updateItem);
router.delete('/items/:id', requireAuth, requireRole(['manager', 'admin']), deleteItem);

// --- BOOKINGS ROUTES ---
router.get('/bookings', requireAuth, getBookings);
router.get('/bookings/:id', requireAuth, getBookingById);
router.post('/bookings', requireAuth, createBooking);
router.patch('/bookings/:id', requireAuth, updateBooking);
router.delete('/bookings/:id', requireAuth, requireRole(['admin']), deleteBooking);

// --- REVIEWS ROUTES ---
router.get('/reviews', getReviews);
router.post('/reviews', requireAuth, createReview);
router.delete('/reviews/:id', requireAuth, deleteReview);

// --- USERS ROUTES ---
router.get('/users', requireAuth, requireRole(['admin']), getUsers);
router.get('/users/me', requireAuth, getCurrentUser);
router.patch('/users/me', requireAuth, updateCurrentUserProfile);
router.patch('/users/:id/role', requireAuth, requireRole(['admin']), updateUserRole);

// --- ANALYTICS ROUTES ---
router.get('/analytics/overview', requireAuth, getAnalyticsOverview);
router.get('/analytics/charts', requireAuth, getBookingCharts);

// --- AI ROUTES ---
router.post('/ai/trip-planner', generateTripPlan);
router.post('/ai/recommendations', requireAuth, getSmartRecommendations);
router.post('/ai/listing-description', requireAuth, requireRole(['manager', 'admin']), generateListingDescription);

export default router;
