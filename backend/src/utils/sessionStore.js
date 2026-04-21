/**
 * Session Store
 * In-memory storage for multi-step decision sessions.
 */
class SessionStore {
  constructor() {
    this.sessions = new Map();
  }

  get(sessionId) {
    return this.sessions.get(sessionId);
  }

  set(sessionId, data) {
    this.sessions.set(sessionId, {
      ...data,
      updatedAt: Date.now()
    });
  }

  delete(sessionId) {
    this.sessions.delete(sessionId);
  }
}

module.exports = new SessionStore();
