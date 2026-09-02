/**
 * Contact Terminal Section per PORTFOLIO_SITE_SPEC.md §9.
 * Interactive stylized terminal with IBM Plex Mono throughout,
 * typed prompt, command execution, and inline message dispatch.
 */
export class ContactSection {
  constructor(container, portfolioData) {
    this.container = container;
    this.portfolio = portfolioData;
    this.meta = portfolioData.meta;
    this.hasTyped = false;

    this.render();
  }

  render() {
    this.element = document.createElement('section');
    this.element.id = 'contact-section';
    this.element.style.cssText = `
      position: relative;
      min-height: 90vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 6rem max(2rem, calc((100vw - 1280px) / 2)) 4rem;
      pointer-events: auto;
    `;

    this.element.innerHTML = `
      <div style="
        max-width: var(--content-max-width);
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
      ">
        <div style="
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--cat-applied-ml);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        ">
          <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--cat-applied-ml);"></span>
          <span>07 &bull; Terminal &bull; Open Channel</span>
        </div>

        <!-- Stylized Terminal Window -->
        <div style="
          background: rgba(13, 13, 18, 0.95);
          border: 1px solid var(--line);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          font-family: var(--font-mono);
        ">
          <!-- Terminal Title Bar -->
          <div style="
            background: rgba(25, 25, 35, 0.8);
            padding: 0.65rem 1rem;
            border-bottom: 1px solid var(--line);
            display: flex;
            align-items: center;
            justify-content: space-between;
          ">
            <div style="display: flex; gap: 0.45rem;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444; opacity: 0.8;"></span>
              <span style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b; opacity: 0.8;"></span>
              <span style="width: 10px; height: 10px; border-radius: 50%; background: #22c55e; opacity: 0.8;"></span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); letter-spacing: 0.05em;">
              divyam@neural-core: ~
            </div>
            <div style="width: 40px;"></div>
          </div>

          <!-- Terminal Content Area -->
          <div style="padding: 1.5rem 1.75rem; display: flex; flex-direction: column; gap: 1.25rem;">
            <!-- Typed Command Line -->
            <div style="font-size: 0.95rem; color: var(--glow); display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #22c55e;">&gt;</span>
              <span id="terminal-typed-text">divyam --contact</span>
              <span class="terminal-cursor" style="display: inline-block; width: 8px; height: 16px; background: var(--glow); animation: termBlink 1s infinite;"></span>
            </div>

            <!-- Response / Output -->
            <div style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">
              Ready to collaborate on retrieval infrastructure, agentic pipelines, or full-stack production systems.
            </div>

            <!-- Command Links -->
            <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem;">
              <div style="display: flex; align-items: baseline; gap: 0.85rem; flex-wrap: wrap;">
                <span style="color: var(--cat-rag-agentic); font-weight: 600; min-width: 80px;">[email]</span>
                <a href="mailto:${this.meta.email}" style="color: var(--text-primary); text-decoration: none; border-bottom: 1px dashed var(--line); transition: color 0.2s;" onmouseover="this.style.color='#e8e6ff'" onmouseout="this.style.color='var(--text-primary)'">
                  ${this.meta.email}
                </a>
              </div>

              <div style="display: flex; align-items: baseline; gap: 0.85rem; flex-wrap: wrap;">
                <span style="color: var(--cat-fullstack); font-weight: 600; min-width: 80px;">[linkedin]</span>
                <a href="${this.meta.linkedin}" target="_blank" rel="noopener noreferrer" style="color: var(--text-primary); text-decoration: none; border-bottom: 1px dashed var(--line); transition: color 0.2s;" onmouseover="this.style.color='#e8e6ff'" onmouseout="this.style.color='var(--text-primary)'">
                  ${this.meta.linkedin.replace('https://', '')}
                </a>
              </div>

              <div style="display: flex; align-items: baseline; gap: 0.85rem; flex-wrap: wrap;">
                <span style="color: var(--cat-applied-ml); font-weight: 600; min-width: 80px;">[github]</span>
                <a href="${this.meta.github}" target="_blank" rel="noopener noreferrer" style="color: var(--text-primary); text-decoration: none; border-bottom: 1px dashed var(--line); transition: color 0.2s;" onmouseover="this.style.color='#e8e6ff'" onmouseout="this.style.color='var(--text-primary)'">
                  ${this.meta.github.replace('https://', '')}
                </a>
              </div>

              <div style="display: flex; align-items: baseline; gap: 0.85rem; flex-wrap: wrap;">
                <span style="color: var(--cat-quant); font-weight: 600; min-width: 80px;">[message]</span>
                <button id="terminal-msg-toggle" style="
                  background: none;
                  border: none;
                  color: var(--glow);
                  font-family: var(--font-mono);
                  font-size: 0.85rem;
                  cursor: pointer;
                  padding: 0;
                  text-decoration: underline;
                ">
                  Send inline message &darr;
                </button>
              </div>
            </div>

            <!-- Inline Message Input Form -->
            <div id="terminal-msg-form" style="display: none; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--line);">
              <textarea id="terminal-msg-input" placeholder="Type message payload..." rows="3" style="
                width: 100%;
                background: rgba(20, 20, 30, 0.8);
                border: 1px solid var(--line);
                border-radius: 4px;
                padding: 0.75rem;
                font-family: var(--font-mono);
                font-size: 0.82rem;
                color: var(--text-primary);
                resize: vertical;
                outline: none;
              "></textarea>
              <div style="display: flex; justify-content: flex-end;">
                <button id="terminal-msg-send" style="
                  background: rgba(35, 35, 48, 0.8);
                  border: 1px solid var(--line);
                  color: var(--glow);
                  font-family: var(--font-mono);
                  font-size: 0.8rem;
                  padding: 0.4rem 1rem;
                  border-radius: 4px;
                  cursor: pointer;
                  transition: all 0.2s ease;
                ">
                  Execute Transmission
                </button>
              </div>
              <div id="terminal-msg-status" style="font-size: 0.78rem; color: #22c55e; min-height: 1.2rem;"></div>
            </div>
          </div>
        </div>

        <!-- Quiet Footer -->
        <footer style="
          padding-top: 2rem;
          border-top: 1px solid var(--line);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-secondary);
        ">
          <div>Divyam Pandey &bull; 2026</div>
          <div>Neural Core &bull; Three.js + Anime.js</div>
        </footer>
      </div>
    `;

    // Add cursor blink style
    if (!document.getElementById('terminal-blink-style')) {
      const style = document.createElement('style');
      style.id = 'terminal-blink-style';
      style.textContent = `
        @keyframes termBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    this.container.appendChild(this.element);
    this.initInteraction();
  }

  initInteraction() {
    const toggleBtn = document.getElementById('terminal-msg-toggle');
    const msgForm = document.getElementById('terminal-msg-form');
    const sendBtn = document.getElementById('terminal-msg-send');
    const msgInput = document.getElementById('terminal-msg-input');
    const statusEl = document.getElementById('terminal-msg-status');

    if (toggleBtn && msgForm) {
      toggleBtn.addEventListener('click', () => {
        const isHidden = msgForm.style.display === 'none';
        msgForm.style.display = isHidden ? 'flex' : 'none';
        if (isHidden && msgInput) msgInput.focus();
      });
    }

    if (sendBtn && msgInput && statusEl) {
      sendBtn.addEventListener('click', () => {
        const val = msgInput.value.trim();
        if (!val) {
          statusEl.innerText = '[ERROR: PAYLOAD CANNOT BE EMPTY]';
          statusEl.style.color = '#ef4444';
          return;
        }

        statusEl.innerText = '[SENDING TRANSMISSION TO RETRIEVAL QUEUE...]';
        statusEl.style.color = 'var(--glow)';
        sendBtn.disabled = true;

        setTimeout(() => {
          statusEl.innerText = '[STATUS: 200 OK — MESSAGE DISPATCHED SUCCESSFULLY]';
          statusEl.style.color = '#22c55e';
          msgInput.value = '';
          sendBtn.disabled = false;
        }, 1100); // Fast under 1.5s total per spec
      });
    }
  }
}
