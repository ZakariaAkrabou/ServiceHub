import express from "express";
import { leaveReview, getServiceReviews, deleteReview, updateReview } from "../controllers/customer.controller.js";
import { authenticated } from "../middlewares/authMiddleware.js";
import { isCustomer } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", authenticated, isCustomer, leaveReview);


router.get("/:serviceId", getServiceReviews);

router.delete("/:reviewId", authenticated, isCustomer, deleteReview);
router.put("/:reviewId", authenticated, isCustomer, updateReview);

export default router;