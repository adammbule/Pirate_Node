import express from 'express';
import { login, googleLogin } from '../controllers/userController.js'; // Import controller functions

const router = express.Router();

//router.post('/signup', createUser);
router.post('/login', login);
router.post('/login/google', googleLogin);

export default router; // Correct: Export the router
