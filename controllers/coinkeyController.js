import CoinKey from '../models/coinkey.js';
import Wallet from '../models/wallet.js';
import Transaction from '../models/transaction.js';
// import bitcoinMessage if you're adding signature verification
// import * as bitcoinMessage from 'bitcoinjs-message';


// 1. Mint a Tier I CoinKey
export const mintCoinKey = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { movieId, keyReference } = req.body;

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    const existing = await CoinKey.findOne({ movieId, tier: 'TierI' });
    if (existing) return res.status(400).json({ message: 'Tier I CoinKey already exists for this movie' });

    const coinKey = new CoinKey({
      movieId,
      tier: 'TierI',
      wallet: wallet._id,
      keyReference
    });

    await coinKey.save();

    wallet.coinKeys.push(coinKey._id);
    await wallet.save();

    const tx = new Transaction({
      type: 'MINT',
      from: null,
      to: wallet._id,
      coinKey: coinKey._id
    });
    await tx.save();

    res.status(201).json({ message: 'CoinKey minted successfully', coinKey });
  } catch (error) {
    console.error("Minting error:", error);
    res.status(500).json({ message: 'Error minting CoinKey' });
  }
};


// 2. Clone Tier II CoinKeys from a Tier I
export const createTierIICopies = async (req, res) => {
  try {
    const { tierIId, numberOfCopies } = req.body;
    const ownerId = req.user.userId;

    if (numberOfCopies > 100000) return res.status(400).json({ message: 'Max 100,000 copies allowed' });

    const wallet = await Wallet.findOne({ user: ownerId });
    const original = await CoinKey.findById(tierIId);
    if (!original || original.tier !== 'TierI') return res.status(400).json({ message: 'Invalid Tier I key' });

    if (original.wallet.toString() !== wallet._id.toString()) {
      return res.status(403).json({ message: 'Not owner of Tier I key' });
    }

    const tierIICopies = [];
    for (let i = 0; i < numberOfCopies; i++) {
      tierIICopies.push({
        movieId: `${original.movieId}_copy_${i + 1}`,
        tier: 'TierII',
        wallet: wallet._id,
        keyReference: original.keyReference
      });
    }

    const savedCopies = await CoinKey.insertMany(tierIICopies);

    wallet.coinKeys.push(...savedCopies.map(k => k._id));
    await wallet.save();

    const txs = savedCopies.map(k => ({
      type: 'MINT',
      from: null,
      to: wallet._id,
      coinKey: k._id
    }));
    await Transaction.insertMany(txs);

    res.json({ message: `${numberOfCopies} Tier II keys minted`, copies: savedCopies.map(k => k._id) });
  } catch (err) {
    console.error("Tier II mint error:", err);
    res.status(500).json({ message: 'Error minting Tier II keys' });
  }
};


// 3. Transfer CoinKey between wallets
export const transferCoinKey = async (req, res) => {
  try {
    const { coinKeyId, recipientWalletId, signature, message } = req.body;
    const senderId = req.user.userId;

    const senderWallet = await Wallet.findOne({ user: senderId });
    if (!senderWallet) return res.status(404).json({ message: 'Sender wallet not found' });

    const coinKey = await CoinKey.findById(coinKeyId);
    if (!coinKey || coinKey.wallet.toString() !== senderWallet._id.toString()) {
      return res.status(403).json({ message: 'You do not own this CoinKey' });
    }

    // Optional: Signature verification here if needed
    // const isValid = bitcoinMessage.verify(message, senderWallet.address, signature);
    // if (!isValid) return res.status(403).json({ message: 'Invalid signature' });

    coinKey.wallet = recipientWalletId;
    await coinKey.save();

    senderWallet.coinKeys.pull(coinKeyId);
    await senderWallet.save();

    const recipientWallet = await Wallet.findById(recipientWalletId);
    recipientWallet.coinKeys.push(coinKeyId);
    await recipientWallet.save();

    const tx = new Transaction({
      type: 'TRANSFER',
      from: senderWallet._id,
      to: recipientWallet._id,
      coinKey: coinKey._id
    });
    await tx.save();

    res.json({ message: 'Transfer successful', transactionId: tx._id });
  } catch (err) {
    console.error("Transfer error:", err);
    res.status(500).json({ message: 'Error transferring CoinKey' });
  }
};

