import express from 'express';
const router = express.Router();
import { getTrendingMovies, getMovieDetails } from '../controllers/movieController.js'; // Import as default
import { verifyJWT } from '../middleware/authMiddleware.js';

router.get('/trendingmovies', getTrendingMovies);
router.get('/moviedetails/:movieid', getMovieDetails);


export default router;