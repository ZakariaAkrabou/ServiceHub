import express from "express";
import { authenticated } from "../middlewares/authMiddleware.js";
import { isCustomer } from "../middlewares/roleMiddleware.js";
import * as customerController from "../controllers/customer.controller.js";

const router = express.Router();

router.get("/services", customerController.getAllServices);
router.get("/services/:id", customerController.getServiceById);

router.get("/search-services", customerController.searchServices);

router.get("/filter-services", customerController.filterServices);

router.post(
  "/create-bookings",
  authenticated,
  customerController.createBooking,
);

router.get("/all-bookings", authenticated, customerController.getBookings);
router.patch(
  "/cancel-bookings/:id",
  authenticated,
  customerController.cancelBooking,
);

router.post("/review", authenticated, customerController.leaveReview);

router.get("/reviews/:serviceId", customerController.getServiceReviews);

router.get("/notifications", authenticated, isCustomer, customerController.getCustomerNotifications);
router.patch("/notifications/read-all", authenticated, isCustomer, customerController.markAllCustomerNotificationsRead);
router.patch("/notifications/:id/read", authenticated, isCustomer, customerController.markCustomerNotificationRead);
router.patch("/bookings/:id/contact-method", authenticated, isCustomer, customerController.setContactMethod);

export default router;
