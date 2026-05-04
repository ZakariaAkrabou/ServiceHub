import express from 'express';
import { getProfile , updateProfile, changePassword} from '../controllers/user.controller.js';
import { authenticated } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.get('/profile', authenticated, getProfile);
router.put('/update-profile', authenticated, updateProfile);
router.post('/change-password', authenticated, changePassword);
export default router;