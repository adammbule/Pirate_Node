import express from 'express';  // Use import
const router = express.Router();
import { getCollection } from '../controllers/collectionController.js'; // Use import

router.get('/getCollectionItems', getCollection);

export default router; // Use export default