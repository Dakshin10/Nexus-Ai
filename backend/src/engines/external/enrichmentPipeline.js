/**
 * Contextual Enrichment Pipeline
 * Transforms raw external items into deeply contextualized intelligence.
 */
const contextEngine = require('./contextEngine');
const temporalEngine = require('./temporalEngine');
const dependencyEngine = require('./dependencyEngine');
const logger = require('../../utils/logger');

async function processEnrichment(items, userMemory = {}) {
  logger.log('enrichment-pipeline', `Starting contextual enrichment for ${items.length} items`);

  try {
    // 1. Context Linking
    const context = await contextEngine.run({ items, memory: userMemory });

    // 2. Temporal Awareness
    const temporal = await temporalEngine.run(items);

    // 3. Dependency Mapping
    const dependency = await dependencyEngine.run(items);

    // 4. Synthesize Enriched Items
    const enrichedItems = items.map(item => {
      const itemContext = context.contextual_links.find(l => l.item_id === item.item_id) || { links: [] };
      const itemTemporal = temporal.temporal_metadata.find(t => t.item_id === item.item_id) || { urgency_score: 0, time_window: 'unknown' };
      const itemDeps = dependency.dependency_map.find(d => d.item_id === item.item_id) || { depends_on: [] };

      return {
        ...item,
        urgency_score: itemTemporal.urgency_score,
        time_window: itemTemporal.time_window,
        dependencies: itemDeps.depends_on,
        context_links: itemContext.links
      };
    });

    return {
      items: enrichedItems,
      critical_path: dependency.critical_path || []
    };
  } catch (error) {
    logger.error('enrichment-pipeline', `Enrichment failed: ${error.message}`);
    throw error;
  }
}

module.exports = { processEnrichment };
