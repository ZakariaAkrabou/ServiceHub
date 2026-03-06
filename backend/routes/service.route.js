import express from 'express';
import * as serviceController from '../controllers/service.controller.js';
import { authenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.post('/', authenticated, serviceController.createService);

export default router;