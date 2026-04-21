import express from "express";
import  * as adminController from '../controllers/admin.controller.js';
import { authenticated } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/allusers', authenticated, isAdmin, adminController.allUsers);

router.patch("/providers/:userId/status", authenticated, isAdmin, adminController.updateProviderStatus);   

router.delete("/users/:userId", authenticated, isAdmin, adminController.deleteUser);

router.get("/bookings", authenticated, isAdmin, adminController.getAllBookings);

router.get("/bookings/:id", authenticated, isAdmin, adminController.getBookingById);

router.get("/bookings/filter", authenticated, isAdmin, adminController.filtreBookings);

export default router;
