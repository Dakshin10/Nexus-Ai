/**
 * Response Composer
 * Standardizes the final unified output from multiple engine executions.
 */
function composeResponse(orchestration, executionResults, duration) {
  return {
    intent: orchestration.selected_module,
    modules_used: orchestration.execution_plan,
    result: executionResults,
    meta: {
      confidence: orchestration.confidence,
      processing_time: `${duration}ms`,
      timestamp: new Date().toISOString(),
      status: "success"
    }
  };
}

module.exports = { composeResponse };
