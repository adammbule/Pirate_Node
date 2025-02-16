import dotenv from 'dotenv';
dotenv.config({ path: './subkey.env' }); // Ensure the path is correct
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken'; // Import for JWT verification

const newToken = jwt.sign({ userId: '123', username: 'testUser' }, process.env.JWT_SECRET, { expiresIn: '1h' });
console.log('New Token:', newToken);



const app = express();
const PORT = 3000;
app.use(cors());
console.log("JWT_SECRET:", process.env.JWT_SECRET);

// Middleware to verify JWT token (place before your API route)
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid format' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token received:', token); // Log the token to verify

  try {
    const decoded = jwt.verify(newToken, process.env.JWT_SECRET); // Verify the provided token
    console.log('Decoded token:', decoded); // Log the decoded token to verify
    req.user = decoded; // Attach decoded user data to the request object
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error("JWT Verification Error:", error); // Log the specific error for debugging
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// API route to get movies
app.get('/getmoviesV2', verifyJWT, async (req, res) => {
  const url = `${process.env.tmurl2}/3/trending/movie/week?language=en-US`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `${process.env.TMBearer}`,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      // Handle HTTP errors (e.g., 401 Unauthorized)
      const errorText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }
    const json = await response.json();
    return res.json(json); // Return the data
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ message: 'Error fetching movies' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
