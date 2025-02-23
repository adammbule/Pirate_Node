import express from 'express';
const router = express.Router();
import { getTrendingMovies } from '../controllers/movieController.js'; // Import as default
import { verifyJWT } from '../middleware/authMiddleware.js';

router.get('/trendingmovies', getTrendingMovies);


export default router;