import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import redis from '../middleware/redis.js';

dotenv.config({ path: '../subkey.env' });

const TMDB_API_KEY = process.env.Bearer;
const JWT_SECRET = process.env.JWT_SECRET;
const TMDB_BASE_URL = process.env.tmurl2;

export const getTrendingMovies = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }

  const blacklisted = await redis.get(`blacklist:${token}`);

    
    if (blacklisted) {
      console.warn("🚫 Token is blacklisted!");
      return res.status(401).json({ message: "Token has been invalidated" });
    }
    console.log("🧾 Redis check:", blacklisted);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Authenticated user:', decoded.username);

    const url = `${TMDB_BASE_URL}/3/trending/movie/week?language=en-US`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `${TMDB_API_KEY}`,
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }

    const json = await response.json();
    return res.json(json);

  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return res.status(500).json({ message: 'Error fetching movies or invalid token', error: error.message });
  }
};

export const getMovieDetails = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }
  const blacklisted = await redis.get(`blacklist:${token}`);

    
    if (blacklisted) {
      console.warn("🚫 Token is blacklisted!");
      return res.status(401).json({ message: "Token has been invalidated" });
    }
    console.log("🧾 Redis check:", blacklisted);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Authenticated user:', decoded.username);

    const { movieid } = req.params;
    const url = `${TMDB_BASE_URL}/3/movie/${movieid}?append_to_response=videos&language=en-US`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `${TMDB_API_KEY}`,
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }

    const json = await response.json();
    return res.json(json);

  } catch (error) {
    console.error('Error fetching movie details:', error);
    return res.status(500).json({ message: 'Error fetching movie details or invalid token', error: error.message });
  }
};

export const searchMovie = async (req, res) => {
const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }
  const blacklisted = await redis.get(`blacklist:${token}`);

    if (blacklisted) {
      console.warn("🚫 Token is blacklisted!");
      return res.status(401).json({ message: "Token has been invalidated" });
    }
  try{
    const { searchparams } = req.params;
      const url = `${TMDB_BASE_URL}/3/search/movie?query=${searchparams}&include_adult=false&language=en-US&page=1`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `${TMDB_API_KEY}`,
        },
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      const json = await response.json();
      return res.json(json);

    } catch (error) {
      console.error('Error fetching movie details:', error);
      return res.status(500).json({ message: 'Error fetching movie details or invalid token', error: error.message });
    }
  };

export const checkMovieStatus = async (req, res) => {
  const { movieid } = req.params;
  const token = req.headers.authorization?.split(' ')[1]; 
  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }
  const blacklisted = await redis.get(`blacklist:${token}`);
    if (blacklisted) {
      console.warn("🚫 Token is blacklisted!");
      return res.status(401).json({ message: "Token has been invalidated" });
    } 
 try{
    const {  } = req.params;
      const url = `https://www.imdb.com/title/tt7130300${movieid}/`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
         // Authorization: `${TMDB_API_KEY}`,
        },
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      const json = await response.json();
      return res.json(json);

    } catch (error) {
      console.error('Error fetching movie verification:', error);
      return res.status(500).json({ message: 'Error fetching movie verification details or invalid token', error: error.message });
    }};

export const createPiratecoin = async (movieData) => {
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
export default getTrendingMovies;
