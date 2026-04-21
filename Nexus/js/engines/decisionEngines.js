window.Nexus = window.Nexus || {};

// Engine 12a: Strategic Thinking Engine
Nexus.strategicThinking = function(decisions) {
  const templates = {
    constraints: [
      'What hard constraints (time, budget, resources) would immediately eliminate one of these options?',
      'What dependencies must exist before this decision can be executed?',
      'Which option is reversible if circumstances change?'
    ],
    goals: [
      'Which option best aligns with your primary goal in the next 30 days?',
      'What does success look like 6 months after this decision?',
      'Are you optimizing for short-term output or long-term leverage?'
    ],
    tradeoffs: [
      'What are you willing to sacrifice — speed, quality, or relationships?',
      'Which option has the highest cost of being wrong?',
      'If you had to decide in 5 minutes, which option would you pick and why?'
    ]
  };

  return decisions.map(d => ({
    decision: d,
    questions: [
      templates.constraints[Math.floor(Math.random() * templates.constraints.length)],
      templates.goals[Math.floor(Math.random() * templates.goals.length)],
      templates.tradeoffs[Math.floor(Math.random() * templates.tradeoffs.length)]
    ]
  }));
};

// Engine 12b: Decision Analysis Engine
Nexus.decisionAnalysis = function(decisions) {
  return decisions.map(d => {
    const text = d.toLowerCase();
    const isTimeSensitive = /today|tomorrow|urgent|deadline|asap|immediately/i.test(d);
    const isCreative = /idea|concept|build|create|design|launch/i.test(d);
    const isRisky = /risk|bet|gamble|uncertain|unknown/i.test(d);

    return {
      decision: d,
      options: [
        {
          option: 'Proceed immediately',
          pros: ['Captures momentum', 'Reduces decision fatigue', isTimeSensitive ? 'Meets time constraint' : 'Shows initiative'],
          cons: ['May lack full information', 'Hard to reverse quickly'],
          risks: [isRisky ? 'High uncertainty environment' : 'Commitment without validation', 'Resource overcommitment'],
          score: isTimeSensitive ? 7 : 6
        },
        {
          option: 'Research & delay',
          pros: ['More information available', 'Lower risk of error', 'Time to consult others'],
          cons: ['Loses momentum', isTimeSensitive ? 'May miss deadline' : 'Opportunity cost', 'Analysis paralysis risk'],
          risks: ['Window of opportunity may close', 'Stakeholder frustration'],
          score: isTimeSensitive ? 4 : 7
        },
        {
          option: 'Partial commitment (pilot)',
          pros: ['Validates assumption early', 'Reversible', isCreative ? 'Encourages iteration' : 'Limits exposure'],
          cons: ['Slower full execution', 'May appear indecisive'],
          risks: ['Half-measures rarely satisfy all stakeholders', 'May need full commitment later anyway'],
          score: 8
        }
      ]
    };
  });
};
