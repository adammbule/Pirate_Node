import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  publicKey: { type: String, required: true },
  privateKey: { type: String, required: true }, // encrypted!
  iv: { type: String, required: true },
  holdings: [{ type: String }],
  coinKeys: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CoinKey' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Wallet || mongoose.model('Wallet', walletSchema);
