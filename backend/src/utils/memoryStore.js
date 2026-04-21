/**
 * Memory Store
 * In-memory storage for user-specific long-term cognitive memory.
 */
class MemoryStore {
  constructor() {
    this.storage = new Map();
  }

  getMemory(userId) {
    return this.storage.get(userId) || {
      memory_items: [],
      patterns: [],
      risk_prediction: 'No data',
      behavioral_suggestion: 'Continue initial profiling.'
    };
  }

  updateMemory(userId, data) {
    const current = this.getMemory(userId);
    
    // 1. Deduplication
    const existingTexts = new Set(current.memory_items.map(m => m.text));
    const newItems = (data.memory_items || []).filter(m => !existingTexts.has(m.text));
    
    let combinedItems = [...current.memory_items, ...newItems];

    // 2. Production Limit: Max 50 items
    if (combinedItems.length > 50) {
      // 3. Pruning: Sort by weight and keep top 50
      combinedItems.sort((a, b) => (b.weight || 0) - (a.weight || 0));
      combinedItems = combinedItems.slice(0, 50);
    }

    this.storage.set(userId, {
      ...data,
      memory_items: combinedItems,
      lastUpdated: new Date().toISOString()
    });
  }
}


module.exports = new MemoryStore();
