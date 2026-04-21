window.Nexus = window.Nexus || {};

Nexus.App = {
  result: null,

  debounceTimer: null,
  
  init() {
    document.getElementById('run-btn').addEventListener('click', () => this.run());
    document.getElementById('clear-btn').addEventListener('click', () => this.clear());
    document.getElementById('sample-btn').addEventListener('click', () => this.loadSample());
    document.getElementById('raw-input').addEventListener('keydown', e => {
      if (e.ctrlKey && e.key === 'Enter') this.run();
    });
    document.getElementById('modal-close').addEventListener('click', () => this.closeModal());
    document.getElementById('ob-next-btn').addEventListener('click', () => this.nextOnboardingStep());
    document.getElementById('ob-skip-btn').addEventListener('click', () => this.finishOnboarding());
    document.getElementById('agent-approve-btn').addEventListener('click', () => this.approveAgentAction());
    
    Nexus.GraphRenderer.clear();
    this.renderPipelineStages();
    this.checkGmailStatus();
    this.startProactiveMonitoring();
    this.initOnboarding();
  },

  agentSessionId: null,

  async run() {
    const input = document.getElementById('raw-input').value;
    if (!input) return;

    // Goal Detection: If input starts with 'goal:' or 'my goal is'
    if (input.toLowerCase().startsWith('goal:') || input.toLowerCase().includes('my goal is')) {
      this.startAgentGoal(input);
      return;
    }

    // Normal pipeline flow...
    this.showToast('Running Cognitive Pipeline...', 'info');
    document.getElementById('loading-overlay').classList.add('active');
    this.clearDashboard();
    Nexus.Pipeline.run(input);
  },

  async startAgentGoal(goal) {
    this.showToast('Initializing Goal-Driven Agent...', 'success');
    const res = await fetch('http://localhost:3001/api/agent/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal, mode: 'approve' })
    });
    const data = await res.json();
    this.agentSessionId = data.id;
    this.updateAgentUI(data);
  },

  async approveAgentAction() {
    this.showToast('Action Approved. Executing...', 'info');
    const res = await fetch('http://localhost:3001/api/agent/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: this.agentSessionId })
    });
    const data = await res.json();
    this.updateAgentUI(data);
  },

  updateAgentUI(data) {
    const bar = document.getElementById('agent-status-bar');
    bar.style.display = 'flex';
    document.getElementById('agent-goal-text').textContent = data.goal.substring(0, 30) + '...';
    document.getElementById('agent-progress-label').textContent = data.progress || 'PLANNING';
    document.getElementById('agent-suggestion').textContent = data.suggestion;
    
    if (data.status === 'completed') {
      this.showToast('Goal Successfully Completed!', 'success');
      setTimeout(() => bar.style.display = 'none', 5000);
    }
  },


  onboardingStep: 0,
  onboardingData: null,

  async initOnboarding() {
    const isReturning = localStorage.getItem('nexus_onboarded');
    if (isReturning) {
      document.getElementById('onboarding-overlay').style.display = 'none';
      this.fetchPersonalization();
      return;
    }

    const res = await fetch('http://localhost:3001/api/onboarding/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'new_user' })
    });
    this.onboardingData = await res.json();
    this.updateOnboardingUI();
  },

  nextOnboardingStep() {
    this.onboardingStep++;
    if (this.onboardingStep >= this.onboardingData.onboarding_steps.length) {
      this.finishOnboarding();
    } else {
      this.updateOnboardingUI();
    }
  },

  updateOnboardingUI() {
    const step = this.onboardingData.onboarding_steps[this.onboardingStep];
    const total = this.onboardingData.onboarding_steps.length;
    document.getElementById('ob-step-label').textContent = `STEP ${this.onboardingStep + 1}/${total}`;
    document.getElementById('ob-title').textContent = step.label;
    document.getElementById('ob-text').textContent = step.instruction;
    document.getElementById('ob-progress-fill').style.width = `${((this.onboardingStep + 1) / total) * 100}%`;
  },

  finishOnboarding() {
    localStorage.setItem('nexus_onboarded', 'true');
    document.getElementById('onboarding-overlay').classList.add('fade-out');
    setTimeout(() => {
      document.getElementById('onboarding-overlay').style.display = 'none';
      this.applyPersonalization(this.onboardingData);
    }, 500);
  },

  async fetchPersonalization() {
    const res = await fetch('http://localhost:3001/api/onboarding/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'returning_user', context: { proficiency: 'advanced' } })
    });
    const data = await res.json();
    this.applyPersonalization(data);
  },

  applyPersonalization(data) {
    document.body.className = `mode-${data.ui_mode}`;
    if (data.suggestions && data.suggestions.length > 0) {
      this.showGuidance(`<strong>Personalized for you:</strong> ${data.suggestions[0]}`);
    }
  },

  startProactiveMonitoring() {
    setInterval(async () => {
      try {
        const res = await fetch('http://localhost:3001/api/proactive/latest');
        if (res.ok) {
          const data = await res.json();
          if (data && data.alert) {
            this.showProactiveAlert(data);
          }
        }
      } catch (e) {
        // Silent fail for polling
      }
    }, 30000); // Check every 30s
  },

  showProactiveAlert(data) {
    this.showGuidance(`
      <div style="color:var(--cyan); font-weight:700; margin-bottom:4px">🚀 PROACTIVE INTERVENTION</div>
      <strong>${data.alert}</strong><br>
      <span style="font-size:10px; color:var(--text3)">${data.action}</span>
    `);
    this.showToast('NEXUS has a proactive suggestion for you.', 'info');
  },


  async checkGmailStatus() {
    try {
      const res = await fetch('http://localhost:3001/api/external/emails');
      if (res.ok) {
        const emails = await res.json();
        this.renderEmails(emails);
      }
    } catch (e) {
      console.log('Gmail not connected');
    }
  },

  async connectGmail() {
    this.showToast('Connecting to Google...', 'info');
    window.location.href = 'http://localhost:3001/api/external/oauth-url'; 
  },



  loadSample() {
    document.getElementById('raw-input').value =
      `I need to finish the product roadmap by Friday. I'm feeling overwhelmed by the backlog. Should I delegate the design tasks or handle them myself? Maybe we could hire a contractor. What does the team actually need right now? I have to prepare the investor deck for next week. I'm excited about the new architecture idea. We need to either migrate to the cloud now or plan it for Q3.`;
  },

  renderPipelineStages() {
    const container = document.getElementById('pipeline-stages');
    if (!container) return;
    container.innerHTML = Nexus.pipeline.stages.map(s =>
      `<div class="stage-item" id="stage-${s.id}" data-id="${s.id}">
        <span class="stage-dot"></span>
        <span class="stage-label">${s.label}</span>
      </div>`
    ).join('');
  },

  setStageStatus(id, status) {
    const el = document.getElementById(`stage-${id}`);
    if (!el) return;
    el.className = `stage-item ${status}`;
  },

  async run() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    
    this.debounceTimer = setTimeout(async () => {
      const raw = document.getElementById('raw-input').value.trim();
      if (!raw) {
        this.showGuidance("Try writing what you're thinking about right now. For example: <span class='guidance-link' onclick='Nexus.App.loadSample()'>'I need to finish the product roadmap...'</span>");
        this.showToast('Please enter some text first.', 'warn');
        return;
      }
      await this.executePipeline(raw);
    }, 300);
  },

  async executePipeline(raw) {


    document.getElementById('run-btn').disabled = true;
    document.getElementById('loading-overlay').classList.add('active');
    document.getElementById('guidance-panel').style.display = 'none';
    this.clearDashboard();

    Nexus.pipeline.stages.forEach(s => this.setStageStatus(s.id, 'pending'));

    try {
      this.result = await Nexus.pipeline.run(raw, (id, data) => {
        this.setStageStatus(id, 'done');
        if (id === 'visualize' && data.nodes && data.nodes.length > 0) {
          Nexus.GraphRenderer.render(data);
        }
        if (id === 'transform') {
          const panel = document.getElementById('sections-panel');
          panel.classList.add('fade-in');
          this.renderDashboard(data);
        }
        if (id === 'executive') {
          document.getElementById('loading-overlay').classList.remove('active');
          const panel = document.getElementById('exec-panel');
          panel.classList.add('fade-in');
          this.renderExecutive(data);
          if (data.prediction) this.renderPrediction(data.prediction);
        }

        if (id === 'ui-state') this.applyUIState(data.ui_state);
        if (id === 'decisions') this.renderDecisions(data);
        if (id === 'memory') this.renderMemoryInsights(data);
      });

      this.showToast('Pipeline complete!', 'success');
    } catch (err) {
      console.error(err);
      document.getElementById('loading-overlay').classList.remove('active');
      this.showToast('Pipeline error: ' + err.message, 'error');
    } finally {
      document.getElementById('run-btn').disabled = false;
      document.getElementById('run-btn').textContent = '▶ Run Pipeline';
    }

  },

  renderExecutive(exec) {
    const el = document.getElementById('exec-panel');
    if (!el) return;
    const load = exec.cognitive_load;
    el.innerHTML = `
      <div class="exec-summary fade-in">${exec.summary}</div>
      <div class="load-bar-container">
        <div class="dash-label" style="margin-bottom:8px">Cognitive Load Intensity</div>
        <div class="load-gauge">
          <div class="load-bar">
            <div class="load-fill load-${load.status}" style="width:${load.score}%"></div>
          </div>
          <span class="load-label ${load.status}">${load.score}/100 — ${load.status.toUpperCase()}</span>
        </div>
      </div>
      ${exec.urgent.length ? `<div class="urgent-box fade-in">⚡ ${exec.urgent.map(u => `<span>${u}</span>`).join('')}</div>` : ''}
      ${exec.top_priority ? `<div class="priority-box priority-highlight fade-in">🎯 <strong>TOP PRIORITY:</strong> ${exec.top_priority}</div>` : ''}
      ${exec.recommended_action ? `<div class="action-box fade-in">→ ${exec.recommended_action}</div>` : ''}
    `;

    if (load.score > 80) {
      this.showGuidance("<strong>High overload detected.</strong> Focus on one task first to reduce cognitive strain.");
    }
  },

  showGuidance(html) {
    const el = document.getElementById('guidance-panel');
    const text = document.getElementById('guidance-text');
    if (!el || !text) return;
    text.innerHTML = html;
    el.style.display = 'flex';
  },



  renderDashboard(transformedData) {
    const el = document.getElementById('sections-panel');
    if (!el) return;
    const sections = transformedData.sections.filter(s => !['summary', 'cognitive_load'].includes(s.key));
    el.innerHTML = sections.map(s => `
      <div class="section-card type-${s.key}">
        <div class="section-title">${s.title}</div>
        ${s.items.length
          ? s.items.map(item => `<div class="section-item">${item}</div>`).join('')
          : `<div class="section-empty">${s.empty_state}</div>`
        }
      </div>
    `).join('');
  },

  renderDecisions(decisionData) {
    const el = document.getElementById('decisions-panel');
    if (!el) return;
    
    if (!decisionData.analysis || decisionData.analysis.length === 0) {
      el.innerHTML = '<div class="section-empty">No decisions detected in your text.</div>';
      return;
    }

    // Step 1: Show Initial Analysis + Questions
    const d = decisionData.analysis[0];
    const sessionId = decisionData.sessionId;

    el.innerHTML = `
      <div class="progress-stepper">
        <div class="step-dot active"></div>
        <div class="step-dot ${decisionData.recommendation ? 'active' : ''}"></div>
      </div>
      
      <div class="decision-chat fade-in">
        <div class="chat-bubble chat-ai">
          <strong>Decision:</strong> ${d.decision}<br><br>
          I've identified these options. To give you the best recommendation, please answer:
        </div>

        <div class="answer-input-group">
          ${decisionData.questions[0].questions.map((q, idx) => `
            <div style="margin-bottom:8px">
              <div class="dash-label" style="font-size:9px; margin-bottom:4px">Question ${idx + 1}</div>
              <div style="font-size:11px; margin-bottom:4px">${q}</div>
              <input type="text" class="answer-field" data-idx="${idx}" placeholder="Your answer...">
            </div>
          `).join('')}
          <button class="submit-answers-btn" onclick="Nexus.App.submitDecisionAnswers('${sessionId}')">Submit Answers →</button>
        </div>

        <div class="dash-label" style="margin-top:12px; opacity:0.7">Guidance</div>
        <div style="font-size:10px; color:var(--text3); font-style:italic">
          💡 Stuck? Answer based on your primary goal.<br>
          💡 Unsure? There’s no perfect answer — choose what matters most to you right now.
        </div>
      </div>
    `;
  },


  async submitDecisionAnswers(sessionId) {
    const inputs = document.querySelectorAll('.answer-field');
    const answers = {};
    inputs.forEach(input => {
      answers[`q${parseInt(input.dataset.idx) + 1}`] = input.value || "Not specified";
    });

    const el = document.getElementById('decisions-panel');
    el.innerHTML = '<div class="section-empty">Calculating optimal recommendation...</div>';

    try {
      const response = await fetch('http://localhost:3001/api/decision/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, answers })
      });
      
      if (response.ok) {
        const result = await response.json();
        this.renderFinalDecision(result);
      }
    } catch (e) {
      this.showToast('Decision analysis failed', 'error');
    }
  },

  renderFinalDecision(result) {
    const el = document.getElementById('decisions-panel');
    const rec = result.recommended_option;

    el.innerHTML = `
      <div class="progress-stepper">
        <div class="step-dot active"></div>
        <div class="step-dot active"></div>
      </div>

      <div class="decision-chat fade-in">
        <div class="chat-bubble chat-ai">
          Analysis complete. Here is my strategic recommendation.
        </div>

        <div class="decision-options" style="margin-top:12px">
          ${result.options.map(opt => `
            <div class="decision-option ${opt.option === rec ? 'recommendation-highlight' : ''}">
              ${opt.option === rec ? '<div class="rec-badge">Best Choice</div>' : ''}
              <div class="opt-header">
                <span class="opt-name">${opt.option}</span>
                <span class="opt-score">${opt.score}/10</span>
              </div>
              <div class="opt-pros">✓ ${opt.pros.join(' · ')}</div>
              <div class="opt-cons">✗ ${opt.cons.join(' · ')}</div>
            </div>
          `).join('')}
        </div>

        <div class="action-box fade-in" style="border-color:var(--green); background:#22c55e08; color:var(--green)">
          🎯 <strong>Final Recommendation:</strong> ${rec}<br>
          <p style="margin-top:4px; font-size:10px; color:var(--text2)">${result.reasoning}</p>
        </div>

        <div class="dash-label" style="margin-top:8px">Next Step</div>
        <div class="section-item" style="border-left-color:var(--cyan)">${result.next_step}</div>
      </div>
    `;
  },


  renderMemoryInsights(memoryData) {
    const patternsEl = document.getElementById('patterns-panel');
    const nudgesEl = document.getElementById('nudges-panel');
    if (!patternsEl || !nudgesEl) return;

    if (!memoryData.patterns || memoryData.patterns.length === 0) {
      patternsEl.innerHTML = '<div class="section-empty">No recurring patterns detected yet.</div>';
    } else {
      patternsEl.innerHTML = memoryData.patterns.map(p => `
        <div class="pattern-card fade-in">
          <div class="pattern-text">${p.description || p.pattern || p}</div>
          <div class="pattern-stat">Frequency: Recurring Insight</div>
        </div>
      `).join('');
    }

    if (memoryData.behavioral_suggestion) {
      nudgesEl.innerHTML = `
        <div class="nudge-box fade-in">
          <span class="nudge-icon">💡</span>
          <span><strong>Behavioral Nudge:</strong> ${memoryData.behavioral_suggestion}</span>
        </div>
      `;
    } else {
      nudgesEl.innerHTML = '<div class="section-empty">The system is still learning your habits.</div>';
    }
  },

    const root = document.documentElement;
    root.setAttribute('data-tone', uiState.tone);
    root.setAttribute('data-intensity', uiState.intensity);
    const headerBadge = document.getElementById('tone-badge');
    if (headerBadge) {
      headerBadge.textContent = `${uiState.tone.toUpperCase()} · ${uiState.animation_level} activity`;
      headerBadge.className = `tone-badge ${uiState.intensity}`;
    }
  },

  clearDashboard() {
    ['exec-panel', 'sections-panel', 'decisions-panel', 'patterns-panel', 'nudges-panel', 'prediction-panel'].forEach(id => {


      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = '<div class="section-empty">Running pipeline…</div>';
        el.classList.remove('fade-in');
      }
    });
    Nexus.GraphRenderer.clear();
  },


  clear() {
    document.getElementById('raw-input').value = '';
    this.clearDashboard();
    Nexus.pipeline.stages.forEach(s => this.setStageStatus(s.id, ''));
    document.documentElement.removeAttribute('data-tone');
    document.documentElement.removeAttribute('data-intensity');
    const badge = document.getElementById('tone-badge');
    if (badge) { badge.textContent = 'IDLE'; badge.className = 'tone-badge'; }
  },

  onNodeClick(node) {
    const modal = document.getElementById('node-modal');
    document.getElementById('modal-title').textContent = node.type.toUpperCase();
    document.getElementById('modal-body').innerHTML = `
      <div class="modal-node-text" style="color:${node.color}">${node.id}</div>
      <div class="modal-meta">
        <span>Type: <strong>${node.type}</strong></span>
        <span>Weight: <strong>${node.weight}/5</strong></span>
        <span>Size: <strong>${node.size}</strong></span>
      </div>
    `;
    modal.classList.add('open');
  },

  closeModal() {
    document.getElementById('node-modal').classList.remove('open');
  },

  showToast(msg, type = 'info') {
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
  }
};

