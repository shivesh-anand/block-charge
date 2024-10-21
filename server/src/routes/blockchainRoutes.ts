import { Router } from "express";
import {
  addTransaction,
  validateBlockchain,
} from "../controllers/blockchainController.js";

const router = Router();

router.post("/add-transaction", addTransaction);
router.get("/validate", validateBlockchain);

export default router;
