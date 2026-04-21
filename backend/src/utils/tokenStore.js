/**
 * Token Store
 * Handles persistent storage of OAuth tokens.
 * Currently uses an in-memory Map as a fallback, 
 * but structured to be easily replaced by Redis for production scaling.
 */
const logger = require('./logger');

class TokenStore {
  constructor() {
    this.tokens = new Map();
    // In a production environment, you would initialize a Redis client here:
    // this.redis = new Redis(process.env.REDIS_URL);
  }

  /**
   * Helper to generate a unique key for a user and provider
   */
  _getKey(userId, providerId) {
    return `${userId}:${providerId}`;
  }

  /**
   * Save tokens for a user and provider
   * @param {string} userId 
   * @param {string} providerId
   * @param {object} tokens 
   */
  async saveTokens(userId, providerId, tokens) {
    if (!userId) throw new Error('userId is required for saving tokens');
    
    const key = this._getKey(userId, providerId);
    console.log(`[TokenStore] Saving tokens for ${key}`);
    
    const data = {
      ...tokens,
      providerId,
      updatedAt: new Date().toISOString()
    };

    this.tokens.set(key, data);
    
    // In Redis:
    // await this.redis.set(key, JSON.stringify(data));
    
    return true;
  }

  /**
   * Retrieve tokens for a user and provider
   * @param {string} userId 
   * @param {string} providerId
   * @returns {object|null}
   */
  async getTokens(userId, providerId) {
    const key = this._getKey(userId, providerId);
    const data = this.tokens.get(key);
    if (!data) return null;
    return data;
  }

  /**
   * Check if tokens exist for a user and provider
   * @param {string} userId 
   * @param {string} providerId
   * @returns {boolean}
   */
  async hasTokens(userId, providerId) {
    const key = this._getKey(userId, providerId);
    return this.tokens.has(key);
  }

  /**
   * List all connected providers for a user
   * @param {string} userId 
   */
  async listConnected(userId) {
    const connected = [];
    for (let [key, value] of this.tokens.entries()) {
      if (key.startsWith(`${userId}:`)) {
        connected.push(value.providerId);
      }
    }
    return connected;
  }
}

module.exports = new TokenStore();
