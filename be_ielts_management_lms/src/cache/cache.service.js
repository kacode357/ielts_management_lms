// Cache Service - Redis wrapper with fallback
const { getRedisClient } = require("../config/redis");

class CacheService {
  constructor() {
    this.enabled = process.env.REDIS_ENABLED !== "false";
    this.defaultTTL = parseInt(process.env.CACHE_TTL) || 3600; // 1 hour
  }

  /**
   * Get value from cache
   * @param {string} key 
   * @returns {Promise<any>}
   */
  async get(key) {
    if (!this.enabled) return null;
    
    try {
      const client = getRedisClient();
      if (!client) return null;
      
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  }

  /**
   * Set value in cache
   * @param {string} key 
   * @param {any} value 
   * @param {number} ttl - Time to live in seconds
   * @returns {Promise<boolean>}
   */
  async set(key, value, ttl = null) {
    if (!this.enabled) return false;
    
    try {
      const client = getRedisClient();
      if (!client) return false;
      
      const expiry = ttl || this.defaultTTL;
      await client.setEx(key, expiry, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Cache set error:", error);
      return false;
    }
  }

  /**
   * Delete key from cache
   * @param {string} key 
   * @returns {Promise<boolean>}
   */
  async del(key) {
    if (!this.enabled) return false;
    
    try {
      const client = getRedisClient();
      if (!client) return false;
      
      await client.del(key);
      return true;
    } catch (error) {
      console.error("Cache del error:", error);
      return false;
    }
  }

  /**
   * Delete keys by pattern
   * @param {string} pattern 
   * @returns {Promise<number>}
   */
  async delPattern(pattern) {
    if (!this.enabled) return 0;
    
    try {
      const client = getRedisClient();
      if (!client) return 0;
      
      const keys = await client.keys(pattern);
      if (keys.length === 0) return 0;
      
      await client.del(keys);
      return keys.length;
    } catch (error) {
      console.error("Cache delPattern error:", error);
      return 0;
    }
  }

  /**
   * Check if key exists
   * @param {string} key 
   * @returns {Promise<boolean>}
   */
  async exists(key) {
    if (!this.enabled) return false;
    
    try {
      const client = getRedisClient();
      if (!client) return false;
      
      return await client.exists(key) === 1;
    } catch (error) {
      console.error("Cache exists error:", error);
      return false;
    }
  }

  /**
   * Cache wrapper - get from cache or execute function
   * @param {string} key 
   * @param {Function} fn 
   * @param {number} ttl 
   * @returns {Promise<any>}
   */
  async wrap(key, fn, ttl = null) {
    // Try to get from cache
    const cached = await this.get(key);
    if (cached !== null) {
      return cached;
    }

    // Execute function and cache result
    const result = await fn();
    await this.set(key, result, ttl);
    return result;
  }
}

module.exports = new CacheService();
