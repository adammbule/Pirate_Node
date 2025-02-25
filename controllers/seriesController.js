import { Bearer, tmurl } from '../config.js'; // Ensure Bearer and tmurl are imported correctly
import fetch from 'node-fetch'; // Ensure node-fetch is imported

// Define controller methods
export const getTrendingSeries = async (req, res) => {
  const url = `${tmurl}/3/trending/tv/day?language=en-US`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `${Bearer}`,
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
  const { seriesid } = req.params; // Get the seriesid from the URL parameter
  const url = `${tmurl}/3/tv/${seriesid}?language=en-US`; // Use the seriesid in the URL
  console.log('Request URL:', url);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `${Bearer}`, // Use Bearer token for authorization
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
  const { seriesid } = req.params; // Get the seriesid from the URL parameter
  const { season } = req.params;

  const url = `${tmurl}/3/tv/${seriesid}/season/${season}?language=en-US`;

  console.log('Request URL:', url);
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `${Bearer}`,}
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
    console.error('Error fetching season details:', error);
    return res.status(500).json({ message: 'Error fetching season details' });
  }
};


