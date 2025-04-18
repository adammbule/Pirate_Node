import express from 'express';
import {
  mintCoinKey,
  createTierIICopies,
  transferCoinKey,
  createTierIIIRental,
  getTierIIIRenters,
  revokeTierIIIRental
} from '../controllers/coinKeyController.js';
import { verifyJWT } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/mint', verifyJWT, mintCoinKey);
router.post('/clone-tier-ii', verifyJWT, createTierIICopies);
router.post('/transfer', verifyJWT, transferCoinKey);
router.post('/rent-tier-iii', verifyJWT, createTierIIIRental);
router.get('/tier-iii/:tierIIId/renters', verifyJWT, getTierIIIRenters);
router.delete('/tier-iii/:keyId/revoke', verifyJWT, revokeTierIIIRental);


export default router;
