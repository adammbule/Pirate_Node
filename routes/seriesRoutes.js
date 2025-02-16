import express from 'express';
import getTrendingSeries from '../controllers/seriesController.js'; // Import correctly

const router = express.Router();

router.get('/trending', getTrendingSeries); // Use the imported function

export default router;