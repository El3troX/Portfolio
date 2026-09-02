/**
 * Skills Section per PORTFOLIO_SITE_SPEC.md §6 and Phase 8 interactive requirements.
 * Left-offset content column paired with the 3D SkillsCloud backdrop,
 * interactive 2D skill chips with full keyboard/touch accessibility, category filtering,
 * and dynamic project cross-reference HUD.
 */
export class SkillsSection {
  constructor(container, portfolioData, skillsCloud = null) {
    this.container = container;
    this.portfolio = portfolioData;
    this.skillsCloud = skillsCloud;

    this.activeCategory = 'ALL';
    this.activeSkill = null;

    this.computeSkills();
    this.render();
    this.initEvents();
  }

  computeSkills() {
    this.skillMap = {};
    this.portfolio.projects.forEach((proj) => {
      proj.stack.forEach((tool) => {
        if (!this.skillMap[tool]) {
          this.skillMap[tool] = {
            name: tool,
            count: 0,
            projects: [],
            categories: new Set(),
          };
        }
        this.skillMap[tool].count++;
        this.skillMap[tool].projects.push(proj);
        this.skillMap[tool].categories.add(proj.category);
      });
    });

    this.sortedSkills = Object.values(this.skillMap).sort((a, b) => b.count - a.count);
  }

  render() {
    this.element = document.createElement('section');
    this.element.id = 'skills-section';
    this.element.style.cssText = `
      position: relative;
      min-height: 115vh;
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
        gap: var(--space-5);
        pointer-events: auto;
      ">
        <div class="pill pill--quant">
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
          Term cloud sized dynamically by stack occurrence across 12 production repositories. Filter categories or select any skill to inspect connected architectures and 3D dependency lines.
        </p>

        <!-- Category Filter Bar -->
        <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;" role="group" aria-label="Skills Category Filter">
          <button type="button" class="nav-btn skill-cat-btn active" data-cat="ALL">
            <span>All Technologies (${this.sortedSkills.length})</span>
          </button>
          <button type="button" class="nav-btn skill-cat-btn" data-cat="rag-agentic">
            <span style="color: var(--cat-rag-agentic);">&bull;</span>
            <span>RAG &amp; Agents</span>
          </button>
          <button type="button" class="nav-btn skill-cat-btn" data-cat="quant">
            <span style="color: var(--cat-quant);">&bull;</span>
            <span>Quant &amp; Data</span>
          </button>
          <button type="button" class="nav-btn skill-cat-btn" data-cat="fullstack">
            <span style="color: var(--cat-fullstack);">&bull;</span>
            <span>Full-Stack &amp; Systems</span>
          </button>
        </div>

        <!-- 2D Interactive Skill Chips Grid with Keyboard / Touch Access -->
        <div id="skills-chips-container" style="
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          max-height: 240px;
          overflow-y: auto;
          padding: 0.75rem;
          background: rgba(19, 19, 28, 0.4);
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
        ">
          ${this.sortedSkills.map((s) => {
            const isHeavy = s.count >= 3;
            return `
              <button
                type="button"
                class="pill pill--interactive skill-chip"
                data-skill="${s.name}"
                data-categories="${Array.from(s.categories).join(',')}"
                tabindex="0"
                aria-label="${s.name}, used in ${s.count} ${s.count === 1 ? 'project' : 'projects'}"
                style="border-color: ${isHeavy ? 'rgba(232, 230, 255, 0.3)' : 'var(--line)'};"
              >
                <span>${s.name}</span>
                <span style="opacity: 0.6; font-size: 0.72rem; padding: 0 0.25rem; border-radius: 2px; background: rgba(255,255,255,0.08);">${s.count}</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Live Cross-Reference HUD Card -->
        <div id="skills-crossref-hud" class="glass-card" style="
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
              Hover or Select Skill Chip
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
            <span>Hover or tap any keyword above or in the 3D cloud to reveal connected repositories.</span>
          </div>
        </div>
      </div>
    `;

    this.container.appendChild(this.element);
  }

  initEvents() {
    // 1. Category Filter Buttons
    const catBtns = this.element.querySelectorAll('.skill-cat-btn');
    catBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        catBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.getAttribute('data-cat');
        this.activeCategory = cat;
        this.filterCategory(cat);
      });
    });

    // 2. 2D Skill Chips Hover, Click & Keyboard handlers
    const chips = this.element.querySelectorAll('.skill-chip');
    chips.forEach((chip) => {
      const skillName = chip.getAttribute('data-skill');
      const skillData = this.skillMap[skillName];

      const onActivate = () => {
        chips.forEach((c) => c.classList.remove('pill--active'));
        chip.classList.add('pill--active');
        this.activeSkill = skillName;

        // Trigger 3D cloud highlight
        if (this.skillsCloud && this.skillsCloud.skillNodes) {
          const matchingSprite = this.skillsCloud.skillNodes.find(
            (s) => s.userData.skill.name.toLowerCase() === skillName.toLowerCase()
          );
          if (matchingSprite) {
            this.skillsCloud.highlightSkill(matchingSprite);
          }
        }

        this.updateHUD(skillData);
      };

      const onDeactivate = () => {
        if (this.activeSkill === skillName) return; // Keep selected if clicked
        if (this.skillsCloud) {
          this.skillsCloud.highlightSkill(null);
        }
      };

      chip.addEventListener('mouseenter', onActivate);
      chip.addEventListener('mouseleave', onDeactivate);
      chip.addEventListener('click', onActivate);

      // Keyboard Accessibility (Enter/Space & Focus/Blur)
      chip.addEventListener('focus', onActivate);
      chip.addEventListener('blur', onDeactivate);
      chip.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate();
        }
      });
    });
  }

  filterCategory(category) {
    const chips = this.element.querySelectorAll('.skill-chip');
    chips.forEach((chip) => {
      const cats = (chip.getAttribute('data-categories') || '').split(',');
      const matches = category === 'ALL' || cats.includes(category);
      chip.style.display = matches ? 'inline-flex' : 'none';
    });

    // Dim non-matching nodes in 3D SkillsCloud
    if (this.skillsCloud && this.skillsCloud.skillNodes) {
      this.skillsCloud.skillNodes.forEach((s) => {
        const projCats = s.userData.skill.projects.map((p) => p.category);
        const matches = category === 'ALL' || projCats.includes(category);
        s.userData.material.opacity = matches ? 0.85 : 0.12;
      });
    }
  }

  updateHUD(skillData) {
    const nameEl = document.getElementById('hud-skill-name');
    const countEl = document.getElementById('hud-skill-count');
    const listEl = document.getElementById('hud-linked-projects');

    if (!nameEl || !countEl || !listEl) return;

    if (!skillData) {
      nameEl.innerText = 'Interactive Stack Graph';
      nameEl.style.color = 'var(--text-primary)';
      countEl.innerText = 'Hover or Select Skill Chip';
      listEl.innerHTML = `<span>Hover or tap any keyword above or in the 3D cloud to reveal connected repositories.</span>`;
      return;
    }

    nameEl.innerText = skillData.name;
    nameEl.style.color = 'var(--glow)';
    countEl.innerText = `Used across ${skillData.count} ${skillData.count === 1 ? 'production system' : 'production systems'}`;

    listEl.innerHTML = skillData.projects.map((p) => {
      const catClass = `pill--${p.category}`;
      return `
        <a href="${p.repo}" target="_blank" rel="noopener noreferrer" class="pill pill--interactive ${catClass}">
          <span>${p.name}</span>
          <span style="opacity: 0.6;">&rarr;</span>
        </a>
      `;
    }).join('');
  }
}
