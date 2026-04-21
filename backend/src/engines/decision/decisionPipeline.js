/**
 * Decision Pipeline Orchestrator
 * Supports INITIAL (Mode 1) and FOLLOW-UP (Mode 2) processing.
 */
const extractEngine = require('./extractEngine');
const questionEngine = require('./questionEngine');
const analysisEngine = require('./analysisEngine');
const recommendationEngine = require('./recommendationEngine');
const sessionStore = require('../../utils/sessionStore');
const logger = require('../../utils/logger');
const { v4: uuidv4 } = require('uuid');

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

async function processInitial(input, existingSessionId) {
  const sessionId = existingSessionId || `session_${Date.now()}`;
  logger.log('decision-pipeline', `Starting Mode 1: Initial Request (${sessionId})`);

  try {
    // 1. Extract decision + options
    const extracted = await extractEngine.run(input);

    // 2. Generate questions
    const questioned = await questionEngine.run(extracted);

    const result = {
      sessionId,
      stage: 'analysis',
      lastActive: Date.now(),
      decision: extracted.decision,
      options: extracted.options,
      questions: questioned.questions,
      history: []
    };

    // Store in session
    sessionStore.set(sessionId, result);

    return result;
  } catch (error) {
    logger.error('decision-pipeline', `Mode 1 failed: ${error.message}`);
    throw error;
  }
}

async function processFollowUp(sessionId, answers) {
  logger.log('decision-pipeline', `Starting Mode 2: Follow-up Request (${sessionId})`);
  
  const session = sessionStore.get(sessionId);
  if (!session) throw new Error('Invalid session or session expired.');

  // Session Timeout Check
  if (Date.now() - (session.lastActive || 0) > SESSION_TIMEOUT) {
    sessionStore.delete(sessionId);
    throw new Error('Session timed out. Please restart the decision analysis.');
  }

  // State Transition Protection
  if (session.stage !== 'analysis') {
    throw new Error(`Invalid state transition: Cannot process follow-up in stage '${session.stage}'`);
  }

  // Answer Validation
  if (!answers || typeof answers !== 'object' || Object.keys(answers).length === 0) {
    throw new Error('Valid answers are required for follow-up analysis.');
  }

  try {
    session.lastActive = Date.now();
    session.history.push({ stage: session.stage, answers });

    const analysisInput = {
      decision: session.decision,
      options: session.options,
      user_answers: answers
    };

    // 1. Evaluate options
    const analyzed = await analysisEngine.run(analysisInput);

    // 2. Final recommendation
    const recommended = await recommendationEngine.run(analyzed);

    const result = {
      options: analyzed.options,
      recommended_option: recommended.recommended_option,
      reasoning: recommended.reasoning,
      next_step: recommended.next_step
    };

    session.stage = 'completed';
    sessionStore.set(sessionId, session);

    return result;
  } catch (error) {
    logger.error('decision-pipeline', `Mode 2 failed: ${error.message}`);
    throw error;
  }
}


module.exports = { processInitial, processFollowUp };
