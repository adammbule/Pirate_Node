import express from 'express';
import { rentCoinKey, getUserRentals } from '../controllers/coinKeyRentalController.js';
import { verifyJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/new-tenant', verifyJWT, rentCoinKey);
router.get('/my-rentals', verifyJWT, getUserRentals);

export default router;