document.addEventListener('DOMContentLoaded', () => Nexus.App.init());

  renderPrediction(prediction) {
    const el = document.getElementById('prediction-panel');
    if (!el) return;
    const prob = prediction.completion_probability;
    const status = prob > 70 ? 'high' : prob > 40 ? 'medium' : 'low';
    const isRisk = prob < 30 || prediction.impact === 'high';

    el.innerHTML = \`n      <div class='prediction-card fade-in'>
        <div class='dash-label'>Completion Probability: \%</div>
        <div class='prob-gauge'>
          <div class='prob-fill prob-\' style='width:\%'></div>
        </div>
        
        <div class='risk-summary \'>
          ? \
        </div>

        <div class='suggestion-box'>
          ?? <strong>Tip:</strong> \
        </div>

        <div class='section-item' style='border-left-color:var(--yellow); background:#eab30808'>
          ?? <strong>Recommended Next Step:</strong> \
        </div>
      </div>
    \;
  },

  renderEmails(emails) {
    const onboarding = document.getElementById('gmail-onboarding');
    const panel = document.getElementById('gmail-panel');
    const list = document.getElementById('email-list');
    if (!onboarding || !panel || !list) return;

    if (emails.length === 0) {
      onboarding.style.display = 'flex';
      panel.style.display = 'none';
      this.showGuidance('No urgent emails found. Your inbox is clean!');
      return;
    }

    onboarding.style.display = 'none';
    panel.style.display = 'block';
    list.innerHTML = emails.map(email => \`n      <div class='email-item \ fade-in'>
        \
        <div class='email-subj'>\</div>
        <div class='email-snippet'>\</div>
      </div>
    \).join('');
  },
