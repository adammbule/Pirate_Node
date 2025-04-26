// models/Series.js
import mongoose from 'mongoose';

const seriesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: [String], required: true }, // Array of genres
  releaseYear: { type: Number },
  rating: { type: Number },
  description: { type: String },
  posterUrl: { type: String }, // URL to the series poster
  seasons: [{  // Array of seasons
    seasonNumber: { type: Number, required: true },
    episodes: [{
      episodeNumber: { type: Number, required: true },
      title: { type: String },
      description: { type: String },
      //... other episode fields
    }],
  }],
  //... other series-related fields
});

const Series = mongoose.model('Series', seriesSchema);

export default mongoose.models.Series || mongoose.model('Series', seriesSchema);