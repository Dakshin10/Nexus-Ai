/**
 * Cache Utility
 * Simple in-memory cache to deduplicate identical input processing.
 */
const crypto = require('crypto');

class Cache {
  constructor() {
    this.storage = new Map();
  }

  generateKey(input) {
    return crypto.createHash('sha256').update(JSON.stringify(input)).digest('hex');
  }

  get(input) {
    const key = this.generateKey(input);
    return this.storage.get(key);
  }

  set(input, data) {
    const key = this.generateKey(input);
    this.storage.set(key, data);
  }

  clear() {
    this.storage.clear();
  }
}

module.exports = new Cache();
