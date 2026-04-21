/**
 * Visualization Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/graph/visualizationPrompt');
const { validateGraph } = require('../../utils/graphValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'graph-visualize'
  });

  validateGraph(result, 'graph-visualize');
  return result;
}

module.exports = { run };
