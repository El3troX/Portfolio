/**
 * Skills Section per PORTFOLIO_SITE_SPEC.md §6.
 * Left-offset content column paired with the 3D SkillsCloud backdrop and dynamic project cross-reference HUD.
 */
export class SkillsSection {
  constructor(container, portfolioData) {
    this.container = container;
    this.portfolio = portfolioData;

    this.render();
  }

  render() {
    this.element = document.createElement('section');
    this.element.id = 'skills-section';
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
        gap: 2rem;
        pointer-events: auto;
      ">
        <div style="
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--cat-quant);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        ">
          <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--cat-quant);"></span>
          <span>03 &bull; Stack Graph &bull; Tooling Cloud</span>
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
          Core Arsenal &amp; Technical Graph
        </h2>

        <p style="
          font-family: var(--font-body);
          font-size: 1.15rem;
          line-height: 1.65;
          color: var(--text-secondary);
          margin: 0;
        ">
          Term cloud sized dynamically by stack occurrence across 12 production repositories. Hover over any technology to inspect connected architecture graphs and repository cross-references.
        </p>

        <!-- Live Cross-Reference HUD Card -->
        <div id="skills-crossref-hud" style="
          padding: 1.5rem 1.75rem;
          background: rgba(19, 19, 28, 0.75);
          backdrop-filter: blur(12px);
          border: 1px solid var(--line);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          min-height: 110px;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">
              Active Technology Cross-Reference
            </div>
            <div id="hud-skill-count" style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--glow);">
              Hover over 3D Cloud
            </div>
          </div>

          <div id="hud-skill-name" style="
            font-family: var(--font-display);
            font-size: 1.4rem;
            font-weight: 600;
            color: var(--text-primary);
          ">
            Interactive Stack Graph
          </div>

          <div id="hud-linked-projects" style="
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            font-family: var(--font-mono);
            font-size: 0.8rem;
            color: var(--text-secondary);
          ">
            <span>Hover or tap any floating 3D keyword to reveal connected project nodes.</span>
          </div>
        </div>
      </div>
    `;

    this.container.appendChild(this.element);
  }

  updateHUD(skillData) {
    const nameEl = document.getElementById('hud-skill-name');
    const countEl = document.getElementById('hud-skill-count');
    const listEl = document.getElementById('hud-linked-projects');

    if (!nameEl || !countEl || !listEl) return;

    if (!skillData) {
      nameEl.innerText = 'Interactive Stack Graph';
      nameEl.style.color = 'var(--text-primary)';
      countEl.innerText = 'Hover over 3D Cloud';
      listEl.innerHTML = `<span>Hover or tap any floating 3D keyword to reveal connected project nodes.</span>`;
      return;
    }

    nameEl.innerText = skillData.name;
    nameEl.style.color = '#e8e6ff';
    countEl.innerText = `Used across ${skillData.count} ${skillData.count === 1 ? 'project' : 'projects'}`;

    listEl.innerHTML = skillData.projects.map((p) => {
      const catColor = `var(--cat-${p.category})`;
      return `
        <a href="${p.repo}" target="_blank" rel="noopener noreferrer" style="
          text-decoration: none;
          padding: 0.35rem 0.75rem;
          background: rgba(35, 35, 48, 0.6);
          border: 1px solid var(--line);
          border-left: 2px solid ${catColor};
          border-radius: 4px;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: all 0.2s ease;
        ">
          <span>${p.name}</span>
          <span style="color: var(--text-secondary);">&rarr;</span>
        </a>
      `;
    }).join('');
  }
}
