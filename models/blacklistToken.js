import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  userId: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

// Automatically delete expired blacklisted tokens
blacklistTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("BlacklistToken", blacklistTokenSchema);
