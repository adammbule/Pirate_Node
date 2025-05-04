import express from 'express';
import { getTrendingSeries, getSeriesDetails, getSeasonDetails, searchShow } from '../controllers/seriesController.js'; // Import correctly

const router = express.Router();

router.get('/trendingseries', getTrendingSeries); // Use the imported function
router.get('/getSeriesDetails/:seriesid', getSeriesDetails);
router.get('/getSeriesDetails/:seriesid/:season', getSeasonDetails);
router.get('/searchshow/:searchparams', searchShow);

export default router;