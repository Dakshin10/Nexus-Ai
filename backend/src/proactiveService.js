/**
 * Proactive Service
 * Manages the periodic execution of the proactive intelligence loop.
 */
const proactivePipeline = require('./engines/proactive/proactivePipeline');
const logger = require('./utils/logger');

class ProactiveService {
  constructor() {
    this.interval = null;
    this.latestAlert = null;
  }

  /**
   * Start the proactive monitoring loop
   * @param {number} intervalMs - Frequency of checks (default 1 minute)
   */
  start(intervalMs = 60000) {
    logger.log('proactive-service', `Proactive Intelligence started (Every ${intervalMs/1000}s)`);
    
    this.interval = setInterval(async () => {
      const alert = await proactivePipeline.runPipeline();
      if (alert) {
        this.latestAlert = alert;
        logger.log('proactive-service', `New Alert: ${alert.alert}`);
        // In a real app, this would emit a WebSocket event or push notification
      }
    }, intervalMs);
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
    logger.log('proactive-service', 'Proactive Intelligence stopped.');
  }

  getLatestAlert() {
    return this.latestAlert;
  }
}

module.exports = new ProactiveService();
