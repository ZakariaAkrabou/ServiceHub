import express from "express";
import  * as adminController from '../controllers/admin.controller.js';
import { authenticated } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/allusers', authenticated, isAdmin, adminController.allUsers);

router.patch("/providers/:userId/status", authenticated, isAdmin, adminController.updateProviderStatus);   

router.delete("/users/:userId", authenticated, isAdmin, adminController.deleteUser);

router.get("/bookings", authenticated, isAdmin, adminController.getAllBookings);

router.get("/bookings/filter", authenticated, isAdmin, adminController.filtreBookings);

router.get("/bookings/:id", authenticated, isAdmin, adminController.getBookingById);

router.get("/bookings/filter", authenticated, isAdmin, adminController.filtreBookings);

router.put("/users/ban/:userId", authenticated, isAdmin, adminController.banUser);
router.put("/users/unban/:userId", authenticated, isAdmin, adminController.unbanUser);
router.get("/services", authenticated, isAdmin, adminController.getAllServices);
router.get("/services/:id", authenticated, isAdmin, adminController.getServiceById);

export default router;
