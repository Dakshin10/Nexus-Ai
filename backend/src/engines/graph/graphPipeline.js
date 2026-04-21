/**
 * Graph Pipeline Orchestrator
 */
const nodeEngine = require('./nodeEngine');
const relationEngine = require('./relationEngine');
const optimizeEngine = require('./optimizeEngine');
const visualizationEngine = require('./visualizationEngine');
const logger = require('../../utils/logger');
const cache = require('../../utils/cache');

async function processGraph(classifiedThoughts) {
  const startTime = logger.time();
  
  const cachedResult = cache.get({ type: 'graph', input: classifiedThoughts });
  if (cachedResult) {
    logger.log('graph-pipeline', 'Cache hit - skipping graph generation');
    return cachedResult;
  }

  const results = {};

  try {
    // Stage 1: Create Nodes
    let nodes = await nodeEngine.run(classifiedThoughts);
    
    // Production limit: Max 20 nodes
    if (nodes.length > 20) {
      logger.log('graph-pipeline', `Limiting graph nodes from ${nodes.length} to 20`);
      nodes = nodes.slice(0, 20);
    }
    results.nodes = nodes;

    // Stage 2: Create Relations
    results.relations = await relationEngine.run(results.nodes);

    // Stage 3: Optimize
    results.optimized = await optimizeEngine.run(results.relations);

    // Stage 4: Visualize
    results.visualized = await visualizationEngine.run(results.optimized);

    // Cache final result
    cache.set({ type: 'graph', input: classifiedThoughts }, results.visualized);

    const totalDuration = logger.timeEnd(startTime);
    logger.log('graph-pipeline', 'Graph generation successfully completed', totalDuration);

    return results.visualized;
  } catch (error) {
    logger.error('graph-pipeline', `Graph generation failed: ${error.message}`);
    
    // Fallback: Empty but valid graph structure
    return { nodes: [], links: [] };
  }
}


module.exports = { processGraph };
