import dotenv from "dotenv";

dotenv.config({ path: "../subkey.env" });

import Redis from "ioredis";


let redis;

try {
  // Try connecting to Render/Production Redis
  const redisUrl =
    process.env.REDISURL || process.env.REDISURL2 || process.env.REDISURL3;

  redis = new Redis(redisUrl);

  redis.on("connect", () => {
    console.log("✅ Connected to remote Redis");
  });

  redis.on("error", async (err) => {
    console.error("❌ Remote Redis connection failed:", err.message);
    console.log("⚙️ Switching to local Redis fallback...");

    try {
      // Gracefully close the failed connection before switching
      await redis.quit();
    } catch (_) {}

      // Connect to local Redis instead
    redis = new Redis("redis://127.0.0.1:6379");

    redis.on("connect", () => {
      console.log("✅ Connected to local Redis fallback");
    });

    redis.on("error", (localErr) => {
      console.error("❌ Local Redis error:", localErr.message);
    });
  });
} catch (error) {
  console.error("🚨 Redis initialization error:", error);
  redis = new Redis("redis://127.0.0.1:6379");
}

export default redis;
