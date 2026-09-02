/**
 * ProjectsStrip Section - Scroll-snapped horizontal strip for standard/light projects.
 * Driven 100% strictly from portfolio.json.
 * If metrics array has entries, renders label + value.
 * If metrics is empty, falls back to the concrete architecture[0] detail.
 * Per PORTFOLIO_SITE_SPEC.md §7b & PROJECT_PLAN.md Phase 5.
 */
export class ProjectsStripSection {
  constructor(container, portfolioData, lightTemplateScene) {
    this.container = container;
    this.portfolio = portfolioData;
    this.lightTemplateScene = lightTemplateScene;
    this.standardProjects = portfolioData.projects.filter((p) => p.tier !== 'flagship');

    this.render();
  }

  render() {
    this.element = document.createElement('section');
    this.element.id = 'projects-standard-strip';
    this.element.style.cssText = `
      position: relative;
      min-height: 90vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 5rem 0 5rem max(2rem, calc((100vw - 1280px) / 2));
      overflow: hidden;
      pointer-events: none;
    `;

    this.element.innerHTML = `
      <div style="
        max-width: var(--content-max-width);
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        pointer-events: auto;
        margin-bottom: 2rem;
        padding-right: 2rem;
      ">
        <div style="
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--cat-fullstack);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        ">
          <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--cat-fullstack);"></span>
          <span>05 &bull; Systems Archive &bull; Standard Strip</span>
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
          Production &amp; Applied Systems
        </h2>

        <p style="
          font-family: var(--font-body);
          font-size: 1.1rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0;
        ">
          Scroll horizontally through specialized systems spanning quantitative finance, algorithmic optimization, full-stack platforms, and computer vision.
        </p>
      </div>

      <!-- Horizontal Scroll Strip -->
      <div id="standard-strip-scroll" style="
        display: flex;
        gap: 1.5rem;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        padding-bottom: 2rem;
        padding-right: max(2rem, calc((100vw - 1280px) / 2));
        pointer-events: auto;
        scrollbar-width: thin;
        scrollbar-color: var(--line) transparent;
      ">
        ${this.standardProjects.map((proj, idx) => {
          const catConfig = this.portfolio.categories[proj.category];
          const catColor = catConfig ? catConfig.color : '#3b82f6';
          
          // Strict data-driven metric vs architecture fallback
          let highlightLabel = '';
          let highlightText = '';

          if (proj.metrics && Array.isArray(proj.metrics) && proj.metrics.length > 0) {
            highlightLabel = proj.metrics[0].label;
            highlightText = `${proj.metrics[0].value}`;
            if (proj.metrics[0].detail) {
              highlightText += ` — ${proj.metrics[0].detail}`;
            }
          } else if (proj.architecture && Array.isArray(proj.architecture) && proj.architecture.length > 0) {
            highlightLabel = 'Architecture Highlight';
            highlightText = proj.architecture[0];
          } else {
            highlightLabel = 'Overview';
            highlightText = proj.subtitle;
          }

          return `
            <div class="standard-project-card" data-index="${idx}" style="
              flex: 0 0 380px;
              max-width: 380px;
              scroll-snap-align: start;
              padding: 1.6rem 1.8rem;
              background: rgba(19, 19, 28, 0.85);
              backdrop-filter: blur(14px);
              border: 1px solid var(--line);
              border-top: 3px solid ${catColor};
              border-radius: 8px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              gap: 1.25rem;
              transition: transform 0.25s ease, border-color 0.25s ease;
            ">
              <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="
                    font-family: var(--font-mono);
                    font-size: 0.72rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: ${catColor};
                  ">
                    ${catConfig ? catConfig.label : proj.category}
                  </span>

                  <a href="${proj.repo}" target="_blank" rel="noopener noreferrer" style="
                    font-family: var(--font-mono);
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    text-decoration: none;
                    transition: color 0.2s ease;
                  " onmouseover="this.style.color='var(--text-primary)'" onmouseout="this.style.color='var(--text-secondary)'">
                    GitHub &rarr;
                  </a>
                </div>

                <div>
                  <h3 style="
                    font-family: var(--font-display);
                    font-size: 1.45rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin: 0 0 0.35rem 0;
                    letter-spacing: -0.015em;
                  ">
                    ${proj.name}
                  </h3>
                  <p style="
                    font-family: var(--font-body);
                    font-size: 0.95rem;
                    line-height: 1.5;
                    color: var(--text-secondary);
                    margin: 0;
                  ">
                    ${proj.problem}
                  </p>
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <!-- Concrete Metric / Architecture Fallback Badge -->
                <div style="
                  padding: 0.75rem 1rem;
                  background: rgba(35, 35, 48, 0.45);
                  border: 1px solid var(--line);
                  border-radius: 6px;
                ">
                  <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 0.2rem;">
                    ${highlightLabel}
                  </div>
                  <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 500; color: var(--glow); line-height: 1.4;">
                    ${highlightText}
                  </div>
                </div>

                <!-- Tech Stack Pills -->
                <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
                  ${proj.stack.map((t) => `
                    <span style="
                      font-family: var(--font-mono);
                      font-size: 0.72rem;
                      padding: 0.2rem 0.55rem;
                      background: rgba(35, 35, 48, 0.5);
                      border: 1px solid var(--line);
                      border-radius: 4px;
                      color: var(--text-primary);
                    ">${t}</span>
                  `).join('')}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    this.container.appendChild(this.element);

    // Hover listener to update 3D template color dynamically
    const cards = this.element.querySelectorAll('.standard-project-card');
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        const idx = parseInt(card.getAttribute('data-index'), 10);
        const proj = this.standardProjects[idx];
        if (proj && this.lightTemplateScene) {
          const catConfig = this.portfolio.categories[proj.category];
          this.lightTemplateScene.setProject(proj, catConfig);
        }
      });
    });
  }
}
