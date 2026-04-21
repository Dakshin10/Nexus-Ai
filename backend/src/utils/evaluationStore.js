/**
 * Evaluation Store
 * In-memory storage for module performance tracking and quality audits.
 */
class EvaluationStore {
  constructor() {
    this.logs = [];
  }

  log(data) {
    this.logs.push({
      ...data,
      timestamp: new Date().toISOString()
    });
    // Keep last 1000 evaluations
    if (this.logs.length > 1000) this.logs.shift();
  }

  getStats(moduleName) {
    const moduleLogs = moduleName ? this.logs.filter(l => l.module === moduleName) : this.logs;
    if (moduleLogs.length === 0) return { avgScore: 0, count: 0 };
    
    const sum = moduleLogs.reduce((acc, log) => acc + log.score, 0);
    return {
      avgScore: Math.round(sum / moduleLogs.length),
      count: moduleLogs.length
    };
  }
}

module.exports = new EvaluationStore();
