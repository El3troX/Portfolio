import { animate } from 'animejs';

/**
 * ProjectsFlagship Section - Renders the 4 bespoke Flagship deep-dive projects
 * in priority order: Vidhan-AI -> Valkyrie-AML -> Wash Sale Auditor -> TixRush
 * per PORTFOLIO_SITE_SPEC.md §7a and Phase 8 interactive demo requirements.
 */
export class ProjectsFlagshipSection {
  constructor(container, portfolioData, scenes = {}) {
    this.container = container;
    this.portfolio = portfolioData;
    this.scenes = scenes;
    this.vidhanScene = scenes.vidhanScene;
    this.valkyrieScene = scenes.valkyrieScene;
    this.washSaleScene = scenes.washSaleScene;
    this.tixRushScene = scenes.tixRushScene;

    this.vidhanData = portfolioData.projects.find((p) => p.id === 'vidhan-ai');
    this.valkyrieData = portfolioData.projects.find((p) => p.id === 'valkyrie-aml');
    this.washSaleData = portfolioData.projects.find((p) => p.id === 'wash-sale-auditor');
    this.tixRushData = portfolioData.projects.find((p) => p.id === 'tixrush');

    this.ndcgAnimated = false;
    this.washSaleManualActive = false;
    this.washSaleScrubValue = 0.5;
    this.isSimulatingTixRush = false;

    this.render();
    this.initInteractiveControls();
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.id = 'flagships-container';

    // 1. Vidhan-AI Section
    this.renderVidhan();

    // 2. Valkyrie-AML Section
    this.renderValkyrie();

    // 3. Wash Sale Auditor Section
    this.renderWashSale();

    // 4. TixRush Section
    this.renderTixRush();

    this.container.appendChild(this.wrapper);
  }

