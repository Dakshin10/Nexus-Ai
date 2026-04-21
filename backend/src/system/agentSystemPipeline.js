/**
 * Agent System Pipeline
 * The core enhanced agent loop: Planning -> Routing -> Tracking -> Reflection.
 */
const executionRouter = require('./executionRouter');
const taskStateManager = require('./taskStateManager');
const logger = require('../utils/logger');

class AgentSystemPipeline {
  async runIteration(session) {
    if (session.current_step >= session.total_steps) {
      session.status = 'completed';
      return session;
    }

    const currentStepData = session.steps[session.current_step];
    
    // Mode Check: If Approve mode, wait for user
    if (session.mode === 'approve' && !session.user_approved) {
      session.status = 'waiting_for_user';
      session.suggestion = `NEXUS suggests: ${currentStepData.description}. Should I proceed?`;
      return session;
    }

    session.status = 'running';
    session.current_action = currentStepData.description;

    try {
      const result = await executionRouter.route(currentStepData, session);
      taskStateManager.updateProgress(session, { status: 'success', data: result });
      
      // Reset approval for next step
      session.user_approved = false;
      
      return session;
    } catch (error) {
      taskStateManager.setFailed(session, error.message);
      throw error;
    }
  }

  // Simplified Planning Engine (Heuristic for now)
  generatePlan(goal) {
    // In a real app, this would use LLM to decompose goal into steps
    return [
      { type: 'PROCESS_INPUT', description: 'Analyze goal context', payload: goal },
      { type: 'FETCH_EXTERNAL', module: 'gmail', description: 'Scan for related communications' },
      { type: 'MAKE_DECISION', description: 'Determine best execution path', payload: goal }
    ];
  }
}

module.exports = new AgentSystemPipeline();
