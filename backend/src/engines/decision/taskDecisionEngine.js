/**
 * Task Decision Engine
 * Centralized logic for merging, deduplicating, and prioritizing heterogeneous task data.
 */
const logger = require('../../utils/logger');

class TaskDecisionEngine {
  constructor() {
    this.URGENCY_KEYWORDS = ['asap', 'urgent', 'immediately', 'critical', 'deadline', 'blocking'];
    this.PRIORITY_MAP = {
      'DO_NOW': 10,
      'high': 10,
      'DO_NEXT': 5,
      'medium': 5,
      'LATER': 1,
      'low': 1
    };
  }

  /**
   * Optimize a list of raw tasks into a prioritized pipeline
   * @param {Array} tasks 
   */
  optimize(tasks) {
    if (!tasks || !Array.isArray(tasks)) return { doNow: [], doNext: [], later: [] };

    // 1. Deduplicate & Merge
    const uniqueTasks = this.mergeSimilarTasks(tasks);

    // 2. Score
    const scoredTasks = uniqueTasks.map(task => ({
      ...task,
      score: this.calculateScore(task)
    }));

    // 3. Bucket
    const bucketed = this.bucket(scoredTasks);

    // 4. Identify Next Absolute Action
    const nextAction = this.pickNextAction(bucketed.doNow);

    return {
      ...bucketed,
      nextAction
    };
  }

  /**
   * Basic semantic merging using token overlap
   */
  mergeSimilarTasks(tasks) {
    const merged = [];
    const usedIndices = new Set();

    for (let i = 0; i < tasks.length; i++) {
      if (usedIndices.has(i)) continue;

      let currentTask = { ...tasks[i] };
      const tokens1 = new Set(currentTask.task.toLowerCase().split(/\s+/));

      for (let j = i + 1; j < tasks.length; j++) {
        if (usedIndices.has(j)) continue;

        const tokens2 = tasks[j].task.toLowerCase().split(/\s+/);
        const intersection = tokens2.filter(t => tokens1.has(t));
        const similarity = intersection.length / Math.max(tokens1.size, tokens2.length);

        if (similarity > 0.6) { // 60% overlap threshold
          usedIndices.add(j);
          currentTask.aggregated = true;
          currentTask.mergedSources = [
            ...(currentTask.mergedSources || [currentTask.source]),
            tasks[j].source
          ];
          // Keep the longer reasoning if available
          if ((tasks[j].reasoning?.length || 0) > (currentTask.reasoning?.length || 0)) {
            currentTask.reasoning = tasks[j].reasoning;
          }
        }
      }
      merged.push(currentTask);
    }
    return merged;
  }

  /**
   * Heuristic scoring based on priority, keywords, and metadata
   */
  calculateScore(task) {
    let score = this.PRIORITY_MAP[task.priority] || 5;

    // Keyword Boost
    const content = `${task.task} ${task.reasoning || ''} ${task.context || ''}`.toLowerCase();
    if (this.URGENCY_KEYWORDS.some(k => content.includes(k))) {
      score += 5;
    }

    // Source Bias (User Input > Gmail > Notion for reliability)
    if (task.source === 'manual') score += 2;
    if (task.source === 'gmail') score += 0.5;
    if (task.source === 'document') score += 1;

    return score;
  }

  /**
   * Select the single most important action for the OS to highlight
   */
  pickNextAction(doNowTasks) {
    if (!doNowTasks || doNowTasks.length === 0) return null;
    // Highest score in DO_NOW bucket
    return doNowTasks[0].task;
  }

  /**
   * Partition tasks into the 3-tier pipeline
   */
  bucket(tasks) {
    const doNow = [];
    const doNext = [];
    const later = [];

    tasks.forEach(task => {
      if (task.score >= 12) {
        doNow.push({ ...task, priority: 'DO_NOW' });
      } else if (task.score >= 5) {
        doNext.push({ ...task, priority: 'DO_NEXT' });
      } else {
        later.push({ ...task, priority: 'LATER' });
      }
    });

    // Sort within buckets by score
    const sortByScore = (a, b) => b.score - a.score;

    return {
      doNow: doNow.sort(sortByScore),
      doNext: doNext.sort(sortByScore),
      later: later.sort(sortByScore)
    };
  }
}

module.exports = new TaskDecisionEngine();
