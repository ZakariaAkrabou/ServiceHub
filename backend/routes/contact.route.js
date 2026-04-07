import express from "express";
import * as contactController from "../controllers/contact.controller.js";
import { authenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:bookingId", authenticated, contactController.getContactMethods);
router.post("/select", authenticated, contactController.selectContactMethod);

export default router;
