/**
 * Ingestion Engine
 * Normalizes external inputs from various sources.
 */
async function run(input, context = {}) {
  // input can be raw text or a Gmail object { subject, snippet, sender }
  const normalized = typeof input === 'string' ? 
    { content: input, source: 'manual' } : 
    { content: `Subject: ${input.subject}\nFrom: ${input.sender}\n\n${input.snippet}`, source: 'gmail' };

  return normalized;
}

module.exports = { run };
