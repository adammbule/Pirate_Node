import jwt from "jsonwebtoken";
import Redis from "ioredis";

// Reuse single Redis connection (use your fallback URLs)
const redis = new Redis(process.env.REDISURL || process.env.REDISURL2 || "redis://127.0.0.1:6379");

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or invalid format" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔑 Token received:", token);

  try {
    // 1️⃣ Check if token is blacklisted
    const blacklisted = await redis.get(`blacklist:${token}`);

    
    if (blacklisted) {
      console.warn("🚫 Token is blacklisted!");
      return res.status(401).json({ message: "Token has been invalidated" });
    }
    console.log("🧾 Redis check:", blacklisted);
    // 2️⃣ Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded token:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ JWT Verification Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};

export { verifyJWT };
