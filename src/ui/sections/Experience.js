/**
 * Experience Section per PORTFOLIO_SITE_SPEC.md §5.
 * Chronological dual-waypoint HUD readout (Mahindra & Mahindra, EY GDS) with category-encoded tech pills.
 */
export class ExperienceSection {
  constructor(container, portfolioData) {
    this.container = container;
    this.portfolio = portfolioData;
    this.experiences = portfolioData.experience;

    this.render();
  }

  getCategoryColorForTech(techName) {
    const name = techName.toLowerCase();
    if (
      name.includes('rag') ||
      name.includes('nlp') ||
      name.includes('deep learning') ||
      name.includes('langchain') ||
      name.includes('langgraph') ||
      name.includes('vector') ||
      name.includes('mcp')
    ) {
      return 'var(--cat-rag-agentic)';
    }
    if (name.includes('n8n') || name.includes('fastapi') || name.includes('websockets') || name.includes('distributed')) {
      return 'var(--cat-fullstack)';
    }
    return 'var(--cat-applied-ml)';
  }

  render() {
    this.element = document.createElement('section');
    this.element.id = 'experience-section';
    this.element.style.cssText = `
      position: relative;
      min-height: 110vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 6rem max(2rem, calc((100vw - 1280px) / 2));
      pointer-events: none;
    `;

    this.element.innerHTML = `
      <div style="
        max-width: var(--content-max-width);
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
        pointer-events: auto;
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
          <span>02 &bull; Experience &bull; Production Systems</span>
        </div>

        <h2 style="
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.025em;
          color: var(--text-primary);
          margin: 0;
        ">
          Engineering in Production Environments
        </h2>

        <!-- Experience HUD Timeline -->
        <div style="display: flex; flex-direction: column; gap: var(--space-5);">
          ${this.experiences.map((exp, idx) => {
            const catClass = idx === 0 ? 'pill--rag-agentic' : 'pill--rag-agentic';

            return `
              <div class="glass-card exp-hud-card" style="
                border-left: 3px solid var(--cat-rag-agentic);
                display: flex;
                flex-direction: column;
                gap: var(--space-4);
              ">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem;">
                  <div>
                    <h3 style="
                      font-family: var(--font-display);
                      font-size: 1.35rem;
                      font-weight: 600;
                      color: var(--text-primary);
                      margin: 0 0 0.2rem 0;
                    ">
                      ${exp.title} &bull; ${exp.company}
                    </h3>
                    <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">
                      ${exp.location}
                    </div>
                  </div>

                  <div class="pill">
                    ${exp.duration}
                  </div>
                </div>

                <ul style="
                  list-style: none;
                  padding: 0;
                  margin: 0;
                  display: flex;
                  flex-direction: column;
                  gap: 0.55rem;
                  font-family: var(--font-body);
                  font-size: 0.95rem;
                  color: var(--text-secondary);
                  line-height: 1.55;
                ">
                  ${exp.highlights.map((bullet) => `
                    <li style="display: flex; align-items: flex-start; gap: 0.6rem;">
                      <span style="color: var(--cat-rag-agentic); font-family: var(--font-mono); font-size: 0.85rem;">&bull;</span>
                      <span>${bullet}</span>
                    </li>
                  `).join('')}
                </ul>

                <div style="display: flex; flex-wrap: wrap; gap: 0.45rem; padding-top: var(--space-3); border-top: 1px solid var(--line);">
                  ${(exp.tech || exp.technologies || []).map((tech) => `
                    <span class="pill pill--interactive">
                      ${tech}
                    </span>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    this.container.appendChild(this.element);
  }
}
