// models/coinkey.js

import mongoose from 'mongoose';

const coinKeySchema = new mongoose.Schema({
  movieId: String,
  tier: { type: String, enum: ['TierI', 'TierII', 'TierIII'], required: true },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
  keyReference: String,
  parentKey: { type: mongoose.Schema.Types.ObjectId, ref: 'CoinKey' }, // For Tier III
  rentalExpires: Date, // Only for Tier III
});

export default mongoose.model('CoinKey', coinKeySchema);
