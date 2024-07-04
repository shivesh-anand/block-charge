import express from 'express';
import {
  getCurrentStation,
  verifyCheckIn,
} from '../controllers/stationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/verify-checkin', protect, verifyCheckIn);
router.get('/me', protect, getCurrentStation);

export default router;
