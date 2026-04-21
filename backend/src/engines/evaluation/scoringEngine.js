/**
 * Scoring Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/evaluation/scoringPrompt');
const { validateEvaluation } = require('../../utils/evaluationValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: { output: input.output, feedback: input.user_feedback },
    stage: 'evaluation-scoring'
  });

  validateEvaluation(result, 'scoring');
  return result;
}

module.exports = { run };
