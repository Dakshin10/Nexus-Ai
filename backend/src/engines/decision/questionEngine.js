/**
 * Question Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/decision/questionPrompt');
const { validateDecision } = require('../../utils/decisionValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'decision-questions'
  });

  validateDecision(result, 'questions');
  return result;
}

module.exports = { run };
