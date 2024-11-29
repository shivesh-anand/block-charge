import express from "express";
import {
  getCurrentUser,
  updateUserPassword,
  updateUserVehicleType,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.put("/password", protect, updateUserPassword);
router.put("/vehicle", protect, updateUserVehicleType);
router.get("/me", protect, getCurrentUser);

export default router;
