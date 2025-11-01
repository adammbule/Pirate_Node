import mongoose from "mongoose";

const keyReferenceSchema = new mongoose.Schema({
  piratecoinId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Piratecoin",
    required: true,
  },
  tier1_ref: {
    type: String, // IPFS, AWS KMS, or encryption reference
    required: true,
  },
  tier2_ref_root: {
    type: String, // derivation base for Tier II keys
  },
  tier3_ref_root: {
    type: String, // derivation base for Tier III keys
  },
  checksum: {
    type: String, // SHA256 hash for integrity
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model("KeyReference", keyReferenceSchema);
