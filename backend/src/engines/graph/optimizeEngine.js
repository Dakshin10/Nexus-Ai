/**
 * Optimize Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/graph/optimizePrompt');
const { validateGraph } = require('../../utils/graphValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'graph-optimize'
  });

  validateGraph(result, 'graph-optimize');
  return result;
}

module.exports = { run };
