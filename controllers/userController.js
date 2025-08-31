import dotenv from "dotenv";
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import mongoose from 'mongoose';
import {GoogleAuth} from 'google-auth-library';

dotenv.config({ path: "../subkey.env" });
// MongoDB Connection Logic
mongoose.connect(process.env.db_pass, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000,  // Optional: Timeout after 30 seconds
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection disconnected');
});

// OAuth2 Client setup for Google login
const client = new OAuth2Client(process.env.clientid);

// Regular login function
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(`Login attempt for email: ${email}`);

    // Find user by email
    const user = await User.findOne({ email: email });

    if (!user) {
      console.log(`User with email ${email} not found`);
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the entered password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log(`Incorrect password for email: ${email}`);
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate a JWT token for the user
        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log('Generated JWT Token:', token);

        user.sessionKey = token;
        await user.save();

        res.status(200).json({
          message: 'Manual login successful',
          token: token,
          sessionKey: token,
          email:email,
          username: user.username,
          UUID: user._id
        });
  } catch (error) {
    console.error('Server error during login:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Google login function
const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    console.log('Google login attempt...');

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: '653453076719-rgmdbrp1eka5rni16q7mrcfep5t3vcbl.apps.googleusercontent.com',
    });

    // Extract the payload from the ticket
    const payload = ticket.getPayload();
    const email = payload?.email;
    const username = payload?.name;

    console.log(`Google login successful for email: ${email}, username: ${username}`);

    // Check if the user exists
    let user = await User.findOne({ email: email });

    if (!user) {
      console.log(`Creating new user for email: ${email}`);
      user = new User({
        email: email,
        username: username,
        password: undefined, // No password needed for Google login
      });
      await user.save();
    } else {
      console.log(`User found in the database: ${user.username} (Email: ${user.email})`);
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Generated JWT Token:', token);

    user.sessionKey = token;
    await user.save();

    res.status(200).json({
      message: 'Google login successful',
      token: token,
      sessionKey: token,
    });
  } catch (error) {
    console.error('Error during Google login:', error.message);
    res.status(500).json({ message: 'Google login error', error: error.message });
  }
};

// Create new user function
const createuser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(300).json({ message: 'User already exists with this email' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword, // Store hashed password
    });

    // Save the new user to the database
    await newUser.save();

    // Generate a JWT token for the new user
    const token = jwt.sign({ userId: newUser._id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Save the token (sessionKey) in the user's document
    newUser.sessionKey = token;
    await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      token: token,
      sessionKey: token,
    });
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

export { login, googleLogin, createuser };
