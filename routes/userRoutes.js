import express from 'express';
import { login, googleLogin, createuser, logout } from '../controllers/userController.js'; // Import controller functions
import { suggestUsernames } from "../utils/usernameGenerator.js";

const router = express.Router();

//router.post('/signup', createUser);
router.post('/login', login);
router.post('/login/google', googleLogin);
router.post('/createuser', createuser);
router.post('/logout', logout);
router.get('/suggest-usernames', suggestUsernames);

export default router;
