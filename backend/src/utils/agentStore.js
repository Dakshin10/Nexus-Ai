/**
 * Agent Store
 * Persists the state of goal-driven agent sessions.
 */
const { v4: uuidv4 } = require('uuid');

class AgentStore {
  constructor() {
    this.sessions = new Map();
  }

  createSession(goal, mode = 'approve') {
    const id = uuidv4();
    const session = {
      id,
      goal,
      mode,
      status: 'running',
      current_step: 0,
      total_steps: 0,
      steps: [],
      history: [],
      suggestion: 'Initializing goal strategy...',
      actions: { approve: true, skip: true, pause: true }
    };
    this.sessions.set(id, session);
    return session;
  }

  getSession(id) {
    return this.sessions.get(id);
  }

  updateSession(id, updates) {
    const session = this.sessions.get(id);
    if (session) {
      Object.assign(session, updates);
      return session;
    }
    return null;
  }
}

module.exports = new AgentStore();
