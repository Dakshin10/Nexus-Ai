/**
 * Logger Utility
 * Handles execution timing and structured logging for the NEXUS Stream Engine.
 */
const logger = {
  log: (stage, message, duration = null) => {
    const timestamp = new Date().toISOString();
    const durationStr = duration !== null ? ` [${duration}ms]` : '';
    console.log(`[${timestamp}] [${stage.toUpperCase()}]${durationStr}: ${message}`);
  },

  error: (stage, error) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [${stage.toUpperCase()}] ERROR: ${error.message || error}`);
  },

  time: (label) => {
    return process.hrtime();
  },

  timeEnd: (start) => {
    const diff = process.hrtime(start);
    return Math.round((diff[0] * 1e9 + diff[1]) / 1e6);
  }
};

module.exports = logger;
