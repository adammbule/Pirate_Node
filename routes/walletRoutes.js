import express from 'express';
import {
  getWalletHoldings,
  createWallet,
  getWalletById,
  //getAllWallets,
  //linkCoinKeyToWallet
} from '../controllers/walletController.js';
import { verifyJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

// Base: /api/wallets

// Create a new wallet
router.post('/createwallet', verifyJWT, createWallet);

// Get wallet holdings for authenticated user
router.get('/holdings/:walletId', verifyJWT, getWalletHoldings);

// Get wallet by ID (admin or owner)
router.get('/getwallet/:walletId', verifyJWT, getWalletById);

// Get all wallets (optional: for admin/debug)
//router.get('/', verifyJWT, getAllWallets);

// Manually link a CoinKey to a wallet (for special operations or dev tools)
//router.put('/link', verifyJWT, linkCoinKeyToWallet);

export default router;
