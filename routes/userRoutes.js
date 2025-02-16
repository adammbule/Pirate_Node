import express from 'express';
import { login, googleLogin, logout } from '../controllers/userController.js'; // Import controller functions

const router = express.Router();

//router.post('/signup', createUser);
router.post('/login', login);
router.post('/login/google', googleLogin);
router.post('logout', logout);

export default router; // Correct: Export the router
