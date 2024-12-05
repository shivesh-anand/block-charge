import express from "express";
import {
    verifyElement,
    fetchUsers,
    addItems
} from "../controllers/queueControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/verify", verifyElement);
router.post("/fetch", fetchUsers);
router.post("/add", protect, addItems);

export default router;
