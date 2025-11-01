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

export default getTrendingMovies;