  renderVidhan() {
    if (!this.vidhanData) return;
    const sec = document.createElement('section');
    sec.id = 'project-vidhan-ai';
    sec.className = 'flagship-project-section';
    sec.style.cssText = this.getSectionStyle();

    const catColor = 'var(--cat-rag-agentic)';

    sec.innerHTML = `
      <div style="max-width: var(--content-max-width); width: 100%; display: flex; flex-direction: column; gap: var(--space-6); pointer-events: auto;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.8rem;">
          <div class="pill pill--rag-agentic">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${catColor};"></span>
            <span>Flagship 01 &bull; RAG &amp; Information Retrieval</span>
          </div>
          <a href="${this.vidhanData.repo}" target="_blank" rel="noopener noreferrer" class="pill pill--interactive" style="color: var(--text-secondary);">
            github.com/El3troX/vidhan_ai &rarr;
          </a>
        </div>

        <div>
          <h2 style="font-family: var(--font-display); font-size: clamp(2.4rem, 5vw, 3.4rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.025em; color: var(--text-primary); margin: 0 0 0.5rem 0;">
            ${this.vidhanData.name}
          </h2>
          <p style="font-family: var(--font-mono); font-size: 1.05rem; color: var(--text-secondary); margin: 0;">
            ${this.vidhanData.subtitle}
          </p>
        </div>

        <p style="font-family: var(--font-body); font-size: 1.15rem; line-height: 1.65; color: var(--text-primary); margin: 0;">
          ${this.vidhanData.problem}
        </p>

        <!-- Architecture Breakdown -->
        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">System Architecture</div>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.65rem; font-family: var(--font-body); font-size: 0.98rem; color: var(--text-secondary); line-height: 1.55;">
            ${this.vidhanData.architecture.map((b) => `<li style="display: flex; align-items: flex-start; gap: 0.65rem;"><span style="color: ${catColor}; font-family: var(--font-mono);">&bull;</span><span>${b}</span></li>`).join('')}
          </ul>
        </div>

        <!-- 3D Interactive Statute Hierarchy Selector -->
        <div class="glass-card" style="padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--glow); text-transform: uppercase;">
              ⚡ Interactive 3D Hierarchy: Select statute filing tier
            </span>
            <span id="vidhan-active-tier-label" style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--cat-rag-agentic);">
              All Tiers Active
            </span>
          </div>

          <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
            <button type="button" class="nav-btn vidhan-tier-btn active" data-tier="ALL">
              <span>All Planes</span>
            </button>
            <button type="button" class="nav-btn vidhan-tier-btn" data-tier="PART">
              <span style="color: #a855f7;">&bull;</span>
              <span>Part (Constitutional)</span>
            </button>
            <button type="button" class="nav-btn vidhan-tier-btn" data-tier="CHAPTER">
              <span style="color: #3b82f6;">&bull;</span>
              <span>Chapter (Statutory)</span>
            </button>
            <button type="button" class="nav-btn vidhan-tier-btn" data-tier="SECTION">
              <span style="color: #22c55e;">&bull;</span>
              <span>Section (Citations)</span>
            </button>
          </div>
        </div>

        <!-- nDCG Animated Growth Bar per PORTFOLIO_SITE_SPEC §7a -->
        <div class="glass-card" style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem;">
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">Ranking Quality Lift (nDCG@5)</span>
            <div style="display: flex; align-items: center; gap: var(--space-3);">
              <span class="metric-badge">+18.2% Absolute Gain</span>
              <button type="button" id="btn-rerun-ndcg" class="nav-btn" style="padding: 0.2rem 0.6rem; font-size: 0.72rem;">
                ↻ Re-run Lift
              </button>
            </div>
          </div>

          <div style="position: relative; width: 100%; height: 28px; background: rgba(35, 35, 48, 0.6); border-radius: 6px; overflow: hidden; border: 1px solid var(--line);">
            <!-- Baseline Marker (0.70) -->
            <div style="position: absolute; left: 70%; top: 0; bottom: 0; width: 2px; background: rgba(255, 255, 255, 0.4); z-index: 2;"></div>
            <!-- Animated Fill Bar -->
            <div id="ndcg-progress-bar" style="width: 70%; height: 100%; background: linear-gradient(90deg, #3b82f6, #a855f7); transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);"></div>
          </div>

          <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">
            <span>Baseline (Embedding only): <strong style="color: var(--text-primary);">0.70</strong></span>
            <span>LambdaRank LTR: <strong style="color: #22c55e;">0.83</strong></span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--line); font-family: var(--font-mono); font-size: 0.8rem;">
            <div><span style="color: var(--text-secondary);">Precision@3:</span> <strong style="color: var(--glow);">+17.6%</strong></div>
            <div><span style="color: var(--text-secondary);">MRR:</span> <strong style="color: var(--glow);">+9.6%</strong></div>
            <div><span style="color: var(--text-secondary);">Latency:</span> <strong style="color: #22c55e;">&lt;3.0s</strong></div>
          </div>
        </div>

        <!-- Tech Stack Tags -->
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${this.vidhanData.stack.map((t) => `<span class="pill pill--interactive">${t}</span>`).join('')}
        </div>
      </div>
    `;

    this.wrapper.appendChild(sec);
  }

