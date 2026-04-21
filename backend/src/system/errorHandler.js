/**
 * Global Error Handler for System Integration
 */
const logger = require('../utils/logger');

function handleSystemError(error, moduleName = 'system') {
  logger.error(moduleName, `Failure detected: ${error.message}`);
  
  return {
    success: false,
    module: moduleName,
    error: error.message,
    fallback_applied: true,
    safe_output: {
      message: "The system encountered an issue processing this request.",
      status: "degraded"
    }
  };
}

module.exports = { handleSystemError };
