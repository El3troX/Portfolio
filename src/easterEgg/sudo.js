/**
 * Sudo Easter Egg per PORTFOLIO_SITE_SPEC.md §10.
 * Listens for typing "sudo" anywhere on the page.
 * Triggers a 2-second matrix code-rain / digital glitch overlay,
 * then cleanly restores the user's exact scroll position and scene state.
 */
export class SudoEasterEgg {
  constructor() {
    this.buffer = '';
    this.target = 'sudo';
    this.isActive = false;
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;

    this.initKeyListener();
  }

  initKeyListener() {
    window.addEventListener('keydown', (e) => {
      // Ignore if user is typing in form/input/textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      this.buffer += e.key.toLowerCase();
      if (this.buffer.length > 10) {
        this.buffer = this.buffer.slice(-10);
      }

      if (this.buffer.endsWith(this.target) && !this.isActive) {
        this.triggerMatrixGlitch();
      }
    });
  }

  triggerMatrixGlitch() {
    this.isActive = true;
    const currentScrollY = window.scrollY;

    // 1. Create fullscreen Glitch Canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'easter-egg-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      z-index: var(--z-easter-egg);
      pointer-events: none;
      background: rgba(10, 10, 15, 0.88);
      backdrop-filter: blur(8px);
      transition: opacity 0.4s ease;
    `;
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Matrix characters
    const chars = '01DIVYAM_PANDEY_NEURAL_CORE_RAG_AGENTIC_VALKYRIE_0123456789ABCDEF$#@%&*+-/\\';
    const fontSize = 14;
    const columns = Math.floor(this.canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    const startTime = performance.now();

    const drawMatrix = (currentTime) => {
      const elapsed = (currentTime - startTime) / 1000;

      // Semi-transparent background clear for trail effect
      this.ctx.fillStyle = 'rgba(10, 10, 15, 0.12)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.font = `${fontSize}px "IBM Plex Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        // Lead character bright green/white, trailing green
        const isLead = Math.random() > 0.85;
        this.ctx.fillStyle = isLead ? '#ffffff' : (Math.random() > 0.3 ? '#22c55e' : '#a855f7');

        this.ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > this.canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      // HUD Terminal Banner
      this.ctx.fillStyle = '#22c55e';
      this.ctx.font = '600 16px "IBM Plex Mono", monospace';
      this.ctx.fillText('ROOT ACCESS GRANTED // OVERRIDE SEQUENCE ACTIVE', 32, 48);

      if (elapsed < 2.0) {
        this.animationId = requestAnimationFrame(drawMatrix);
      } else {
        this.cleanup(currentScrollY);
      }
    };

    this.animationId = requestAnimationFrame(drawMatrix);
  }

  cleanup(originalScrollY) {
    if (this.animationId) cancelAnimationFrame(this.animationId);

    if (this.canvas) {
      this.canvas.style.opacity = '0';
      setTimeout(() => {
        if (this.canvas && this.canvas.parentNode) {
          this.canvas.parentNode.removeChild(this.canvas);
        }
        this.canvas = null;
        this.ctx = null;
        this.isActive = false;

        // Guarantee exact scroll position preservation
        window.scrollTo(0, originalScrollY);
      }, 400);
    } else {
      this.isActive = false;
      window.scrollTo(0, originalScrollY);
    }
  }
}
