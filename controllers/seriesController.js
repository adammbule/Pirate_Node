import Series from '../models/series.js'; // Import the Series model (with .js extension)

// Define controller methods
export const getTrendingSeries = async (req, res) => {
  try {
    const trendingSeries = await Series.find({ trending: true });
    res.json(trendingSeries);
  } catch (error) {
    console.error("Error fetching trending series:", error); // Improved error logging
    res.status(500).json({ error: error.message });
  }
};

export default getTrendingSeries;