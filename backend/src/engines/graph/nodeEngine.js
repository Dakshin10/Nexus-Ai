/**
 * Node Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/graph/nodePrompt');
const { validateGraph } = require('../../utils/graphValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'graph-nodes'
  });

  validateGraph(result, 'graph-nodes');
  return result;
}

module.exports = { run };
