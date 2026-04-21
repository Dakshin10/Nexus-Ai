/**
 * Execution Router
 * Maps agent steps to functional modules dynamically.
 */
const streamPipeline = require('../engines/stream/streamPipeline');
const decisionPipeline = require('../engines/decision/decisionPipeline');
const gmailService = require('../services/gmailService');
const logger = require('../utils/logger');

class ExecutionRouter {
  async route(step, context) {
    logger.log('execution-router', `Routing action: ${step.action}`);

    switch (step.type) {
      case 'PROCESS_INPUT':
        return await streamPipeline.processStream(step.payload);
      case 'MAKE_DECISION':
        return await decisionPipeline.processDecision(step.payload);
      case 'FETCH_EXTERNAL':
        if (step.module === 'gmail') return await gmailService.fetchEmails(5);
        break;
      default:
        throw new Error(`Unknown action type: ${step.type}`);
    }
  }
}

module.exports = new ExecutionRouter();
