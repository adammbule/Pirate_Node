import { db_pass, clientid } from './config.js';
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bodyParser from 'body-parser';
import { OAuth2Client } from 'google-auth-library'; // Import Google Auth library


const app = express();
const PORT = 4000;
const client = new OAuth2Client(`${clientid}`); // Replace with your actual Google client ID

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
  sessionKey: { type: String, required: false },  // Add sessionKey field to store the token
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

    // Save the token (sessionKey) in the user's document
    user.sessionKey = token;
    await user.save(); // Save the user document with the updated sessionKey

    // Respond with the token and user details (if needed)
    res.status(200).json({
      message: 'Login successful',
      token: token,
      sessionKey: token, // Optionally return the sessionKey in the response
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST route for Google login
app.post('/google-login', async (req, res) => {
  const { idToken } = req.body; // The ID token from Google

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: `${clientid}`, // Replace with your Google Client ID
    });

    // Extract the payload from the ticket
    const payload = ticket.getPayload();
    const email = payload?.email;
    const username = payload?.name;

    // Check if the user exists in the database
    let user = await User.findOne({ email: email });

    if (!user) {
      // If the user doesn't exist, create a new user
      user = new User({
        email: email,
        username: username,
        password: '', // You can leave the password empty as it's not needed for Google login
      });
      await user.save();
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ userId: user._id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });

    // Save the token (sessionKey) in the user's document
    user.sessionKey = token;
    await user.save();

    // Respond with the token
    res.status(200).json({
      message: 'Google login successful',
      token: token,
      sessionKey: token, // Return sessionKey (JWT token)
    });
  } catch (error) {
    res.status(500).json({ message: 'Google login error', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
