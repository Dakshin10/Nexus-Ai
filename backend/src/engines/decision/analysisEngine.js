/**
 * Analysis Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/decision/analysisPrompt');
const { validateDecision } = require('../../utils/decisionValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'decision-analysis'
  });

  validateDecision(result, 'analysis');
  return result;
}

module.exports = { run };
