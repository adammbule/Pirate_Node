import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Bearer, tmurl } from '../config.js';

dotenv.config({ path: '../subkey.env' });

export const getTrendingMovies = async (req, res) => {
  // Extract JWT token from Authorization header
  const token = req.headers.authorization?.split(' ')[1]; // Assuming format "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace 'your_jwt_secret' with your actual secret key

    // Optionally, you can store decoded user info, for example, userId, to track who made the request
    console.log('Authenticated user:', decoded.username);

    // Now that the token is valid, proceed with fetching trending movies
    const url = 'https://api.themoviedb.org/3/trending/movie/week?language=en-US';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `${Bearer}`, // Use your TMDB API key from env variables
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }

    const json = await response.json();
    return res.json(json); // Return the fetched trending movies data

  } catch (error) {
    // Token validation or any other error
    console.error('Error fetching trending movies:', error);
    return res.status(500).json({ message: 'Error fetching movies or invalid token', error: error.message });
  }
};

export const getmoviedetails = async (req, res) => {
// Extract JWT token from Authorization header
  const token = req.headers.authorization?.split(' ')[1]; // Assuming format "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace 'your_jwt_secret' with your actual secret key

    // Optionally, you can store decoded user info, for example, userId, to track who made the request
    console.log('Authenticated user:', decoded.username);

    const { movieid } = req.params;
    //const url = `${tmurl}/3/tv/${seriesid}/season/${season}?language=en-US`;
    const url = `${tmurl}/3/movie/${movieid}?language=en-US`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `${Bearer}`,
      }
    };

    const response = await fetch(url, options);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error ${response.status}: ${errorText}`);
        }

        const json = await response.json();
        return res.json(json); // Return the fetched trending movies data

      } catch (error) {
        // Token validation or any other error
        console.error('Error fetching movie details:', error);
        return res.status(500).json({ message: 'Error fetching movie details or invalid token', error: error.message });
      }
};

export default getTrendingMovies; // Default export

