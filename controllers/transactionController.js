import Transaction from "../models/transaction.js";
import Piratecoin from "../models/piratecoin.js";

// Mint Tier II copy
export const mintTier2Copy = async (req, res) => {
  try {
    const { piratecoinId, from, to, price } = req.body;
    const piratecoin = await Piratecoin.findById(piratecoinId);
    if (!piratecoin) return res.status(404).json({ error: "Piratecoin not found" });

    if (piratecoin.tier2_sold >= piratecoin.tier2_limit)
      return res.status(400).json({ error: "All Tier II copies sold" });

    const tx = await Transaction.create({
      piratecoinId,
      from,
      to,
      tier: 2,
      quantity: 1,
      price,
    });

    piratecoin.tier2_sold += 1;
    await piratecoin.save();

    res.status(201).json(tx);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Rent Tier III copy
export const rentTier3Copy = async (req, res) => {
  try {
    const { piratecoinId, from, to, price } = req.body;

    const tx = await Transaction.create({
      piratecoinId,
      from,
      to,
      tier: 3,
      quantity: 1,
      price,
    });

    res.status(201).json(tx);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all transactions for a piratecoin
export const getTransactionsByMovie = async (req, res) => {
  try {
    const txs = await Transaction.find({ piratecoinId: req.params.piratecoinId });
    res.json(txs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all transactions for a wallet
export const getTransactionsByWallet = async (req, res) => {
  try {
    const wallet = req.params.wallet;
    const txs = await Transaction.find({ $or: [{ from: wallet }, { to: wallet }] });
    res.json(txs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
