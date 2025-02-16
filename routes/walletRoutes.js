import express from 'express';
import { getWalletHoldings } from '../controllers/walletController.js'; // or `getWalletHoldings` as default

const router = express.Router();

router.get('/wallet', getWalletHoldings); // Ensure this is defined correctly

export default router;
