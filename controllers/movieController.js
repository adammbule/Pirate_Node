import fetch from 'node-fetch';
import dotenv from 'dotenv';
import Movie from '../models/movie.js'; // Assuming you have a movie model for storing ratings or other movie data

dotenv.config({ path: '../subkey.env' });

export const getTrendingMovies = async (req, res) => {
  const url = 'https://api.themoviedb.org/3/trending/movie/week?language=en-US';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.Bearer}`},
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }
    const json = await response.json();
    return res.json(json); // Return the fetched trending movies data
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return res.status(500).json({ message: 'Error fetching movies' });
  }
};

// Add your other movie-related functions (addrating, searchformovies, discovermovies, etc.) here
export const addrating = async (req, res) => {
  // ... (Your existing code for fetching movies)
};

export const searchformovies = async (req, res) => {
  // ... (Your existing code for fetching movies)
};

export const discovermovies = async (req, res) => {
  // ... (Your existing code for fetching movies)
};

export const getmovieImage = async (req, res) => {
  // ... (Your existing code for fetching movies)
};


//export default getTrendingMovies; // Default export