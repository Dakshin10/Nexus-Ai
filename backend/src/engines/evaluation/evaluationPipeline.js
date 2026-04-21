/**
 * Evaluation Pipeline Orchestrator
 */
const scoringEngine = require('./scoringEngine');
const issueDetectionEngine = require('./issueDetectionEngine');
const feedbackEngine = require('./feedbackEngine');
const improvementEngine = require('./improvementEngine');
const evaluationStore = require('../../utils/evaluationStore');
const logger = require('../../utils/logger');

async function evaluateOutput(moduleName, output, userFeedback = null) {
  const startTime = logger.time();
  
  const results = {};

  try {
    // Stage 1: Quality Score
    results.scoring = await scoringEngine.run({ output, user_feedback: userFeedback });

    // Stage 2: Issue Detection
    results.issues = await issueDetectionEngine.run(output);

    // Stage 3: Generate Feedback
    results.feedback = await feedbackEngine.run({ output, issues: results.issues.issues });

    // Stage 4: Strategic Improvements
    results.improvement = await improvementEngine.run({ scoring: results.scoring, issues: results.issues });

    const finalOutput = {
      score: results.scoring.score,
      breakdown: results.scoring.breakdown,
      issues: results.issues.issues,
      feedback: results.feedback.feedback,
      improvement_suggestions: results.improvement.improvement_suggestions
    };

    // Store evaluation for long-term tracking
    evaluationStore.log({
      module: moduleName,
      score: finalOutput.score,
      issues: finalOutput.issues,
      feedback: finalOutput.feedback
    });

    const totalDuration = logger.timeEnd(startTime);
    logger.log('evaluation-pipeline', `Evaluation for ${moduleName} completed`, totalDuration);

    return finalOutput;
  } catch (error) {
    logger.error('evaluation-pipeline', `Evaluation failed: ${error.message}`);
    throw error;
  }
}

module.exports = { evaluateOutput };
