import fetch from 'node-fetch'; // Ensure node-fetch is imported
import dotenv from 'dotenv';

dotenv.config({ path: "../subkey.env" });

const TMDB_API_KEY = process.env.Bearer;
const JWT_SECRET = process.env.JWT_SECRET;
const TMDB_BASE_URL = process.env.tmurl2;

const tmdbUrl = process.env.tmurl2;
const bearer = process.env.Bearer;

// Define controller methods
export const getTrendingSeries = async (req, res) => {
  // Extract Bearer token from Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }

  const url = `${tmdbUrl}/3/trending/tv/day?language=en-US`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `${bearer}`, // Use the Bearer token from the request header
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }
    const json = await response.json();
    return res.json(json); // Return the fetched trending series data
  } catch (error) {
    console.error('Error fetching trending series:', error);
    return res.status(500).json({ message: 'Error fetching series' });
  }
};

export const getSeriesDetails = async (req, res) => {
  // Extract Bearer token from Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }

  const { seriesid } = req.params; // Get the seriesid from the URL parameter
  const url = `${tmdbUrl}/3/tv/${seriesid}?language=en-US`; // Use the seriesid in the URL
  console.log('Request URL:', url);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `${bearer}`, // Use the Bearer token from the request header
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }
    const json = await response.json();
    return res.json(json); // Return the fetched series details
  } catch (error) {
    console.error('Error fetching series details:', error);
    return res.status(500).json({ message: 'Error fetching series details' });
  }
};

export const getSeasonDetails = async (req, res) => {
  // Extract Bearer token from Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }

  const { seriesid, season } = req.params; // Get the seriesid and season from the URL parameters

  const url = `${tmdbUrl}/3/tv/${seriesid}/season/${season}?language=en-US`;

  console.log('Request URL:', url);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`, // Use the Bearer token from the request header
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }
    const json = await response.json();
    return res.json(json); // Return the fetched season details
  } catch (error) {
    console.error('Error fetching season details:', error);
    return res.status(500).json({ message: 'Error fetching season details' });
  }
};


export const searchShow = async (req, res) => {
const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }
  try{
    const { searchparams } = req.params;
      const url = `${TMDB_BASE_URL}/3/search/tv?query=${searchparams}&include_adult=false&language=en-US&page=1`;
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
      console.error('Error fetching show details:', error);
      return res.status(500).json({ message: 'Error fetching show details or invalid token', error: error.message });
    }
  };