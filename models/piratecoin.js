import mongoose from "mongoose";

const piratecoinSchema = new mongoose.Schema({
  piratecoinid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  tmdbid: {
    type: String,
    required: true,
  },
  imdbid: {
    type: String,
    required: true,
  },
  tier1_key_ref: {
    type: String,  // e.g. "enc://ipfs/QmHash123"
    required: true,
  },
  tier2_limit: {
    type: Number,
    default: 1000000,
  },
  tier2_sold: {
    type: Number,
    default: 0,
  },
  tier3_limit_per_tier2: {
    type: Number,
    default: 10,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model("Piratecoin", piratecoinSchema);