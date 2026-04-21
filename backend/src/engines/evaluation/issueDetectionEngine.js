/**
 * Issue Detection Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/evaluation/issuePrompt');
const { validateEvaluation } = require('../../utils/evaluationValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'evaluation-issues'
  });

  validateEvaluation(result, 'issues');
  return result;
}

module.exports = { run };
