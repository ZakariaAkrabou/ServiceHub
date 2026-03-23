import express from 'express';
import { authenticated } from '../middlewares/authMiddleware.js';  
     
import {
  searchServices,
  createBooking,
  getBookings,
  updateBookingStatus,
} from '../controllers/customer.controller.js';

const router = express.Router();


router.get('/search-services', authenticated, searchServices);

router.post('/create-bookings', authenticated, createBooking);


router.get('/all-bookings', authenticated, getBookings);


router.patch('/bookings/status/:id', authenticated, updateBookingStatus);

export default router;