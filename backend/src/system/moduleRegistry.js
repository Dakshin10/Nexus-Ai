/**
 * Module Registry
 * Maps system module names to their respective pipeline entry points.
 */
const { processStream } = require('../engines/stream/streamPipeline');
const { processGraph } = require('../engines/graph/graphPipeline');
const { processUI } = require('../engines/ui/uiPipeline');
const { processInitial, processFollowUp } = require('../engines/decision/decisionPipeline');
const { processMemory } = require('../engines/memory/memoryPipeline');
const { orchestrate } = require('../engines/orchestrator/orchestratorPipeline');
const { processPrediction } = require('../engines/prediction/predictionPipeline');
const { processWeekly } = require('../engines/weekly/weeklyPipeline');
const { processExternal } = require('../engines/external/externalPipeline');
const { evaluateOutput } = require('../engines/evaluation/evaluationPipeline');

const moduleRegistry = {
  stream_engine: processStream,
  graph_engine: processGraph,
  ui_processing: processUI,
  decision_engine: processInitial, // Default to initial for system run
  memory_engine: processMemory,
  orchestrator: orchestrate,
  prediction_engine: processPrediction,
  weekly_engine: processWeekly,
  external_engine: processExternal,
  evaluation_engine: evaluateOutput
};

module.exports = moduleRegistry;
