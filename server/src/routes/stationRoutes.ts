import express from 'express';
import {
  addUserToQueue,
  deleteQueueItems,
  getCurrentStation,
  getQueueItems,
  getStationByPlaceId,
  updateStation,
  verifyCheckIn,
} from '../controllers/stationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/verify-checkin', protect, verifyCheckIn);
router.get('/me', protect, getCurrentStation);
router.put('/update', protect, updateStation);
router.get('/station/place/:placeId', protect, getStationByPlaceId);
router.post('/add', protect, addUserToQueue);
router.get('/:placeId', protect, getQueueItems);
router.delete('/:placeId', protect, deleteQueueItems);

export default router;
