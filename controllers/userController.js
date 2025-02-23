import { OAuth2Client } from 'google-auth-library'; 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // Assuming bcrypt is needed
import User from '../models/user.js'; // Assuming you have a User model defined elsewhere
import { clientid, db_pass } from '../config.js'; // Ensure this is coming from your config file
import mongoose from 'mongoose'; // Mongoose to handle MongoDB connection

// MongoDB Connection Logic
mongoose.connect(db_pass, {
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
const client = new OAuth2Client(clientid);

// Regular login function (already defined in your code)
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(`Login attempt for email: ${email}`); // Log email for debugging

    // Find user by email
    const user = await User.findOne({ email: email });

    // If the user is not found, return error
    if (!user) {
      console.log(`User with email ${email} not found`); // Log when user is not found
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the entered password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log(`Incorrect password for email: ${email}`); // Log when password is incorrect
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // If passwords match, generate a JWT token for the user
    const token = jwt.sign({ userId: user._id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });

    // Log token and user details
    console.log(`Login successful for user: ${user.username} (Email: ${user.email})`);
    console.log('Generated JWT Token:', token);

    // Save the token (sessionKey) in the user's document
    user.sessionKey = token;
    await user.save(); // Save the user document with the updated sessionKey

    // Respond with the token and user details
    res.status(200).json({
      message: 'Login successful',
      token: token,
      sessionKey: token, // Optionally return the sessionKey in the response
    });
  } catch (error) {
    console.error('Server error during login:', error.message); // Log server errors
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Google login function
const googleLogin = async (req, res) => {
  const { idToken } = req.body; // The ID token from Google

  try {
    console.log('Google login attempt...'); // Log when Google login starts

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: clientid, // Your Google Client ID
    });

    // Extract the payload from the ticket
    const payload = ticket.getPayload();
    const email = payload?.email;
    const username = payload?.name;

    // Log the Google payload (username and email)
    console.log(`Google login successful for email: ${email}, username: ${username}`);

    // Check if the user exists in the database
    let user = await User.findOne({ email: email });

    if (!user) {
      // If the user doesn't exist, create a new user
      console.log(`Creating new user for email: ${email}`); // Log when creating a new user

      user = new User({
        email: email,
        username: username,
        password: undefined, // You can leave the password empty as it's not needed for Google login
      });
      await user.save();
    } else {
      console.log(`User found in the database: ${user.username} (Email: ${user.email})`);
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ userId: user._id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });

    // Log token
    console.log('Generated JWT Token:', token);

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
    console.error('Error during Google login:', error.message); // Log any errors
    res.status(500).json({ message: 'Google login error', error: error.message });
  }
};

export const logout = async (req, res) => {
  // ... (Your existing code for fetching movies)
};

export { login, googleLogin };
