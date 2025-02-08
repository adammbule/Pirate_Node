// server.js
import { db_pass } from './config.js';
import express from'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from'mongoose';
//import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

// Initialize dotenv to read environment variables
//dotenv.config();

// Set up express app
const app = express();
const port = 4000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// MongoDB URI from .env file
const mongoURI = `${db_pass}`;

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define the User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

// Create the User model based on the schema
const User = mongoose.model('User', userSchema);

// POST route to create a new user
app.post('/create-user', async (req, res) => {
  const { username, password, email } = req.body;

  // Simple validation (ensure both username and password are provided)
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Username, email and password are required.' });
  }

  try {
    // Check if email exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });

    // Save the new user to MongoDB
    await newUser.save();

    // Respond with the created user (excluding password)
    res.status(201).json({
      message: 'User created successfully.',
      user: { username: newUser.username, email: newUser.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
