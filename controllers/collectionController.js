import Collection from '../models/collection.js';  // Add the .js extension here as well

// Define controller methods
export const getCollection = async (req, res) => { // Use named export
  try {
    const collectionItems = await Collection.find({ trending: true }); // Corrected variable name (plural)
    res.json(collectionItems);  // Corrected variable name (plural)
  } catch (error) {
    console.error("Error fetching collection items:", error); // Log the error
    res.status(500).json({ error: error.message });
  }
};

export default getCollection;
