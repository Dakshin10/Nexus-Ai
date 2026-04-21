/**
 * Improvement Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/evaluation/improvementPrompt');
const { validateEvaluation } = require('../../utils/evaluationValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'evaluation-improvement'
  });

  validateEvaluation(result, 'improvement');
  return result;
}

module.exports = { run };
