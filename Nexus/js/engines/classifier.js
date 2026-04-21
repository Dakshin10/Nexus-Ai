window.Nexus = window.Nexus || {};

// Engine 2: Classification Engine
Nexus.classify = function(decomposedData) {
  const thoughts = decomposedData.atomic_thoughts || decomposedData;

  const Q = [/\?$/, /\bwhat\b/i, /\bwhy\b/i, /\bhow\b/i, /\bwhen\b/i, /\bwhere\b/i, /\bwho\b/i, /\bwhich\b/i, /\bshould i\b/i, /\bcan i\b/i, /\bdo i\b/i, /\bis there\b/i, /\bare there\b/i, /\bam i\b/i];
  const E = [/\bfeel(ing)?\b/i, /\bworried\b/i, /\banxious\b/i, /\bexcited\b/i, /\bscared\b/i, /\bhappy\b/i, /\bsad\b/i, /\bstressed\b/i, /\bnervous\b/i, /\bfrustrated\b/i, /\boverwhelmed\b/i, /\bafraid\b/i, /\blove\b/i, /\bhate\b/i, /\bglad\b/i, /\bupset\b/i, /\bconfused\b/i, /\bhopeful\b/i, /\bdread\b/i, /\bregret\b/i, /\bproud\b/i];
  const D = [/\beither\b/i, /\bchoose\b/i, /\bdecide\b/i, /\bdecision\b/i, /\boptions?\b/i, /\bbetween\b/i, /\bversus\b/i, /\bvs\b/i, /\bpick\b/i, /\bor not\b/i, /\bgo with\b/i, /\bconsidering\b/i];
  const T = [/\bneed to\b/i, /\bmust\b/i, /\bhave to\b/i, /\bgoing to\b/i, /\bplan to\b/i, /\bdeadline\b/i, /\bfinish\b/i, /\bcomplete\b/i, /\bsubmit\b/i, /\bsend\b/i, /\bcall\b/i, /\bwrite\b/i, /\breview\b/i, /\bfix\b/i, /\bupdate\b/i, /\bbuild\b/i, /\bcreate\b/i, /\bprepare\b/i, /\bschedule\b/i, /\bdeliver\b/i, /\blaunch\b/i, /\bdue\b/i, /\btodo\b/i, /\bby (today|tomorrow|monday|tuesday|wednesday|thursday|friday)\b/i];

  function classifyThought(text) {
    if (Q.some(r => r.test(text))) return 'question';
    if (E.some(r => r.test(text))) return 'emotion';
    if (D.some(r => r.test(text))) return 'decision';
    if (T.some(r => r.test(text))) return 'task';
    return 'idea';
  }

  return { classified: thoughts.map(text => ({ text, type: classifyThought(text) })) };
};
