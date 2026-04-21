/**
 * Task State Manager
 * Tracks and updates the internal state of agent tasks.
 */
class TaskStateManager {
  updateProgress(session, result) {
    session.history.push({
      step: session.current_step,
      action: session.current_action,
      result: result.status,
      timestamp: Date.now()
    });

    if (result.status === 'success') {
      session.current_step++;
    }

    session.progress = `Step ${session.current_step} of ${session.total_steps}`;
    return session;
  }

  setFailed(session, error) {
    session.status = 'failed';
    session.error = error;
    return session;
  }
}

module.exports = new TaskStateManager();
