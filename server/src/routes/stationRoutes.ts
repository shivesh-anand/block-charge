import express from "express";
import {
  addUserToQueue,
  deleteQueueItems,
  getCurrentStation,
  getQueueItems,
  getStationByPlaceId,
  updateStation,
  verifyCheckIn,
} from "../controllers/stationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// router.use(protect);
router.post("/verify-checkin", verifyCheckIn);
router.get("/me", getCurrentStation);
router.put("/update", updateStation);
router.get("/station/place/:placeId", getStationByPlaceId);
router.post("/add", addUserToQueue);
router.get("/:placeId", getQueueItems);
router.delete("/:placeId", deleteQueueItems);

export default router;
