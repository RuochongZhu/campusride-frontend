import express from 'express';
import { 
  createRide, 
  getRides, 
  getRideById, 
  updateRide, 
  deleteRide,
  bookRide,
  getMyRides,
  getMyBookings,
  cancelBooking,
  completeRide
} from '../controllers/rideshare.controller.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// All rideshare routes require authentication
router.use(authenticateToken);

// Rides management
// POST /api/v1/rideshare/rides
router.post('/rides', asyncHandler(createRide));

// GET /api/v1/rideshare/rides - Search rides
router.get('/rides', asyncHandler(getRides));

// GET /api/v1/rideshare/rides/:id
router.get('/rides/:id', asyncHandler(getRideById));

// PUT /api/v1/rideshare/rides/:id
router.put('/rides/:id', asyncHandler(updateRide));

// DELETE /api/v1/rideshare/rides/:id
router.delete('/rides/:id', asyncHandler(deleteRide));

// My rides (as driver)
// GET /api/v1/rideshare/my-rides
router.get('/my-rides', asyncHandler(getMyRides));

// Booking management
// POST /api/v1/rideshare/rides/:id/book
router.post('/rides/:id/book', asyncHandler(bookRide));

// GET /api/v1/rideshare/my-bookings
router.get('/my-bookings', asyncHandler(getMyBookings));

// DELETE /api/v1/rideshare/bookings/:id
router.delete('/bookings/:id', asyncHandler(cancelBooking));

// POST /api/v1/rideshare/rides/:id/complete
router.post('/rides/:id/complete', asyncHandler(completeRide));

export default router; 