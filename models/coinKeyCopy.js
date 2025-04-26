import mongoose from 'mongoose';

const coinKeyCopySchema = new mongoose.Schema({
  parentKey: { type: mongoose.Schema.Types.ObjectId, ref: 'CoinKey', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true },
  copyNumber: { type: Number, required: true },
  tier: { type: Number, default: 2 },
  price: { type: Number, default: 0 },
  forSale: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

coinKeyCopySchema.index({ parentKey: 1 });
coinKeyCopySchema.index({ owner: 1 });

export default mongoose.model('CoinKeyCopy', coinKeyCopySchema);
