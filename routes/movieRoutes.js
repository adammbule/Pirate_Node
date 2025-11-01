import express from 'express';
const router = express.Router();
import { getTrendingMovies, getMovieDetails, searchMovie, createPiratecoin } from '../controllers/movieController.js'; // Import as default
import { verifyJWT } from '../middleware/authMiddleware.js';

router.get('/trendingmovies', getTrendingMovies);
router.get('/moviedetails/:movieid', getMovieDetails);
router.get('/searchmovie/:searchparams', searchMovie);
router.post('/createpiratecoin', createPiratecoin);


export default router;