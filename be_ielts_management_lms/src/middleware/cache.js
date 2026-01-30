const cacheService = require("../cache/cache.service");

/**
 * Cache middleware - automatically cache GET requests
 * Usage: router.get('/path', cacheMiddleware(300), controller)
 * 
 * @param {number} ttl - Time to live in seconds (default: 300)
 * @param {function} keyGenerator - Custom cache key generator function
 * @returns {function} Express middleware
 */
function cacheMiddleware(ttl = 300, keyGenerator = null) {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    try {
      // Generate cache key
      const cacheKey = keyGenerator 
        ? keyGenerator(req) 
        : `api:${req.originalUrl || req.url}:${req.user?.id || "public"}`;

      // Try to get from cache
      const cachedData = await cacheService.get(cacheKey);
      
      if (cachedData) {
        console.log(`[Cache] HIT: ${cacheKey}`);
        return res.json(JSON.parse(cachedData));
      }

      console.log(`[Cache] MISS: ${cacheKey}`);

      // Store original json function
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = function(data) {
        // Cache the response
        cacheService.set(cacheKey, JSON.stringify(data), ttl)
          .catch(err => console.error("[Cache] Set error:", err.message));

        // Send the response
        return originalJson(data);
      };

      next();
    } catch (err) {
      console.error("[Cache] Middleware error:", err.message);
      next(); // Continue without caching on error
    }
  };
}

/**
 * Invalidate cache by pattern
 * Usage: await invalidateCache('users:*')
 * 
 * @param {string} pattern - Redis key pattern
 */
async function invalidateCache(pattern) {
  try {
    await cacheService.delPattern(pattern);
    console.log(`[Cache] Invalidated: ${pattern}`);
  } catch (err) {
    console.error("[Cache] Invalidation error:", err.message);
  }
}

module.exports = {
  cacheMiddleware,
  invalidateCache,
};
