import express from "express";
import {
  mintTier2Copy,
  rentTier3Copy,
  getTransactionsByPiratecoin,
  getTransactionsByWallet,
} from "../controllers/transactionController.js";

const router = express.Router();

// POST /api/transactions/mint
router.post("/mint", mintTier2Copy);

// POST /api/transactions/rent
router.post("/rent", rentTier3Copy);

// GET /api/transactions/movie/:movieId
router.get("/movie/:movieId", getTransactionsByPiratecoin);

// GET /api/transactions/wallet/:wallet
router.get("/wallet/:wallet", getTransactionsByWallet);

export default router;
