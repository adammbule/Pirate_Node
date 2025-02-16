// models/Collection.js
import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }], // Array of Movie IDs
  // ... other collection-related fields
});

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;