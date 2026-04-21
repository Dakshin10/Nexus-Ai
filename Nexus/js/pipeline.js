window.Nexus = window.Nexus || {};

// Master Pipeline Orchestrator
Nexus.pipeline = {
  stages: [
    { id: 'decompose',    label: 'Decompose',     icon: '◈' },
    { id: 'classify',     label: 'Classify',      icon: '◈' },
    { id: 'executive',    label: 'Reasoning',     icon: '◈' },
    { id: 'graph-nodes',  label: 'Graph Nodes',   icon: '◈' },
    { id: 'graph-links',  label: 'Graph Links',   icon: '◈' },
    { id: 'optimize',     label: 'Optimize',      icon: '◈' },
    { id: 'visualize',    label: 'Visualize',     icon: '◈' },
    { id: 'normalize',    label: 'Normalize',     icon: '◈' },
    { id: 'attention',    label: 'Attention',     icon: '◈' },
    { id: 'transform',    label: 'Transform',     icon: '◈' },
    { id: 'ui-state',     label: 'UI State',      icon: '◈' },
    { id: 'decisions',    label: 'Decisions',     icon: '◈' }
  ],

  async run(rawText, onStageComplete) {
    const delay = ms => new Promise(r => setTimeout(r, ms));
    const emit = async (id, data) => {
      onStageComplete && onStageComplete(id, data);
      await delay(120);
    };

    try {
      const response = await fetch('http://localhost:3001/api/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: rawText })
      });
      if (response.ok) {
        const result = await response.json();
        const decomposed = { atomic_thoughts: [...result.tasks, ...result.ideas, ...result.questions, ...result.emotions, ...result.decisions] };
        const classified = { classified: [
          ...result.tasks.map(t => ({ text: t, type: 'task' })),
          ...result.ideas.map(t => ({ text: t, type: 'idea' })),
          ...result.questions.map(t => ({ text: t, type: 'question' })),
          ...result.emotions.map(t => ({ text: t, type: 'emotion' })),
          ...result.decisions.map(t => ({ text: t, type: 'decision' }))
        ]};
        const nodeData = Nexus.generateNodes(classified, result);
        const relData = Nexus.generateRelations(nodeData);
        const optimized = Nexus.optimizeGraph(relData);
        const visualized = Nexus.visualizeGraph(optimized);
        const normalized = Nexus.normalizeUI(classified, result, visualized);
        const attention = Nexus.uiAttention(normalized);
        const transformed = Nexus.transformUI(normalized, attention);
        const uiState = Nexus.uiState(normalized, attention);

        // Stages for UI
        await emit('decompose', decomposed);
        await emit('classify', classified);
        await emit('executive', result);
        await emit('graph-nodes', nodeData);
        await emit('graph-links', relData);
        await emit('optimize', optimized);
        await emit('visualize', visualized);
        await emit('normalize', normalized);
        await emit('attention', attention);
        await emit('transform', transformed);
        await emit('ui-state', uiState);
        await emit('decisions', { strategic: Nexus.strategicThinking(result.decisions), analysis: Nexus.decisionAnalysis(result.decisions) });
        
        // Stage 13: Memory (Optional/Adaptive)
        const memoryData = await fetch('http://localhost:3001/api/memory', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json());
        await emit('memory', memoryData);

        return { decomposed, classified, exec: result, graph: visualized, normalized, attention, transformed, uiState, decisionAnalysis: { strategic: [], analysis: [] }, memory: memoryData };

      }
    } catch (e) {
      console.warn('Backend API unavailable. Falling back to local engines.', e);
    }

    // Stage 1: Decompose
    const decomposed = Nexus.decompose(rawText);
    await emit('decompose', decomposed);


    // Stage 2: Classify
    const classified = Nexus.classify(decomposed);
    await emit('classify', classified);

    // Stage 3: Executive Reasoning
    const exec = Nexus.executive(classified);
    await emit('executive', exec);

    // Stage 4: Graph Nodes
    const nodeData = Nexus.generateNodes(classified, exec);
    await emit('graph-nodes', nodeData);

    // Stage 5: Graph Relations
    const relData = Nexus.generateRelations(nodeData);
    await emit('graph-links', relData);

    // Stage 6: Optimize
    const optimized = Nexus.optimizeGraph(relData);
    await emit('optimize', optimized);

    // Stage 7: Visualize
    const visualized = Nexus.visualizeGraph(optimized);
    await emit('visualize', visualized);

    // Stage 8: Normalize
    const normalized = Nexus.normalizeUI(classified, exec, visualized);
    await emit('normalize', normalized);

    // Stage 9: Attention
    const attention = Nexus.uiAttention(normalized);
    await emit('attention', attention);

    // Stage 10: Transform
    const transformed = Nexus.transformUI(normalized, attention);
    await emit('transform', transformed);

    // Stage 11: UI State
    const uiState = Nexus.uiState(normalized, attention);
    await emit('ui-state', uiState);

    // Stage 12: Decision Analysis
    const decisions = classified.classified.filter(t => t.type === 'decision').map(t => t.text);
    const decisionAnalysis = {
      strategic: Nexus.strategicThinking(decisions),
      analysis: Nexus.decisionAnalysis(decisions)
    };
    await emit('decisions', decisionAnalysis);

    return {
      decomposed, classified, exec,
      graph: visualized,
      normalized, attention, transformed,
      uiState, decisionAnalysis
    };
  }
};