// 4. Create Tier III Rental Keys (max 10 per Tier II)
export const createTierIIIRental = async (req, res) => {
  try {
    const { tierIIId, renters } = req.body; // renters: [{walletId, durationInDays}]
    const ownerId = req.user.userId;

    const tierII = await CoinKey.findById(tierIIId);
    if (!tierII || tierII.tier !== 'TierII') return res.status(400).json({ message: 'Invalid Tier II key' });

    const ownerWallet = await Wallet.findOne({ user: ownerId });
    if (tierII.wallet.toString() !== ownerWallet._id.toString()) {
      return res.status(403).json({ message: 'Not the owner of this Tier II key' });
    }

    // Count current Tier III rentals
    const existingRentals = await CoinKey.countDocuments({ parentKey: tierIIId, tier: 'TierIII' });
    if (existingRentals + renters.length > 10) {
      return res.status(400).json({ message: 'Exceeds max of 10 rentals per Tier II' });
    }

    const tierIIIKeys = [];

    for (const renter of renters) {
      const { walletId, durationInDays } = renter;
      if (durationInDays > 365) return res.status(400).json({ message: 'Rental exceeds 1 year max' });

      const expiry = new Date();
      expiry.setDate(expiry.getDate() + durationInDays);

      const rentalKey = new CoinKey({
        movieId: `${tierII.movieId}_rental_${Math.random().toString(36).substring(2, 6)}`,
        tier: 'TierIII',
        wallet: walletId,
        keyReference: tierII.keyReference,
        parentKey: tierII._id,
        rentalExpires: expiry
      });

      await rentalKey.save();

      const wallet = await Wallet.findById(walletId);
      wallet.coinKeys.push(rentalKey._id);
      await wallet.save();

      tierIIIKeys.push(rentalKey);

      await new Transaction({
        type: 'MINT',
        from: ownerWallet._id,
        to: walletId,
        coinKey: rentalKey._id
      }).save();
    }

    res.json({ message: 'Tier III keys rented', keys: tierIIIKeys });
  } catch (err) {
    console.error("Tier III rental error:", err);
    res.status(500).json({ message: 'Error renting Tier III keys' });
  }
};


// 5. Get all Tier III renters for a Tier II key
export const getTierIIIRenters = async (req, res) => {
  try {
    const { tierIIId } = req.params;
    const rentals = await CoinKey.find({ parentKey: tierIIId, tier: 'TierIII' }).populate('wallet', 'user');
    res.json(rentals);
  } catch (err) {
    console.error("Error getting renters:", err);
    res.status(500).json({ message: 'Error retrieving renters' });
  }
};

// 6. Revoke rental before expiry
export const revokeTierIIIRental = async (req, res) => {
  try {
    const { keyId } = req.params;
    const userId = req.user.userId;

    const key = await CoinKey.findById(keyId).populate('parentKey');
    if (!key || key.tier !== 'TierIII') return res.status(404).json({ message: 'Key not found or not a Tier III' });

    const parent = await CoinKey.findById(key.parentKey._id);
    const ownerWallet = await Wallet.findOne({ user: userId });

    if (parent.wallet.toString() !== ownerWallet._id.toString()) {
      return res.status(403).json({ message: 'Only the parent owner can revoke' });
    }

    const wallet = await Wallet.findById(key.wallet);
    wallet.coinKeys.pull(key._id);
    await wallet.save();

    await CoinKey.findByIdAndDelete(key._id);

    res.json({ message: 'Tier III rental revoked' });
  } catch (err) {
    console.error("Revoke error:", err);
    res.status(500).json({ message: 'Error revoking rental' });
  }
};

