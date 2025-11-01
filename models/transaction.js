import mongoose from 'mongoose';

// const transactionSchema = new mongoose.Schema({
//   type: { type: String, enum: ['MINT', 'TRANSFER'], required: true },
//   from: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
//   to: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
//   coinKey: { type: mongoose.Schema.Types.ObjectId, ref: 'CoinKey', required: true },
//   timestamp: { type: Date, default: Date.now }
// });

// export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

import mongoose from "mongoose";

const transactionsSchema = new mongoose.Schema({
  piratecoinId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "piratecoin",
    required: true,
    index: true
  },
  from: {
    type: String, // wallet address
    required: true,
  },
  to: {
    type: String, // wallet address
    required: true,
  },
  tier: {
    type: Number, // 2 or 3
    enum: [2, 3],
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number, // in PirateCoin or USD equivalent
    default: 0,
  },
  txHash: {
    type: String, // blockchain or internal transaction hash
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

// Index for fast ownership lookups
transactionSchema.index({ to: 1 });
transactionSchema.index({ from: 1 });

export default mongoose.model("Transaction", transactionsSchema);

