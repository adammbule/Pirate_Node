import { db_pass } from './config.js';
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bodyParser from 'body-parser';


const app = express();
const PORT = 4000;

// Enable CORS for origins (can be restricted to specific origins)
app.use(cors());

// Parse incoming JSON data
app.use(bodyParser.json());

// Connect to MongoDB (replace with your MongoDB URI)
mongoose.connect(`${db_pass}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a Mongoose schema for User
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create a Mongoose model for User
const User = mongoose.model('User', userSchema);

// POST route to login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email: email });

    // If the user is not found, return error
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the entered password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // If passwords match, generate a JWT token for the user
    const token = jwt.sign({ userId: user._id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });

    // Respond with the token (you can also send user details if needed)
    res.status(200).json({
      message: 'Login successful',
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
