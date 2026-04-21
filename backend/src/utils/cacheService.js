/**
 * Cache Service
 * Generic caching utility, Redis-ready with in-memory fallback.
 */
class CacheService {
  constructor() {
    this.cache = new Map();
    this.ttlMap = new Map();
  }

  /**
   * Set cache value
   * @param {string} key 
   * @param {any} value 
   * @param {number} ttlSeconds 
   */
  async set(key, value, ttlSeconds = 3600) {
    const expiry = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, JSON.stringify(value));
    this.ttlMap.set(key, expiry);
    return true;
  }

  /**
   * Get cache value
   * @param {string} key 
   */
  async get(key) {
    const expiry = this.ttlMap.get(key);
    if (!expiry || expiry < Date.now()) {
      this.cache.delete(key);
      this.ttlMap.delete(key);
      return null;
    }
    const val = this.cache.get(key);
    return val ? JSON.parse(val) : null;
  }

  /**
   * Delete cache value
   * @param {string} key 
   */
  async delete(key) {
    this.cache.delete(key);
    this.ttlMap.delete(key);
    return true;
  }

  /**
   * Clear expired items
   */
  prune() {
    const now = Date.now();
    for (const [key, expiry] of this.ttlMap.entries()) {
      if (expiry < now) {
        this.cache.delete(key);
        this.ttlMap.delete(key);
      }
    }
  }
}

// Global instance
const cacheService = new CacheService();

// Prune every 5 minutes
setInterval(() => cacheService.prune(), 300000);

module.exports = cacheService;
