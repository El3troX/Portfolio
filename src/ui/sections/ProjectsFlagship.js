import { animate } from 'animejs';

/**
 * ProjectsFlagship Section - Renders the 4 bespoke Flagship deep-dive projects
 * in priority order: Vidhan-AI -> Valkyrie-AML -> Wash Sale Auditor -> TixRush
 * per PORTFOLIO_SITE_SPEC.md §7a.
 */
export class ProjectsFlagshipSection {
  constructor(container, portfolioData) {
    this.container = container;
    this.portfolio = portfolioData;

    this.vidhanData = portfolioData.projects.find((p) => p.id === 'vidhan-ai');
    this.valkyrieData = portfolioData.projects.find((p) => p.id === 'valkyrie-aml');
    this.washSaleData = portfolioData.projects.find((p) => p.id === 'wash-sale-auditor');
    this.tixRushData = portfolioData.projects.find((p) => p.id === 'tixrush');

    this.ndcgAnimated = false;
    this.checklistAnimated = false;

    this.render();
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
      <div style="max-width: var(--content-max-width); width: 100%; display: flex; flex-direction: column; gap: 2rem; pointer-events: auto;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.8rem;">
          <div style="font-family: var(--font-mono); font-size: 0.8rem; color: ${catColor}; letter-spacing: 0.08em; text-transform: uppercase; display: flex; align-items: center; gap: 0.6rem;">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${catColor};"></span>
            <span>Flagship 01 &bull; RAG &amp; Information Retrieval</span>
          </div>
          <a href="${this.vidhanData.repo}" target="_blank" rel="noopener noreferrer" style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); text-decoration: none;">
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
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">System Architecture</div>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.65rem; font-family: var(--font-body); font-size: 0.98rem; color: var(--text-secondary); line-height: 1.55;">
            ${this.vidhanData.architecture.map((b) => `<li style="display: flex; align-items: flex-start; gap: 0.65rem;"><span style="color: ${catColor}; font-family: var(--font-mono);">&bull;</span><span>${b}</span></li>`).join('')}
          </ul>
        </div>

