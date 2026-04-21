/**
 * Recommendation Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/decision/recommendationPrompt');
const { validateDecision } = require('../../utils/decisionValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'decision-recommendation'
  });

  validateDecision(result, 'recommendation');
  return result;
}

module.exports = { run };