  renderValkyrie() {
    if (!this.valkyrieData) return;
    const sec = document.createElement('section');
    sec.id = 'project-valkyrie-aml';
    sec.className = 'flagship-project-section';
    sec.style.cssText = this.getSectionStyle();

    const catColor = 'var(--cat-rag-agentic)';

    sec.innerHTML = `
      <div style="max-width: var(--content-max-width); width: 100%; display: flex; flex-direction: column; gap: var(--space-6); pointer-events: auto;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.8rem;">
          <div class="pill pill--rag-agentic">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${catColor};"></span>
            <span>Flagship 02 &bull; Agentic AI &amp; Graph Analytics</span>
          </div>
          <a href="${this.valkyrieData.repo}" target="_blank" rel="noopener noreferrer" class="pill pill--interactive" style="color: var(--text-secondary);">
            github.com/El3troX/Valkyrie-AML &rarr;
          </a>
        </div>

        <div>
          <h2 style="font-family: var(--font-display); font-size: clamp(2.4rem, 5vw, 3.4rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.025em; color: var(--text-primary); margin: 0 0 0.5rem 0;">
            ${this.valkyrieData.name}
          </h2>
          <p style="font-family: var(--font-mono); font-size: 1.05rem; color: var(--text-secondary); margin: 0;">
            ${this.valkyrieData.subtitle}
          </p>
        </div>

        <p style="font-family: var(--font-body); font-size: 1.15rem; line-height: 1.65; color: var(--text-primary); margin: 0;">
          ${this.valkyrieData.problem}
        </p>

        <!-- Architecture Breakdown -->
        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">System Architecture</div>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.65rem; font-family: var(--font-body); font-size: 0.98rem; color: var(--text-secondary); line-height: 1.55;">
            ${this.valkyrieData.architecture.map((item) => `
              <li style="display: flex; align-items: flex-start; gap: 0.65rem;">
                <span style="color: ${catColor}; font-family: var(--font-mono);">&bull;</span>
                <span>${item}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Quantitative Metrics Grid -->
        <div class="glass-card" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;">
          <div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Detection Performance</div>
            <div style="font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: var(--glow); margin: 0.2rem 0;">
              82.7% <span style="font-size: 1rem; font-family: var(--font-mono); font-weight: 400; color: var(--text-secondary);">F1 Score</span>
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">
              73.0% Precision &bull; 95.3% Recall (200k txns)
            </div>
          </div>

          <div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">SAR Generation Collapse</div>
            <div style="font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: #22c55e; margin: 0.2rem 0;">
              45 min &rarr; &lt;15s
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">
              FinCEN-standard narrative auto-drafting
            </div>
          </div>
        </div>

        <!-- Interactive 3D Graph Trigger & Account Quick-Select -->
        <div class="glass-card" style="padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--glow); text-transform: uppercase;">
              ⚡ Graph Simulation Controls
            </span>
            <button type="button" id="btn-trigger-pagerank" class="nav-btn nav-btn--primary">
              <span>Trigger PageRank Pulse</span>
            </button>
          </div>

          <div style="display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap;">
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary);">Quick Inspect:</span>
            <button type="button" class="nav-btn valk-node-btn" data-node="ACC-SEED-901">Seed Mule (Hop 0)</button>
            <button type="button" class="nav-btn valk-node-btn" data-node="ACC-LAY-104">Layering 1 (Hop 1)</button>
            <button type="button" class="nav-btn valk-node-btn" data-node="ACC-SINK-301">Offshore Sink (Hop 3)</button>
          </div>
        </div>

        <!-- Live SHAP Inspector Panel -->
        <div id="shap-inspector-hud" class="glass-card" style="padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--glow);">SHAP Feature Attribution Inspector</span>
            <span id="selected-account-tag" class="pill pill--quant" style="font-weight: 600;">ACC-SEED-901 [FLAGGED ANOMALY]</span>
          </div>

          <div id="shap-features-list" style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 0.78rem;">
              <span style="color: var(--text-secondary);">transaction_velocity_zscore</span>
              <span style="color: #ef4444; font-weight: 600;">+0.38</span>
            </div>
            <div style="width: 100%; height: 6px; background: rgba(35, 35, 48, 0.6); border-radius: 3px; overflow: hidden;">
              <div style="width: 76%; height: 100%; background: #ef4444; border-radius: 3px;"></div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 0.78rem;">
              <span style="color: var(--text-secondary);">counterparty_risk_propagation</span>
              <span style="color: #ef4444; font-weight: 600;">+0.29</span>
            </div>
            <div style="width: 100%; height: 6px; background: rgba(35, 35, 48, 0.6); border-radius: 3px; overflow: hidden;">
              <div style="width: 58%; height: 100%; background: #ef4444; border-radius: 3px;"></div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 0.78rem;">
              <span style="color: var(--text-secondary);">historical_account_baseline</span>
              <span style="color: #3b82f6; font-weight: 600;">-0.11</span>
            </div>
            <div style="width: 100%; height: 6px; background: rgba(35, 35, 48, 0.6); border-radius: 3px; overflow: hidden;">
              <div style="width: 22%; height: 100%; background: #3b82f6; border-radius: 3px;"></div>
            </div>
          </div>
        </div>

        <!-- Tech Stack Tags -->
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${this.valkyrieData.stack.map((tag) => `<span class="pill pill--interactive">${tag}</span>`).join('')}
        </div>
      </div>
    `;

    this.wrapper.appendChild(sec);
  }

  renderWashSale() {
    if (!this.washSaleData) return;
    const sec = document.createElement('section');
    sec.id = 'project-wash-sale';
    sec.className = 'flagship-project-section';
    sec.style.cssText = this.getSectionStyle();

    const catColor = 'var(--cat-quant)';

    sec.innerHTML = `
      <div style="max-width: var(--content-max-width); width: 100%; display: flex; flex-direction: column; gap: var(--space-6); pointer-events: auto;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.8rem;">
          <div class="pill pill--quant">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${catColor};"></span>
            <span>Flagship 03 &bull; Quantitative FinTech &amp; Tax Graph</span>
          </div>
          <a href="${this.washSaleData.repo}" target="_blank" rel="noopener noreferrer" class="pill pill--interactive" style="color: var(--text-secondary);">
            github.com/El3troX/wash-sale-auditor &rarr;
          </a>
        </div>

