/**
 * Task Decision Engine
 * Integrated logic for merging, deduplicating, and prioritizing tasks from Notion & Gmail.
 */
const logger = require('../../utils/logger');

class TaskDecisionEngine {
  /**
   * Main entry point for the decision engine (Phase 5)
   */
  optimize(gmailTasks, notionTasks) {
    // Phase 2: Merge
    let tasks = [...gmailTasks, ...notionTasks];

    // Phase 3: Deduplicate
    tasks = this.deduplicate(tasks);

    // Phase 4 & 5: Score and Bucket
    return this.decisionEngine(tasks);
  }

  /**
   * Phase 3: Deduplication
   * Removes duplicate tasks based on lowercase task text.
   */
  deduplicate(tasks) {
    const seen = new Map();

    tasks.forEach(task => {
      const key = task.task.toLowerCase().trim();

      if (!seen.has(key)) {
        seen.set(key, task);
      } else {
        // If it exists in multiple sources, mark it for a score boost
        const existing = seen.get(key);
        existing.appearsInMultipleSources = true;
        existing.source = existing.source.includes(task.source) 
          ? existing.source 
          : `${existing.source} + ${task.source}`;
      }
    });

    return Array.from(seen.values());
  }

  /**
   * Phase 4: Priority Scoring Engine
   * Re-evaluates priorities using combined context.
   */
  scoreTask(task) {
    let score = 0;

    // Rule: Urgency Keywords (+25)
    if (/urgent|asap|today|tomorrow|deadline|immediately/.test(task.task.toLowerCase())) {
      score += 25;
    }

    // Rule: Appears in multiple sources (+20)
    if (task.appearsInMultipleSources) {
      score += 20;
    }

    // Rule: Source specific bias (+10 for Gmail as requested)
    if (task.source.includes("gmail")) {
      score += 10;
    }

    // Rule: Original high priority bias
    if (task.priority === "DO_NOW") score += 10;

    return score;
  }

  /**
   * Phase 5: Decision Engine
   * Final priority assignment and categorization.
   */
  decisionEngine(tasks) {
    const result = {
      doNow: [],
      doNext: [],
      later: []
    };

    tasks.forEach(task => {
      const score = this.scoreTask(task);
      let finalPriority = "LATER";

      if (score > 30) finalPriority = "DO_NOW";
      else if (score > 15) finalPriority = "DO_NEXT";

      const finalTask = {
        ...task,
        priority: finalPriority,
        score
      };

      if (finalPriority === "DO_NOW") result.doNow.push(finalTask);
      else if (finalPriority === "DO_NEXT") result.doNext.push(finalTask);
      else result.later.push(finalTask);
    });

    // Sort by score within each bucket
    const sortByScore = (a, b) => b.score - a.score;
    result.doNow.sort(sortByScore);
    result.doNext.sort(sortByScore);
    result.later.sort(sortByScore);

    return result;
  }
}

module.exports = new TaskDecisionEngine();
