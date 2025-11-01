import mongoose from 'mongoose'; // Import mongoose ONLY ONCE at the top of the file

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: [String], required: true },
  releaseYear: { type: Number },
  rating: { type: Number },
  description: { type: String },
  posterUrl: { type: String },
  imid: { type: String},
});

const Movie = mongoose.model('Movie', movieSchema);

export default mongoose.models.Movie || mongoose.model('Movie', movieSchema);

