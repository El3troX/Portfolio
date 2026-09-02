import { animate } from 'animejs';

/**
 * About Section per PORTFOLIO_SITE_SPEC.md §4.
 * First-person credibility text, plain IBM Plex Mono fact strip, and Anime.js letter-stagger headline.
 */
export class AboutSection {
  constructor(container, portfolioData) {
    this.container = container;
    this.portfolio = portfolioData;
    this.hasTriggeredReveal = false;
    this.element = null;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.render();
  }

  render() {
    this.element = document.createElement('section');
    this.element.id = 'about-section';
    this.element.style.cssText = `
      position: relative;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 6rem max(2rem, calc((100vw - 1280px) / 2));
      pointer-events: none;
    `;

    const headlineText = 'Engineering intelligent agents from retrieval layers to bare metal.';
    
    // Split into individual letter spans for Anime.js stagger
    const lettersHTML = headlineText.split('').map((char) => {
      const displayChar = char === ' ' ? '&nbsp;' : char;
      return `<span class="about-char" style="display: inline-block; opacity: 0; transform: translateY(12px);">${displayChar}</span>`;
    }).join('');

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
          color: var(--cat-fullstack);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        ">
          <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--cat-fullstack);"></span>
          <span>01 &bull; About &bull; Engineering Philosophy</span>
        </div>

        <h2 id="about-headline" style="
          font-family: var(--font-display);
          font-size: clamp(2.2rem, 4.5vw, 3.2rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.025em;
          color: var(--text-primary);
          margin: 0;
        ">
          ${lettersHTML}
        </h2>

        <p style="
          font-family: var(--font-body);
          font-size: 1.18rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin: 0;
          font-weight: 400;
        ">
          I build retrieval systems, stateful agentic workflows, and the scalable distributed backends required to run them in production. My work sits at the intersection of information retrieval, learning-to-rank algorithms, and multi-agent coordination — turning complex legal, financial, and operational corpuses into deterministic, high-precision tools.
        </p>

        <!-- Fact Strip in IBM Plex Mono per spec §4 (Plain data lines, not icon cards) -->
        <div style="
          margin-top: 1rem;
          padding-top: 1.75rem;
          border-top: 1px solid var(--line);
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          font-family: var(--font-mono);
          font-size: 0.9rem;
          line-height: 1.5;
        ">
          <div style="display: flex; align-items: baseline; gap: 0.75rem; flex-wrap: wrap;">
            <span style="color: var(--glow);">&bull;</span>
            <span style="color: var(--text-primary); font-weight: 500;">VIT Vellore</span>
            <span style="color: var(--line);">/</span>
            <span style="color: var(--text-secondary);">B.Tech in Computer Science &amp; Engineering (Data Science)</span>
            <span style="color: var(--line);">/</span>
            <span style="color: #22c55e; font-weight: 600;">9.09 CGPA</span>
          </div>

          <div style="display: flex; align-items: baseline; gap: 0.75rem; flex-wrap: wrap;">
            <span style="color: var(--glow);">&bull;</span>
            <span style="color: var(--text-primary); font-weight: 500;">Internships</span>
            <span style="color: var(--line);">/</span>
            <span style="color: var(--text-secondary);">Ernst &amp; Young (Kochi) &bull; Mahindra &amp; Mahindra (Mumbai)</span>
          </div>

          <div style="display: flex; align-items: baseline; gap: 0.75rem; flex-wrap: wrap;">
            <span style="color: var(--glow);">&bull;</span>
            <span style="color: var(--text-primary); font-weight: 500;">Systems Shipped</span>
            <span style="color: var(--line);">/</span>
            <span style="color: var(--text-secondary);">12 Shipped Projects across Legal RAG, AML Graphs, and FinTech</span>
          </div>

          <div style="display: flex; align-items: baseline; gap: 0.75rem; flex-wrap: wrap;">
            <span style="color: var(--glow);">&bull;</span>
            <span style="color: var(--text-primary); font-weight: 500;">Honors</span>
            <span style="color: var(--line);">/</span>
            <span style="color: var(--text-secondary);">Top 10% Goldman Sachs National Hackathon &bull; IIT Bombay Eureka Finalist</span>
          </div>
        </div>
      </div>
    `;

    this.container.appendChild(this.element);
  }

  triggerHeadlineReveal() {
    if (this.hasTriggeredReveal) return;
    this.hasTriggeredReveal = true;

    const chars = this.element.querySelectorAll('.about-char');
    if (!chars || chars.length === 0) return;

    if (this.reducedMotion) {
      chars.forEach((c) => {
        c.style.opacity = '1';
        c.style.transform = 'none';
      });
      return;
    }

    animate(chars, {
      opacity: [0, 1],
      translateY: [12, 0],
      delay: (el, i) => i * 14, // ~14ms per character
      duration: 350,
      ease: 'outQuart',
    });
  }
}
