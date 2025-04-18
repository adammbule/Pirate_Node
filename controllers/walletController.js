import * as bitcoin from 'bitcoinjs-lib';
import ECPairFactory from 'ecpair';
import * as tinysecp from 'tiny-secp256k1';
import * as bitcoinMessage from 'bitcoinjs-message';
import crypto from 'crypto';
import Wallet from '../models/wallet.js';
import CoinKey from '../models/coinkey.js'


const ECPair = ECPairFactory(tinysecp);

// Replace this with a secure key or env var in production
const ENCRYPTION_KEY = crypto.randomBytes(32); // 256-bit key
const IV = crypto.randomBytes(16); // Initialization Vector

// Utility to encrypt private key
function encryptPrivateKey(privateKey) {
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
  let encrypted = cipher.update(privateKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { encrypted, iv: IV.toString('hex') };
}

// Utility to decrypt private key
function decryptPrivateKey(encrypted, iv) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// POST /wallet - Create a new wallet
export const createWallet = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { holdings } = req.body;

    const keyPair = ECPair.makeRandom();
    const { address } = bitcoin.payments.p2pkh({
      pubkey: Buffer.from(keyPair.publicKey),
    });

    const publicKey = keyPair.publicKey.toString('hex');
    const privateKeyWIF = keyPair.toWIF();
    const { encrypted, iv } = encryptPrivateKey(privateKeyWIF);


    const newWallet = new Wallet({
      user: userId,
      publicKey,
      privateKey: encrypted,
      iv,
      holdings: holdings || []
    });

    const savedWallet = await newWallet.save();
    res.status(201).json({ walletId: savedWallet._id, address });
  } catch (error) {
    console.error("Error creating wallet:", error);
    res.status(500).json({ message: "Error creating wallet" });
  }
};

// GET /wallet/:id - Get wallet by ID
export const getWalletById = async (req, res) => {
  try {
    const id = req.params.walletId;
    console.log("Wallet ID from URL:", id);

    const wallet = await Wallet.findById(id);
    if (!wallet) {
      console.log("Wallet not found for ID:", id);
      return res.status(404).json({ message: 'Wallet not found' });
    }

    console.log("Wallet found:", wallet);
    res.json({ holdings: wallet.holdings });
  } catch (error) {
    console.error("Error fetching wallet holdings:", error);
    res.status(500).json({ message: "Error fetching wallet holdings" });
  }
};


// GET /wallet/:id/holdings - Get holdings
export const getWalletHoldings = async (req, res) => {
  try {
    const wallet = await CoinKey.findById(req.params.walletId);
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
    res.json({ holdings: wallet });
  } catch (error) {
    console.error("Error fetching holdings:", error);
    res.status(500).json({ message: "Error fetching wallet holdings" });
  }
};

// POST /wallet/:id/sign - Sign a message (for testing)
export const signMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const wallet = await Wallet.findById(req.params.id);
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    const privateKey = decryptPrivateKey(wallet.privateKey, wallet.iv);
    const keyPair = bitcoin.ECPair.fromWIF(privateKey);
    const signature = bitcoinMessage.sign(message, keyPair.privateKey, keyPair.compressed).toString('base64');

    res.json({ message, signature });
  } catch (error) {
    console.error("Signing error:", error);
    res.status(500).json({ message: 'Error signing message' });
  }
};

// POST /wallet/verify - Verify a message and signature
export const verifyMessage = async (req, res) => {
  try {
    const { message, address, signature } = req.body;
    const isValid = bitcoinMessage.verify(message, address, signature);
    res.json({ isValid });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: 'Error verifying signature' });
  }
};
