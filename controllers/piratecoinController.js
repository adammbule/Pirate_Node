import mongoose from "mongoose";
import Piratecoin from "../models/piratecoin.js";
import KeyReference from "../models/keyreference.js";
import Wallet from "../models/wallet.model.js";
import Transaction from "../models/transaction.model.js";
import piratecoin from "../models/piratecoin.js";
import { verifyJWT } from "../middleware/authMiddleware.js";
import redis from "../config/redisClient.js";
import jwt from "jsonwebtoken";

/**
 * 1️⃣ Mint a Tier I piratecoin (Creator mint)
 * - Creates piratecoin record + KeyReference
 * - Records MINT transaction
 * Only allow studios/creators to mint Tier I and are able 
 */

// All routes below require JWT authentication
export const mintPiratecoinTierI = async (req, res) => {

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }

  const blacklisted = await redis.get(`blacklist:${token}`);

    
    if (blacklisted) {
      console.warn("🚫 Token is blacklisted!");
      return res.status(401).json({ message: "Token has been invalidated" });
    }
    console.log("🧾 Redis check:", blacklisted);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Authenticated user:', decoded.username);
    const userId = req.user.userId;
    const { piratecoinid, tmdbid, imdbid, keyReference, tier2Limit, tier3LimitPerTier2 } = req.body;

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    const existing = await Piratecoin.findOne({ piratecoinid });
    if (existing) {
      return res.status(400).json({ message: "piratecoin already minted" });
    }

    const Piratecoin = await Piratecoin.create({
      piratecoinid,
      tmdbid,
      imdbid,
      tier1_key_ref: keyReference,
      tier2_limit: tier2Limit || 1000000,
      tier3_limit_per_tier2: tier3LimitPerTier2 || 10,
    });

    await KeyReference.create({
      piratecoinId: piratecoin._id,
      tier1_ref: keyReference,
    });

    await Transaction.create({
      piratecoinId: piratecoin._id,
      from: null,
      to: wallet._id,
      tier: 1,
      quantity: 1,
      price: 0,
      txHash: `mint_${Date.now()}`
    });

    res.status(201).json({ message: "Tier I piratecoin minted successfully", piratecoin });
  } catch (err) {
    console.error("Mint error:", err);
    res.status(500).json({ message: "Error minting Tier I piratecoin" });
  }
};

/**
 * 2️⃣ Record a Tier II sale (no physical copies)
 * - Verifies limits
 * - Updates sold count
 * - Adds a transaction entry
 */
export const recordTierIISale = async (req, res) => {
  try {
    const { piratecoinId, buyerWalletId, price } = req.body;
    const sellerId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(piratecoinId)) {
      return res.status(400).json({ message: "Invalid piratecoin ID format" });
    }

    const piratecoin = await Piratecoin.findById(piratecoinId);
    if (!piratecoin) return res.status(404).json({ message: "piratecoin not found" });

    const sellerWallet = await Wallet.findOne({ user: sellerId });
    if (!sellerWallet) return res.status(404).json({ message: "Seller wallet not found" });

    if (piratecoin.tier2_sold >= piratecoin.tier2_limit) {
      return res.status(400).json({ message: "Tier II limit reached" });
    }

    piratecoin.tier2_sold += 1;
    await piratecoin.save();

    const tx = await Transaction.create({
      piratecoinId,
      from: sellerWallet._id,
      to: buyerWalletId,
      tier: 2,
      quantity: 1,
      price,
      txHash: `tier2_${Date.now()}`
    });

    res.json({ message: "Tier II sale recorded", transactionId: tx._id });
  } catch (err) {
    console.error("Tier II sale error:", err);
    res.status(500).json({ message: "Error recording Tier II sale" });
  }
};

/**
 * 3️⃣ Record a Tier III rental (limited to 10 per Tier II sale)
 * - Adds a timed transaction (expires after duration)
 */
export const recordTierIIIRental = async (req, res) => {
  try {
    const { piratecoinId, tier2TxId, renterWalletId, durationInDays } = req.body;
    const ownerId = req.user.userId;

    if (durationInDays > 365) {
      return res.status(400).json({ message: "Rental exceeds 1-year max" });
    }

    const piratecoin = await Piratecoin.findById(piratecoinId);
    if (!piratecoin) return res.status(404).json({ message: "Piratecoin not found" });

    const ownerWallet = await Wallet.findOne({ user: ownerId });
    if (!ownerWallet) return res.status(404).json({ message: "Owner wallet not found" });

    // Count how many rentals exist under this Tier II
    const activeRentals = await Transaction.countDocuments({
      piratecoinId,
      tier: 3,
      from: ownerWallet._id,
      "metadata.tier2TxId": tier2TxId
    });

    if (activeRentals >= piratecoin.tier3_limit_per_tier2) {
      return res.status(400).json({ message: "Max Tier III rentals reached for this Tier II" });
    }

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + durationInDays);

    const tx = await Transaction.create({
      piratecoinId,
      from: ownerWallet._id,
      to: renterWalletId,
      tier: 3,
      quantity: 1,
      price: 0,
      txHash: `tier3_${Date.now()}`,
      metadata: { tier2TxId, expiresAt: expiry }
    });

    res.json({ message: "Tier III rental recorded", transactionId: tx._id });
  } catch (err) {
    console.error("Tier III rental error:", err);
    res.status(500).json({ message: "Error recording Tier III rental" });
  }
};

/**
 * 4️⃣ Get all transactions for a piratecoin (ledger view)
 */
export const getPiratecoinLedger = async (req, res) => {
  try {
    const { piratecoinId } = req.params;
    const txs = await Transaction.find({ piratecoinId }).sort({ timestamp: -1 }).lean();
    res.json(txs);
  } catch (err) {
    console.error("Ledger error:", err);
    res.status(500).json({ message: "Error fetching piratecoin ledger" });
  }
};

/**
 * 5️⃣ Revoke a Tier III rental before expiry
 */
export const revokeTierIIIRental = async (req, res) => {
  try {
    const { txId } = req.params;
    const userId = req.user.userId;

    const tx = await Transaction.findById(txId);
    if (!tx || tx.tier !== 3) {
      return res.status(404).json({ message: "Transaction not found or not Tier III" });
    }

    const ownerWallet = await Wallet.findOne({ user: userId });
    if (!ownerWallet || tx.from.toString() !== ownerWallet._id.toString()) {
      return res.status(403).json({ message: "Not authorized to revoke this rental" });
    }

    await Transaction.findByIdAndDelete(txId);
    res.json({ message: "Tier III rental revoked successfully" });
  } catch (err) {
    console.error("Revoke error:", err);
    res.status(500).json({ message: "Error revoking Tier III rental" });
  }
};
