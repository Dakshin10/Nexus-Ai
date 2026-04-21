window.Nexus = window.Nexus || {};

// Engine 8: UI Normalizer
Nexus.normalizeUI = function(classifiedData, executiveData, graphData) {
  const thoughts = classifiedData.classified || [];
  const byType = type => thoughts.filter(t => t.type === type).map(t => t.text);

  return {
    summary: executiveData.summary || '',
    tasks: byType('task'),
    ideas: byType('idea'),
    questions: byType('question'),
    emotions: byType('emotion'),
    decisions: byType('decision'),
    cognitive_load: executiveData.cognitive_load || { score: 0, status: 'green' },
    urgent: executiveData.urgent || [],
    top_priority: executiveData.top_priority || '',
    recommended_action: executiveData.recommended_action || '',
    graph: graphData
  };
};

// Engine 9: UI Attention Engine
Nexus.uiAttention = function(normalizedData) {
  const { urgent, cognitive_load, tasks, decisions, questions, ideas, emotions } = normalizedData;
  const hasUrgent = urgent && urgent.length > 0;
  const isHighLoad = cognitive_load && cognitive_load.score > 60;

  let ordered_sections = ['summary', 'cognitive_load'];
  if (hasUrgent) ordered_sections.push('urgent');
  ordered_sections.push('tasks', 'decisions', 'questions', 'ideas', 'emotions');

  const highlights = [];
  if (urgent && urgent[0]) highlights.push(urgent[0]);
  if (normalizedData.top_priority && !highlights.includes(normalizedData.top_priority)) highlights.push(normalizedData.top_priority);
  if (normalizedData.recommended_action) highlights.push(normalizedData.recommended_action);

  return { ordered_sections, highlight_items: highlights.slice(0, 3) };
};

// Engine 10: UI Transformer
Nexus.transformUI = function(normalizedData, attentionData) {
  const sectionMeta = {
    summary:        { title: 'Mental State Summary', emptyState: 'No summary available.' },
    cognitive_load: { title: 'Cognitive Load',        emptyState: '' },
    urgent:         { title: '⚡ Urgent Items',       emptyState: 'No urgent items.' },
    tasks:          { title: '✅ Tasks',              emptyState: 'No tasks identified.' },
    decisions:      { title: '⚖️ Decisions',         emptyState: 'No decisions to make.' },
    questions:      { title: '❓ Open Questions',     emptyState: 'No questions identified.' },
    ideas:          { title: '💡 Ideas',              emptyState: 'No ideas captured.' },
    emotions:       { title: '💭 Emotional State',   emptyState: 'No emotional signals detected.' }
  };

  const sections = (attentionData.ordered_sections || []).map(key => {
    const meta = sectionMeta[key] || { title: key, emptyState: 'No data.' };
    let items = [];
    if (key === 'summary') items = [normalizedData.summary].filter(Boolean);
    else if (key === 'cognitive_load') items = [`Score: ${normalizedData.cognitive_load.score}/100 (${normalizedData.cognitive_load.status})`];
    else if (key === 'urgent') items = normalizedData.urgent || [];
    else items = normalizedData[key] || [];
    return { key, title: meta.title, items, empty_state: meta.emptyState };
  });

  return { sections };
};

// Engine 11: UI State Engine
Nexus.uiState = function(normalizedData, attentionData) {
  const { score, status } = normalizedData.cognitive_load;
  const intensity = status;
  const tone = score > 60 ? 'urgent' : score > 30 ? 'focused' : 'calm';
  const animation_level = score > 60 ? 'high' : score > 30 ? 'medium' : 'low';
  return {
    ui_state: {
      intensity,
      tone,
      highlight: attentionData.highlight_items || [],
      animation_level
    }
  };
};
