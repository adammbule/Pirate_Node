import express from 'express';
const router = express.Router();
import { getTrendingMovies, getmoviedetails } from '../controllers/movieController.js'; // Import as default
import { verifyJWT } from '../middleware/authMiddleware.js';

router.get('/trendingmovies', getTrendingMovies);
router.get('/moviedetails/:movieid', getmoviedetails);


export default router;