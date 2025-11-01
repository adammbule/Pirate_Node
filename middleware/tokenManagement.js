// utils/jwtBlacklist.js
import redis from '../middleware/redis.js'; // your redis connection file
import jwt from "jsonwebtoken";

const BLACKLIST_PREFIX = "blacklist:";

/**
 * Add a JWT to Redis blacklist until it would normally expire.
 */
export const blacklistToken = async (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return;

    const ttl = decoded.exp - Math.floor(Date.now() / 1000); // seconds until expiry
    if (ttl > 0) {
      await redis.setex(`${BLACKLIST_PREFIX}${token}`, ttl, "blacklisted");
      console.log(`🚫 Token blacklisted for ${ttl}s`);
      
    }
  } catch (error) {
    console.error("❌ Failed to blacklist token:", error);
  }
};

/**
 * Check if a JWT is blacklisted
 */
export const isTokenBlacklisted = async (token) => {
  try {
    const exists = await redis.exists(`${BLACKLIST_PREFIX}${token}`);
    return exists === 1;
  } catch (error) {
    console.error("❌ Redis check failed:", error);
    return false;
  }
};
export default { blacklistToken, isTokenBlacklisted };