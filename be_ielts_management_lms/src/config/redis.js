// Redis Configuration
const redis = require("redis");

let redisClient = null;
let connectionAttempted = false;

const connectRedis = async () => {
  try {
    // Skip Redis if disabled or already attempted
    if (process.env.REDIS_ENABLED === "false") {
      console.log("⊘ Redis disabled (REDIS_ENABLED=false)");
      return null;
    }

    // Skip if not explicitly enabled (default is disabled)
    if (process.env.REDIS_ENABLED !== "true") {
      console.log("⊘ Redis not enabled (set REDIS_ENABLED=true to enable)");
      return null;
    }

    if (connectionAttempted) {
      return redisClient;
    }

    connectionAttempted = true;

    redisClient = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT) || 6379,
        reconnectStrategy: false, // Disable auto-reconnect to prevent spam
      },
      password: process.env.REDIS_PASSWORD || undefined,
      database: parseInt(process.env.REDIS_DB) || 0,
    });

    // Suppress error spam - only log once
    let errorLogged = false;
    redisClient.on("error", (err) => {
      if (!errorLogged) {
        console.error("❌ Redis error:", err.message);
        errorLogged = true;
      }
    });

    redisClient.on("connect", () => {
      console.log("✓ Redis connected");
    });

    // Set connection timeout
    const connectPromise = redisClient.connect();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Connection timeout")), 5000)
    );

    await Promise.race([connectPromise, timeoutPromise]);
    return redisClient;
  } catch (error) {
    console.warn("⚠ Redis unavailable:", error.message);
    
    // Clean up failed client
    if (redisClient) {
      try {
        await redisClient.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
      redisClient = null;
    }
    
    // Continue without Redis if not critical
    if (process.env.REQUIRE_REDIS === "true") {
      throw error;
    }
    
    console.log("→ Running without Redis (caching disabled)");
    return null;
  }
};

const getRedisClient = () => {
  return redisClient;
};

const disconnectRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    console.log("✓ Redis disconnected");
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  disconnectRedis,
};
