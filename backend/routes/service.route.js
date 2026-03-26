import express from 'express';
import * as serviceController from '../controllers/service.controller.js';
import { authenticated } from '../middlewares/authMiddleware.js';
import { uploadMiddleware } from '../middlewares/uploadMiddleware.js';
import { isProvider } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/all', authenticated, serviceController.getAllServices);
router.post('/create', authenticated, uploadMiddleware, isProvider, serviceController.createService);
router.get('/service/:id', authenticated, isProvider, serviceController.getServiceById);
router.delete('/delete/:id', authenticated, isProvider, serviceController.deleteService);

export default router;