        <!-- nDCG Animated Growth Bar per PORTFOLIO_SITE_SPEC §7a -->
        <div style="padding: 1.5rem 1.75rem; background: rgba(19, 19, 28, 0.75); backdrop-filter: blur(12px); border: 1px solid var(--line); border-radius: 8px; display: flex; flex-direction: column; gap: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">Ranking Quality Lift (nDCG@5)</span>
            <span style="font-family: var(--font-mono); font-size: 0.85rem; color: #22c55e; font-weight: 600;">+18.2% Absolute Gain</span>
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
          ${this.vidhanData.stack.map((t) => `<span style="font-family: var(--font-mono); font-size: 0.8rem; padding: 0.35rem 0.75rem; background: rgba(35, 35, 48, 0.5); border: 1px solid var(--line); border-radius: 4px; color: var(--text-primary);">${t}</span>`).join('')}
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
      <div style="max-width: var(--content-max-width); width: 100%; display: flex; flex-direction: column; gap: 2rem; pointer-events: auto;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.8rem;">
          <div style="font-family: var(--font-mono); font-size: 0.8rem; color: ${catColor}; letter-spacing: 0.08em; text-transform: uppercase; display: flex; align-items: center; gap: 0.6rem;">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${catColor};"></span>
            <span>Flagship 02 &bull; Agentic AI &amp; Graph Analytics</span>
          </div>
          <a href="${this.valkyrieData.repo}" target="_blank" rel="noopener noreferrer" style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); text-decoration: none;">
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
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
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
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; padding: 1.25rem 1.5rem; background: rgba(19, 19, 28, 0.75); backdrop-filter: blur(12px); border: 1px solid var(--line); border-radius: 8px;">
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

        <!-- Tech Stack Tags -->
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${this.valkyrieData.stack.map((tag) => `<span style="font-family: var(--font-mono); font-size: 0.8rem; padding: 0.35rem 0.75rem; background: rgba(35, 35, 48, 0.5); border: 1px solid var(--line); border-radius: 4px; color: var(--text-primary);">${tag}</span>`).join('')}
        </div>

        <!-- Interactive 3D Canvas Hint & Live SHAP Inspector -->
        <div id="shap-inspector-hud" style="padding: 1rem 1.25rem; background: rgba(19, 19, 28, 0.6); border: 1px dashed var(--line); border-radius: 6px; font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-secondary);">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="color: var(--glow);">⚡ Interactive Graph: Click any account node to inspect SHAP attribution</span>
            <span id="selected-account-tag" style="color: #f97316; font-weight: 600;">ACC-SEED-901 [FLAGGED]</span>
          </div>
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
      <div style="max-width: var(--content-max-width); width: 100%; display: flex; flex-direction: column; gap: 2rem; pointer-events: auto;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.8rem;">
          <div style="font-family: var(--font-mono); font-size: 0.8rem; color: ${catColor}; letter-spacing: 0.08em; text-transform: uppercase; display: flex; align-items: center; gap: 0.6rem;">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${catColor};"></span>
            <span>Flagship 03 &bull; Quantitative FinTech &amp; Tax Graph</span>
          </div>
          <a href="${this.washSaleData.repo}" target="_blank" rel="noopener noreferrer" style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); text-decoration: none;">
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
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">Engine Architecture</div>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.65rem; font-family: var(--font-body); font-size: 0.98rem; color: var(--text-secondary); line-height: 1.55;">
            ${this.washSaleData.architecture.map((b) => `<li style="display: flex; align-items: flex-start; gap: 0.65rem;"><span style="color: ${catColor}; font-family: var(--font-mono);">&bull;</span><span>${b}</span></li>`).join('')}
          </ul>
        </div>

        <!-- 50/50 IRS Publication 550 Test Suite Sequential Checklist per PORTFOLIO_SITE_SPEC §7a -->
        <div style="padding: 1.5rem 1.75rem; background: rgba(19, 19, 28, 0.75); backdrop-filter: blur(12px); border: 1px solid var(--line); border-radius: 8px; display: flex; flex-direction: column; gap: 0.85rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">IRS Publication 550 Verification Matrix</span>
            <span style="font-family: var(--font-mono); font-size: 0.85rem; color: #22c55e; font-weight: 600;">50 / 50 PASSED</span>
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
          ${this.washSaleData.stack.map((t) => `<span style="font-family: var(--font-mono); font-size: 0.8rem; padding: 0.35rem 0.75rem; background: rgba(35, 35, 48, 0.5); border: 1px solid var(--line); border-radius: 4px; color: var(--text-primary);">${t}</span>`).join('')}
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
      <div style="max-width: var(--content-max-width); width: 100%; display: flex; flex-direction: column; gap: 2rem; pointer-events: auto;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.8rem;">
          <div style="font-family: var(--font-mono); font-size: 0.8rem; color: ${catColor}; letter-spacing: 0.08em; text-transform: uppercase; display: flex; align-items: center; gap: 0.6rem;">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${catColor};"></span>
            <span>Flagship 04 &bull; High-Concurrency Distributed Systems</span>
          </div>
          <a href="${this.tixRushData.repo}" target="_blank" rel="noopener noreferrer" style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); text-decoration: none;">
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
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">Distributed Architecture</div>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.65rem; font-family: var(--font-body); font-size: 0.98rem; color: var(--text-secondary); line-height: 1.55;">
            ${this.tixRushData.architecture.map((b) => `<li style="display: flex; align-items: flex-start; gap: 0.65rem;"><span style="color: ${catColor}; font-family: var(--font-mono);">&bull;</span><span>${b}</span></li>`).join('')}
          </ul>
        </div>

        <!-- Concurrency Correctness Metric Card -->
        <div style="padding: 1.5rem 1.75rem; background: rgba(19, 19, 28, 0.75); backdrop-filter: blur(12px); border: 1px solid var(--line); border-radius: 8px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem;">
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

        <!-- Tech Stack Tags -->
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${this.tixRushData.stack.map((t) => `<span style="font-family: var(--font-mono); font-size: 0.8rem; padding: 0.35rem 0.75rem; background: rgba(35, 35, 48, 0.5); border: 1px solid var(--line); border-radius: 4px; color: var(--text-primary);">${t}</span>`).join('')}
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
      tag.style.color = nodeData.flagged ? '#f97316' : '#38bdf8';
    }
  }
}
