/**
 * Extract Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/decision/extractPrompt');
const { validateDecision } = require('../../utils/decisionValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'decision-extraction'
  });

  validateDecision(result, 'extraction');
  return result;
}

module.exports = { run };
