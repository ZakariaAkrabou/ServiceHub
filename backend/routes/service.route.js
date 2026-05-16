import express from 'express';
import * as serviceController from '../controllers/service.controller.js';
import { authenticated } from '../middlewares/authMiddleware.js';
import { uploadMiddleware } from '../middlewares/uploadMiddleware.js';
import { isProvider } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/my-services', authenticated, isProvider, serviceController.getAllServices);
router.post('/create', authenticated, isProvider, uploadMiddleware,  serviceController.createService);
router.get('/service/:id', authenticated, serviceController.getServiceById);
router.put('/update/:id', authenticated, isProvider, uploadMiddleware, serviceController.updateService);
router.delete('/delete/:id', authenticated, isProvider, serviceController.deleteService);

router.get('/my-bookings', authenticated, isProvider, serviceController.getProviderBookings);
router.patch('/bookings/status/:id', authenticated, isProvider, serviceController.updateBookingStatus);

// Provider notification routes
router.get('/notifications', authenticated, isProvider, serviceController.getProviderNotifications);
router.patch('/notifications/:id/read', authenticated, isProvider, serviceController.markProviderNotificationRead);
router.patch('/notifications/read-all', authenticated, isProvider, serviceController.markAllProviderNotificationsRead);

export default router;