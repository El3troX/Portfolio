/**
 * Real loading sequence tied to font & asset initialization.
 * Displays a percentage readout in IBM Plex Mono in the bottom-left corner per PORTFOLIO_SITE_SPEC §1.
 */
export class LoadingScreen {
  constructor() {
    this.progress = 0;
    this.targetProgress = 0;
    this.isComplete = false;
    this.container = null;
    this.percentElement = null;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.createDOM();
  }

  createDOM() {
    this.container = document.createElement('div');
    this.container.id = 'loading-screen';
    this.container.style.cssText = `
      position: fixed;
      inset: 0;
      background-color: var(--bg-void);
      z-index: 99999;
      pointer-events: auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 3rem;
      transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    this.container.innerHTML = `
      <div style="
        font-family: var(--font-mono);
        font-size: 0.95rem;
        color: var(--text-secondary);
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      ">
        <div style="color: var(--text-primary); font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase;">
          Neural Core &bull; System Assembly
        </div>
        <div style="font-size: 1.85rem; font-weight: 500; color: var(--glow);" id="loading-percentage">
          0%
        </div>
      </div>
    `;

    document.body.appendChild(this.container);
    this.percentElement = document.getElementById('loading-percentage');
  }

  setProgress(val) {
    this.targetProgress = Math.min(100, Math.max(0, val));
  }

  async trackLoad(tasksPromise, onFinish) {
    if (this.reducedMotion) {
      if (this.percentElement) this.percentElement.innerText = '100%';
      await tasksPromise;
      this.finish(onFinish);
      return;
    }

    // Smooth interpolation ticker
    let current = 0;
    const interval = setInterval(() => {
      current += (this.targetProgress - current) * 0.15;
      if (Math.abs(this.targetProgress - current) < 0.5) {
        current = this.targetProgress;
      }

      if (this.percentElement) {
        this.percentElement.innerText = `${Math.round(current)}%`;
      }

      if (current >= 99.5 && this.isComplete) {
        clearInterval(interval);
        if (this.percentElement) this.percentElement.innerText = '100%';
        this.finish(onFinish);
      }
    }, 16);

    try {
      this.setProgress(25);
      // Wait for fonts
      if (document.fonts) {
        await document.fonts.ready;
      }
      this.setProgress(60);

      // Execute caller load tasks
      await tasksPromise;
      this.setProgress(100);
      this.isComplete = true;
    } catch (err) {
      console.error('[LoadingScreen] Asset loading failed:', err);
      this.setProgress(100);
      this.isComplete = true;
    }
  }

  finish(onFinish) {
    setTimeout(() => {
      if (this.container) {
        this.container.style.opacity = '0';
        setTimeout(() => {
          if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
          }
          if (typeof onFinish === 'function') onFinish();
        }, 600);
      } else {
        if (typeof onFinish === 'function') onFinish();
      }
    }, 200);
  }
}
