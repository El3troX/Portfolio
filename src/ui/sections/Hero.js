/**
 * Hero Section DOM component per PORTFOLIO_SITE_SPEC §2.
 * Left-offset content column with Space Grotesk headline, human positioning copy, and minimal scroll cue.
 */
export class HeroSection {
  constructor(container) {
    this.container = container;
    this.element = null;
    this.render();
  }

  render() {
    this.element = document.createElement('section');
    this.element.id = 'hero-section';
    this.element.style.cssText = `
      position: relative;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 max(2rem, calc((100vw - 1280px) / 2));
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
        padding-top: 4rem;
        padding-bottom: 6rem;
      ">
        <div style="
          font-family: var(--font-mono);
          font-size: 0.85rem;
          color: var(--cat-rag-agentic);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        ">
          <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--cat-rag-agentic);"></span>
          <span>Neural Core &bull; RAG &amp; Agentic AI</span>
        </div>

        <h1 style="
          font-family: var(--font-display);
          font-size: clamp(3rem, 6.5vw, 4.75rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          margin: 0;
        ">
          Divyam Pandey
        </h1>

        <p style="
          font-family: var(--font-body);
          font-size: clamp(1.15rem, 2.2vw, 1.45rem);
          line-height: 1.55;
          color: var(--text-secondary);
          max-width: 580px;
          margin: 0;
          font-weight: 400;
        ">
          I build retrieval and agentic systems — and the full-stack platforms they live in.
        </p>
      </div>

      <!-- Minimalist Scroll Cue (Sliding Dot on Vertical Line) -->
      <div style="
        position: absolute;
        bottom: 2.5rem;
        left: max(2rem, calc((100vw - 1280px) / 2));
        width: 2px;
        height: 48px;
        background: var(--line);
        overflow: hidden;
        border-radius: 2px;
      ">
        <div class="scroll-dot" style="
          width: 2px;
          height: 14px;
          background: var(--glow);
          border-radius: 2px;
          animation: scrollSlide 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        "></div>
      </div>
    `;

    // Add keyframe animation for scroll dot if not exists
    if (!document.getElementById('scroll-dot-style')) {
      const style = document.createElement('style');
      style.id = 'scroll-dot-style';
      style.textContent = `
        @keyframes scrollSlide {
          0% { transform: translateY(-100%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(350%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    this.container.appendChild(this.element);
  }
}
