/**
 * Token Store
 * Handles persistent storage of OAuth tokens.
 * Currently uses an in-memory Map as a fallback, 
 * but structured to be easily replaced by Redis.
 */
class TokenStore {
  constructor() {
    this.tokens = new Map();
  }

  /**
   * Save tokens for a user
   * @param {string} userId 
   * @param {object} tokens 
   */
  async saveTokens(userId, tokens) {
    console.log(`[TokenStore] Saving tokens for user: ${userId}`);
    this.tokens.set(userId, {
      ...tokens,
      updatedAt: new Date().toISOString()
    });
    return true;
  }

  /**
   * Retrieve tokens for a user
   * @param {string} userId 
   * @returns {object|null}
   */
  async getTokens(userId) {
    const data = this.tokens.get(userId);
    if (!data) return null;
    return data;
  }

  /**
   * Delete tokens (revoke access)
   * @param {string} userId 
   */
  /**
   * Check if tokens exist for a user
   * @param {string} userId 
   * @returns {boolean}
   */
  async hasTokens(userId) {
    return this.tokens.has(userId);
  }
}

module.exports = new TokenStore();
