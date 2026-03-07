import express from 'express';
import * as serviceController from '../controllers/service.controller.js';
import { authenticated } from '../middlewares/authMiddleware.js';
import { uploadMiddleware } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/all', authenticated, serviceController.getAllServices);
router.get('/service/:id', authenticated, serviceController.getServiceById);
router.post('/create', authenticated, uploadMiddleware, serviceController.createService);

export default router;