        <div>
          <h2 style="font-family: var(--font-display); font-size: clamp(2.4rem, 5vw, 3.4rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.025em; color: var(--text-primary); margin: 0 0 0.5rem 0;">
            ${this.washSaleData.name}
          </h2>
          <p style="font-family: var(--font-mono); font-size: 1.05rem; color: var(--text-secondary); margin: 0;">
            ${this.washSaleData.subtitle}
          </p>
        </div>

        <p style="font-family: var(--font-body); font-size: 1.15rem; line-height: 1.65; color: var(--text-primary); margin: 0;">
          ${this.washSaleData.problem}
        </p>

        <!-- Architecture Breakdown -->
        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">Engine Architecture</div>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.65rem; font-family: var(--font-body); font-size: 0.98rem; color: var(--text-secondary); line-height: 1.55;">
            ${this.washSaleData.architecture.map((b) => `<li style="display: flex; align-items: flex-start; gap: 0.65rem;"><span style="color: ${catColor}; font-family: var(--font-mono);">&bull;</span><span>${b}</span></li>`).join('')}
          </ul>
        </div>

        <!-- Interactive 61-Day Window Scrubber -->
        <div class="glass-card" style="padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--glow); text-transform: uppercase;">
              ⚡ 61-Day Tax Window Interactive Scrubber
            </span>
            <span id="wash-sale-window-label" style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--cat-quant);">
              Day T-0 (Overlap Lock Detected)
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: var(--space-3);">
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary);">T - 30d</span>
            <input
              type="range"
              id="wash-sale-slider"
              min="0"
              max="100"
              value="50"
              style="flex: 1; accent-color: var(--cat-quant); cursor: pointer; height: 6px;"
              aria-label="61-Day Sliding Window Scrubber"
            />
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary);">T + 30d</span>
          </div>

          <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary);">
            <span>Slide to move the 3D tax window across trade timestamps</span>
            <button type="button" id="btn-reset-washsale" class="nav-btn" style="padding: 0.15rem 0.5rem; font-size: 0.72rem;">
              Auto-Animate
            </button>
          </div>
        </div>

        <!-- 50/50 IRS Publication 550 Test Suite Sequential Checklist per PORTFOLIO_SITE_SPEC §7a -->
        <div class="glass-card" style="display: flex; flex-direction: column; gap: 0.85rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">IRS Publication 550 Verification Matrix</span>
            <span class="metric-badge">50 / 50 PASSED</span>
          </div>

          <div id="wash-sale-checklist" style="display: flex; flex-direction: column; gap: 0.45rem; font-family: var(--font-mono); font-size: 0.8rem;">
            <div class="tc-item" style="color: var(--text-primary);"><span style="color: #22c55e;">[✓] TC-01:</span> Single-Account 30-Day FIFO Baseline ($2,000 disallowed, basis step-up)</div>
            <div class="tc-item" style="color: var(--text-primary);"><span style="color: #22c55e;">[✓] TC-02:</span> 30-Day Pre-Sale Acquisition Lookback Window Matching</div>
            <div class="tc-item" style="color: var(--text-primary);"><span style="color: #22c55e;">[✓] TC-03:</span> Cross-Broker Benchmark Index Swap (VOO Fidelity &rarr; IVV Schwab)</div>
            <div class="tc-item" style="color: var(--text-primary);"><span style="color: #22c55e;">[✓] TC-04:</span> Rev. Rul. 2008-5 IRA Repurchase (Permanent Disallowance, $0 Basis)</div>
            <div class="tc-item" style="color: var(--text-primary);"><span style="color: #22c55e;">[✓] TC-05:</span> Multi-Hop Chained Wash Sales Compounded Basis Propagation</div>
            <div class="tc-item" style="color: var(--text-primary);"><span style="color: #22c55e;">[✓] TC-06:</span> SEC Form N-PORT Cosine Similarity ($0.80 &le; s &lt; 0.95 Manual Review Queue)</div>
          </div>
        </div>

        <!-- Tech Stack Tags -->
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${this.washSaleData.stack.map((t) => `<span class="pill pill--interactive">${t}</span>`).join('')}
        </div>
      </div>
    `;

    this.wrapper.appendChild(sec);
  }

  renderTixRush() {
    if (!this.tixRushData) return;
    const sec = document.createElement('section');
    sec.id = 'project-tixrush';
    sec.className = 'flagship-project-section';
    sec.style.cssText = this.getSectionStyle();

    const catColor = 'var(--cat-fullstack)';

    sec.innerHTML = `
      <div style="max-width: var(--content-max-width); width: 100%; display: flex; flex-direction: column; gap: var(--space-6); pointer-events: auto;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.8rem;">
          <div class="pill pill--fullstack">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${catColor};"></span>
            <span>Flagship 04 &bull; High-Concurrency Distributed Systems</span>
          </div>
          <a href="${this.tixRushData.repo}" target="_blank" rel="noopener noreferrer" class="pill pill--interactive" style="color: var(--text-secondary);">
            github.com/El3troX/ticket-booking-system &rarr;
          </a>
        </div>

        <div>
          <h2 style="font-family: var(--font-display); font-size: clamp(2.4rem, 5vw, 3.4rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.025em; color: var(--text-primary); margin: 0 0 0.5rem 0;">
            ${this.tixRushData.name}
          </h2>
          <p style="font-family: var(--font-mono); font-size: 1.05rem; color: var(--text-secondary); margin: 0;">
            ${this.tixRushData.subtitle}
          </p>
        </div>

        <p style="font-family: var(--font-body); font-size: 1.15rem; line-height: 1.65; color: var(--text-primary); margin: 0;">
          ${this.tixRushData.problem}
        </p>

        <!-- Architecture Breakdown -->
        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">Distributed Architecture</div>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.65rem; font-family: var(--font-body); font-size: 0.98rem; color: var(--text-secondary); line-height: 1.55;">
            ${this.tixRushData.architecture.map((b) => `<li style="display: flex; align-items: flex-start; gap: 0.65rem;"><span style="color: ${catColor}; font-family: var(--font-mono);">&bull;</span><span>${b}</span></li>`).join('')}
          </ul>
        </div>

        <!-- Concurrency Correctness Metric Card -->
        <div class="glass-card" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem;">
          <div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Seat Lock Engine</div>
            <div style="font-family: var(--font-display); font-size: 1.65rem; font-weight: 700; color: var(--glow); margin: 0.2rem 0;">
              Atomic Redis Lua
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">
              Configurable 10-min TTL with auto-release
            </div>
          </div>

          <div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">State Synchronization</div>
            <div style="font-family: var(--font-display); font-size: 1.65rem; font-weight: 700; color: #3b82f6; margin: 0.2rem 0;">
              BullMQ &bull; Socket.io
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">
              Room broadcasting + async task queue
            </div>
          </div>
        </div>

        <!-- 3D Seat Lock Simulator Controls -->
        <div class="glass-card" style="padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--glow); text-transform: uppercase;">
              ⚡ Concurrency Stress Test Simulator
            </span>
            <button type="button" id="btn-simulate-tixrush" class="nav-btn nav-btn--primary">
              <span>Simulate 500 Concurrent Bookings</span>
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: var(--space-2); font-family: var(--font-mono); font-size: 0.78rem; padding-top: var(--space-2); border-top: 1px solid var(--line);">
            <div><span style="color: var(--text-secondary);">Load Contention:</span> <strong id="tix-load-label" style="color: var(--glow);">Idle (0 req/s)</strong></div>
            <div><span style="color: var(--text-secondary);">Seats Locked:</span> <strong id="tix-seats-label" style="color: #3b82f6;">3 / 24</strong></div>
            <div><span style="color: var(--text-secondary);">Oversell Events:</span> <strong style="color: #22c55e;">0 (Guaranteed)</strong></div>
          </div>
        </div>

        <!-- Tech Stack Tags -->
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${this.tixRushData.stack.map((t) => `<span class="pill pill--interactive">${t}</span>`).join('')}
        </div>
      </div>
    `;

    this.wrapper.appendChild(sec);
  }

  getSectionStyle() {
    return `
      position: relative;
      min-height: 120vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 8rem max(2rem, calc((100vw - 1280px) / 2));
      pointer-events: none;
    `;
  }

  initInteractiveControls() {
    // 1. Vidhan-AI Hierarchy Plane Tiers
    const tierBtns = this.wrapper.querySelectorAll('.vidhan-tier-btn');
    const tierLabel = this.wrapper.querySelector('#vidhan-active-tier-label');

    tierBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tierBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const tier = btn.getAttribute('data-tier');
        if (tierLabel) {
          tierLabel.innerText = tier === 'ALL' ? 'All Tiers Active' : `Focused: ${tier} Tier`;
        }

        if (this.vidhanScene && this.vidhanScene.planes) {
          this.vidhanScene.planes.forEach((p) => {
            const isMatch = tier === 'ALL' || p.lvl.name === tier;
            p.planeMesh.material.opacity = isMatch ? (tier === 'ALL' ? 0.22 : 0.85) : 0.08;
            p.edgesLine.material.opacity = isMatch ? 0.95 : 0.2;
            const targetScale = isMatch && tier !== 'ALL' ? 1.12 : 1.0;
            p.planeMesh.scale.set(targetScale, targetScale, 1.0);
          });
        }
      });
    });

    // Re-run nDCG Animation
    const btnNdcg = this.wrapper.querySelector('#btn-rerun-ndcg');
    if (btnNdcg) {
      btnNdcg.addEventListener('click', () => {
        const bar = document.getElementById('ndcg-progress-bar');
        if (bar) {
          bar.style.width = '70%';
          setTimeout(() => {
            bar.style.width = '83%';
          }, 120);
        }
      });
    }

    // 2. Valkyrie-AML PageRank Pulse Trigger
    const btnPageRank = this.wrapper.querySelector('#btn-trigger-pagerank');
    if (btnPageRank) {
      btnPageRank.addEventListener('click', () => {
        if (this.valkyrieScene) {
          this.valkyrieScene.hasPropagated = false;
          this.valkyrieScene.startPropagationSequence();
        }
      });
    }

    // Valkyrie Quick Inspect Account Buttons
    const valkNodeBtns = this.wrapper.querySelectorAll('.valk-node-btn');
    valkNodeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-node');
        if (this.valkyrieScene && this.valkyrieScene.nodes) {
          const targetNode = this.valkyrieScene.nodes.find((n) => n.userData.data.id === targetId);
          if (targetNode) {
            this.valkyrieScene.selectNode(targetNode);
          }
        }
      });
    });

    // 3. Wash Sale Auditor 61-Day Slider
    const washSlider = this.wrapper.querySelector('#wash-sale-slider');
    const washLabel = this.wrapper.querySelector('#wash-sale-window-label');
    const btnResetWash = this.wrapper.querySelector('#btn-reset-washsale');

    if (this.washSaleScene) {
      const origUpdate = this.washSaleScene.update.bind(this.washSaleScene);
      this.washSaleScene.update = (delta, elapsedTime) => {
        if (this.washSaleManualActive) {
          if (!this.washSaleScene.group.visible) return;
          const minX = -1.6;
          const maxX = 0.8;
          this.washSaleScene.windowMesh.position.x = minX + this.washSaleScrubValue * (maxX - minX);
          const isLocked = Math.abs(this.washSaleScene.windowMesh.position.x - (-0.1)) < 0.45;
          this.washSaleScene.windowBorder.material.opacity = isLocked ? 1.0 : 0.4;
          this.washSaleScene.windowMesh.material.opacity = isLocked ? 0.35 : 0.15;
        } else {
          origUpdate(delta, elapsedTime);
        }
      };
    }

    if (washSlider) {
      washSlider.addEventListener('input', (e) => {
        this.washSaleManualActive = true;
        const val = parseFloat(e.target.value);
        this.washSaleScrubValue = val / 100;

        const dayOffset = Math.round((val - 50) * 0.6);
        const daySign = dayOffset > 0 ? `+${dayOffset}` : `${dayOffset}`;
        const isOverlap = Math.abs(val - 50) < 15;

        if (washLabel) {
          washLabel.innerText = `Day T${daySign}d ${isOverlap ? '(Disallowance Lock Triggered)' : '(Window Clear)'}`;
          washLabel.style.color = isOverlap ? '#ef4444' : '#22c55e';
        }
      });
    }

    if (btnResetWash) {
      btnResetWash.addEventListener('click', () => {
        this.washSaleManualActive = false;
        if (washSlider) washSlider.value = 50;
        if (washLabel) {
          washLabel.innerText = 'Auto-Oscillation Mode Active';
          washLabel.style.color = 'var(--cat-quant)';
        }
      });
    }

    // 4. TixRush Concurrency Simulation
    const btnSimulateTix = this.wrapper.querySelector('#btn-simulate-tixrush');
    const tixLoadLabel = this.wrapper.querySelector('#tix-load-label');
    const tixSeatsLabel = this.wrapper.querySelector('#tix-seats-label');

    if (btnSimulateTix) {
      btnSimulateTix.addEventListener('click', () => {
        if (this.isSimulatingTixRush) return;
        this.isSimulatingTixRush = true;
        btnSimulateTix.disabled = true;
        btnSimulateTix.innerHTML = '<span>Simulating Ingestion Wave...</span>';

        if (tixLoadLabel) tixLoadLabel.innerText = '500 req/sec (High Contention)';
        if (tixLoadLabel) tixLoadLabel.style.color = '#ef4444';

        // Lock multiple seats in the 3D scene
        if (this.tixRushScene && this.tixRushScene.seats) {
          const unlocked = this.tixRushScene.seats.filter((s) => !s.isLocked);
          const toLock = unlocked.slice(0, 10);
          toLock.forEach((s) => {
            s.isLocked = true;
            s.mat.color.setHex(0xef4444);
            s.mat.emissive.setHex(0xef4444);
            s.mat.emissiveIntensity = 0.85;
          });

          if (tixSeatsLabel) {
            const count = this.tixRushScene.seats.filter((s) => s.isLocked).length;
            tixSeatsLabel.innerText = `${count} / 24`;
          }
        }

        // Reset after 3.5s
        setTimeout(() => {
          this.isSimulatingTixRush = false;
          btnSimulateTix.disabled = false;
          btnSimulateTix.innerHTML = '<span>Simulate 500 Concurrent Bookings</span>';
          if (tixLoadLabel) {
            tixLoadLabel.innerText = 'Idle (0 req/s)';
            tixLoadLabel.style.color = 'var(--glow)';
          }

          // Restore original state
          if (this.tixRushScene && this.tixRushScene.seats) {
            this.tixRushScene.seats.forEach((s) => {
              const isOrig = (s.row === 1 && s.col === 2) || (s.row === 2 && s.col === 3) || (s.row === 0 && s.col === 4);
              s.isLocked = isOrig;
              s.mat.color.setHex(isOrig ? 0xef4444 : 0x3b82f6);
              s.mat.emissive.setHex(isOrig ? 0xef4444 : 0x3b82f6);
              s.mat.emissiveIntensity = isOrig ? 0.65 : 0.3;
            });
            if (tixSeatsLabel) tixSeatsLabel.innerText = '3 / 24';
          }
        }, 3600);
      });
    }
  }

  triggerNdcgAnimation() {
    if (this.ndcgAnimated) return;
    this.ndcgAnimated = true;
    const bar = document.getElementById('ndcg-progress-bar');
    if (bar) {
      bar.style.width = '83%';
    }
  }

  updateInspector(nodeData, shapFeatures) {
    const tag = document.getElementById('selected-account-tag');
    if (tag) {
      tag.innerText = `${nodeData.id} [${nodeData.flagged ? 'FLAGGED ANOMALY' : 'CLEAN ACCOUNT'}]`;
      tag.className = nodeData.flagged ? 'pill pill--quant' : 'pill pill--fullstack';
    }

    const list = document.getElementById('shap-features-list');
    if (list && Array.isArray(shapFeatures)) {
      list.innerHTML = shapFeatures.map((feat) => {
        const valStr = feat.value > 0 ? `+${feat.value.toFixed(2)}` : `${feat.value.toFixed(2)}`;
        const barColor = feat.positive ? '#ef4444' : '#3b82f6';
        const widthPct = Math.min(100, Math.round(Math.abs(feat.value) * 200));

        return `
          <div style="display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 0.78rem;">
            <span style="color: var(--text-secondary);">${feat.name}</span>
            <span style="color: ${barColor}; font-weight: 600;">${valStr}</span>
          </div>
          <div style="width: 100%; height: 6px; background: rgba(35, 35, 48, 0.6); border-radius: 3px; overflow: hidden;">
            <div style="width: ${widthPct}%; height: 100%; background: ${barColor}; border-radius: 3px; transition: width 0.3s ease;"></div>
          </div>
        `;
      }).join('');
    }
  }
}
