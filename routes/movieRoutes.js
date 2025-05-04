import express from 'express';
const router = express.Router();
import { getTrendingMovies, getMovieDetails, searchMovie } from '../controllers/movieController.js'; // Import as default
import { verifyJWT } from '../middleware/authMiddleware.js';

router.get('/trendingmovies', getTrendingMovies);
router.get('/moviedetails/:movieid', getMovieDetails);
router.get('/searchmovie/:searchparams', searchMovie);


export default router;