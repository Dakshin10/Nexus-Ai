/**
 * Feedback Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/evaluation/feedbackPrompt');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'evaluation-feedback'
  });
  return result;
}

module.exports = { run };
