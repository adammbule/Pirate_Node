import mongoose from 'mongoose';

const coinKeyRentalSchema = new mongoose.Schema({
  parentCopy: { type: mongoose.Schema.Types.ObjectId, ref: 'CoinKeyCopy', required: false },
  renter: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true },
  rentalStart: { type: Date, default: Date.now },
  rentalEnd: { type: Date, required: true },
  tier: { type: Number, default: 3 }
});

// Auto-delete expired rentals
coinKeyRentalSchema.index({ rentalEnd: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.CoinKeyRental || mongoose.model('CoinKeyRental', coinKeyRentalSchema);
