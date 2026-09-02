/**
 * Extras Section per PORTFOLIO_SITE_SPEC.md §8.
 * Calm data-driven layout: left-bordered hackathon rankings & plain-text certifications.
 */
export class ExtrasSection {
  constructor(container, portfolioData) {
    this.container = container;
    this.portfolio = portfolioData;
    this.hackathons = portfolioData.hackathons;
    this.certifications = portfolioData.certifications;

    this.render();
  }

  render() {
    this.element = document.createElement('section');
    this.element.id = 'extras-section';
    this.element.style.cssText = `
      position: relative;
      min-height: 80vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 6rem max(2rem, calc((100vw - 1280px) / 2));
      pointer-events: auto;
    `;

    this.element.innerHTML = `
      <div style="
        max-width: var(--content-max-width);
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 3rem;
      ">
        <div style="
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--cat-rag-agentic);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        ">
          <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--cat-rag-agentic);"></span>
          <span>06 &bull; Honors &amp; Certifications</span>
        </div>

        <!-- 1. Hackathons List (Left-Bordered) -->
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <h2 style="
            font-family: var(--font-display);
            font-size: clamp(1.8rem, 3.5vw, 2.4rem);
            font-weight: 700;
            color: var(--text-primary);
            margin: 0;
            letter-spacing: -0.02em;
          ">
            Competitive Hackathons &amp; Recognition
          </h2>

          <div style="
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
            padding-left: 1.25rem;
            border-left: 2px solid var(--line);
            margin-top: 0.5rem;
          ">
            ${this.hackathons.map((h) => {
              const isProminent = h.name.includes('Eureka') || h.name.includes('Goldman Sachs');
              return `
                <div style="display: flex; flex-direction: column; gap: 0.2rem;">
                  <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem;">
                    <span style="
                      font-family: var(--font-display);
                      font-size: ${isProminent ? '1.25rem' : '1.05rem'};
                      font-weight: ${isProminent ? '700' : '500'};
                      color: ${isProminent ? 'var(--glow)' : 'var(--text-primary)'};
                    ">
                      ${h.name}
                    </span>
                    <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary);">
                      ${h.year}
                    </span>
                  </div>
                  <div style="
                    font-family: var(--font-body);
                    font-size: ${isProminent ? '0.98rem' : '0.9rem'};
                    color: ${isProminent ? 'var(--text-primary)' : 'var(--text-secondary)'};
                  ">
                    ${h.detail}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 2. Certifications (Plain Text, 3 Lines, No Badges) -->
        <div style="
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-top: 2rem;
          border-top: 1px solid var(--line);
        ">
          <div style="
            font-family: var(--font-mono);
            font-size: 0.75rem;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          ">
            Verified Certifications
          </div>

          <div style="
            display: flex;
            flex-direction: column;
            gap: 0.65rem;
            font-family: var(--font-mono);
            font-size: 0.88rem;
            color: var(--text-primary);
            line-height: 1.5;
          ">
            ${this.certifications.map((c) => `
              <div style="display: flex; align-items: baseline; gap: 0.5rem; flex-wrap: wrap;">
                <span style="color: var(--cat-applied-ml);">&bull;</span>
                <span style="font-weight: 500;">${c.name}</span>
                <span style="color: var(--line);">/</span>
                <span style="color: var(--text-secondary);">${c.issuer}</span>
                <span style="color: var(--line);">/</span>
                <span style="color: var(--text-secondary); font-size: 0.8rem;">${c.year}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.container.appendChild(this.element);
  }
}
