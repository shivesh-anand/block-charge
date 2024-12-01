import express from "express";
import {
    clearElement,
    verifyElement
} from "../controllers/queueControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/verify", verifyElement);
router.post("/clear", protect, clearElement);

export default router;
