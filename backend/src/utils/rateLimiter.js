/**
 * Simple In-Memory Rate Limiter
 */
const logger = require('./logger');

const limits = new Map();

const rateLimit = (userId, limit = 10, windowMs = 60000) => {
  const now = Date.now();
  if (!limits.has(userId)) {
    limits.set(userId, { count: 1, resetAt: now + windowMs });
    return true;
  }

  const userLimit = limits.get(userId);
  if (now > userLimit.resetAt) {
    userLimit.count = 1;
    userLimit.resetAt = now + windowMs;
    return true;
  }

  if (userLimit.count >= limit) {
    logger.error('rate-limiter', `Rate limit exceeded for user: ${userId}`);
    return false;
  }

  userLimit.count++;
  return true;
};

module.exports = { rateLimit };
