import express from 'express';
const router = express.Router();
import { getTrendingMovies, getmovieImage, discovermovies, searchformovies, addrating } from '../controllers/movieController.js'; // Import as default
import { verifyJWT } from '../middleware/authMiddleware.js';

router.get('/trendingmovies', getTrendingMovies);
router.get('/image', getmovieImage);
router.get('/discovermovies', discovermovies);
router.get('searchformovie', searchformovies);
router.get('addrating', addrating);

export default router;