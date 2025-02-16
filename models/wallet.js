import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, // Reference to the User model
  holdings: [{  // Array of holdings
    asset: { type: String, required: true }, // E.g., "BTC", "ETH"
    quantity: { type: Number, required: true },
    // ...other holding fields
  }],
});

const Wallet = mongoose.model('Wallet', walletSchema);

export default Wallet;