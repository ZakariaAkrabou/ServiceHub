import express from 'express';
import { authenticated } from '../middlewares/authMiddleware.js';  
import { isAdmin } from '../middlewares/roleMiddleware.js';        
import {
  searchServices,
  createBooking,
  getBookings,
  updateBookingStatus,
} from '../controllers/customer.controller.js';

const router = express.Router();


router.get('/services', authenticated, searchServices);

router.post('/bookings', authenticated, createBooking);


router.get('/bookings', authenticated, getBookings);


router.patch('/bookings/:id', authenticated, updateBookingStatus);

export default router;