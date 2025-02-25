import express from 'express';
import { getTrendingSeries, getSeriesDetails, getSeasonDetails } from '../controllers/seriesController.js'; // Import correctly

const router = express.Router();

router.get('/trendingseries', getTrendingSeries); // Use the imported function
router.get('/getSeriesDetails/:seriesid', getSeriesDetails);
router.get('/getSeriesDetails/:seriesid/:season', getSeasonDetails);

export default router;