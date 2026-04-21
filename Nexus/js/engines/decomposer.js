window.Nexus = window.Nexus || {};

// Engine 1: Cognitive Decomposition Engine
Nexus.decompose = function(rawText) {
  if (!rawText || !rawText.trim()) return { atomic_thoughts: [] };

  const text = rawText.trim();
  const abbrevPattern = /\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|vs|etc|e\.g|i\.e|fig|no|vol)\./gi;
  let processed = text.replace(abbrevPattern, m => m.replace('.', '\u2024'));

  const rawSentences = processed.split(/(?<=[.!?])\s+/);
  const sentences = rawSentences
    .flatMap(s => s.split(/\n+/))
    .map(s => s.replace(/\u2024/g, '.').trim())
    .map(s => s.replace(/^[-\u2022*]\s*/, '').trim())
    .filter(s => s.length > 2);

  const cleaned = sentences.map(s => {
    if (s.endsWith('?')) return s.replace(/\?+$/, '?').trim();
    return s.replace(/[.!]+$/, '').trim();
  });

  const unique = [...new Set(cleaned)].filter(s => s.length > 0);
  return { atomic_thoughts: unique };
};
