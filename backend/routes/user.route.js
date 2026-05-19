import express from 'express';
import { getProfile , updateProfile, changePassword} from '../controllers/user.controller.js';
import { authenticated } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.get('/profile', authenticated, getProfile);
import { uploadMiddleware } from '../middlewares/uploadMiddleware.js';
router.put('/update-profile', authenticated, uploadMiddleware, updateProfile);
router.post('/change-password', authenticated, changePassword);
export default router;