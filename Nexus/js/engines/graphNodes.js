window.Nexus = window.Nexus || {};

// Engine 4: Graph Node Generator
Nexus.generateNodes = function(classifiedData, executiveData) {
  const thoughts = classifiedData.classified || [];
  const urgentSet = new Set(executiveData.urgent || []);
  const weightMap = { task: 4, decision: 4, question: 3, idea: 3, emotion: 2 };

  const nodes = thoughts.map((t, i) => ({
    id: t.text,
    type: t.type,
    weight: urgentSet.has(t.text) ? 5 : (weightMap[t.type] || 3),
    index: i
  }));

  return { nodes };
};
