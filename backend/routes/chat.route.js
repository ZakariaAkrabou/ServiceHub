import express from "express";

import { authenticated } from "../middlewares/authMiddleware.js";
import * as chatController from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/:bookingId", authenticated, chatController.getChatMessages);

export default router;