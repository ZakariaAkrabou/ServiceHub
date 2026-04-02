import express from 'express';
import { authenticated } from '../middlewares/authMiddleware.js';  
     
import * as customerController from '../controllers/customer.controller.js';

const router = express.Router();


router.get('/services', customerController.getAllServices);

router.get('/search-services', customerController.searchServices);

router.get('/filter-services', customerController.filterServices);

router.post('/create-bookings', authenticated, customerController.createBooking);


router.get('/all-bookings', authenticated, customerController.getBookings);
router.patch('/cancel-bookings/:id', authenticated, customerController.cancelBooking);




export default router;