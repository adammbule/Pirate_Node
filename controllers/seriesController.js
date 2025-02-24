import Series from '../models/series.js'; // Import the Series model (with .js extension)

// Define controller methods
export const getTrendingSeries = async (req, res) => {
  const url = 'https://api.themoviedb.org/3/trending/tv/day?language=en-US';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MDk4ZDA0NzU0NjI5MDNlODRmMGZmNjAxYjQwZjRhNCIsIm5iZiI6MTcwNTk0MjA4Ny45NDU5OTk5LCJzdWIiOiI2NWFlOWM0NzNlMmVjODAwZWJmMDA3YTYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.m-rvfyxU5wUwRy8Z_jypbh2zfqubxpN_OuS8GVaNE48'
    }
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
      console.error('Error fetching trending series:', error);
      return res.status(500).json({ message: 'Error fetching series' });
    }
};

export default getTrendingSeries;

