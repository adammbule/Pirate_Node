import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { loginRoute } from './routes/login.js';
import { userRoute } from './routes/createUser.js';

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Use the routes for login and user creation
app.use('/login', loginRoute);
app.use('/create-user', userRoute);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
