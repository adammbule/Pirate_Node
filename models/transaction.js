import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['MINT', 'TRANSFER'], required: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
  coinKey: { type: mongoose.Schema.Types.ObjectId, ref: 'CoinKey', required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Transaction', transactionSchema);
