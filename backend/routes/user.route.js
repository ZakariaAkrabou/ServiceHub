import express from 'express';
import { getProfile , updateProfile} from '../controllers/user.controller.js';
import { authenticated } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.get('/profile', authenticated, getProfile);
router.put('/update-profile', authenticated, updateProfile);
export default router;