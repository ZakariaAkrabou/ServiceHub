import express from "express";
import { registerUser, verifyEmail,loginUser,forgotPassword,resetPassword} from "../controllers/auth.controller.js";
import { registerValidator,loginValidator} from "../validators/userValidator.js";   

const router = express.Router();

router.post("/register", registerUser , registerValidator);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", loginUser, loginValidator);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
