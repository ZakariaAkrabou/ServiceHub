import express from "express";
import { leaveReview, getServiceReviews } from "../controllers/customer.controller.js";
import { authenticated } from "../middlewares/authMiddleware.js";
import { isCustomer } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", authenticated, isCustomer, leaveReview);


router.get("/:serviceId", getServiceReviews);

export default router;