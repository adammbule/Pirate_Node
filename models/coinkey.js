import mongoose from 'mongoose';

const coinKeySchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }, // optional
  mintedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: false },
  title: { type: String, required: false },
  description: { type: String },
  totalCopiesAllowed: { type: Number, default: 100000 },
  tier: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.CoinKey || mongoose.model('CoinKey', coinKeySchema);
