/**
 * Custom Cursor per PORTFOLIO_SITE_SPEC.md §10.
 * Physics-based particle-trail cursor, active on desktop only,
 * gated off entirely on mobile & touch devices.
 */
export class CustomCursor {
  constructor() {
    // Disable on touch devices or small screens
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 960;
    if (this.isTouch) return;

    this.mouse = { x: -100, y: -100 };
    this.trail = [];
    this.trailLength = 7;

    for (let i = 0; i < this.trailLength; i++) {
      this.trail.push({ x: -100, y: -100, vx: 0, vy: 0 });
    }

    this.initCanvas();
    this.initListeners();
    this.loop();
  }

  initCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'custom-cursor-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: var(--z-cursor);
    `;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initListeners() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  loop() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Primary cursor dot
    this.ctx.fillStyle = '#e8e6ff';
    this.ctx.beginPath();
    this.ctx.arc(this.mouse.x, this.mouse.y, 2.5, 0, Math.PI * 2);
    this.ctx.fill();

    // Physics trailing dots
    let prevX = this.mouse.x;
    let prevY = this.mouse.y;

    for (let i = 0; i < this.trail.length; i++) {
      const p = this.trail[i];
      // Spring lerp to previous point
      p.x += (prevX - p.x) * 0.35;
      p.y += (prevY - p.y) * 0.35;

      const progress = 1 - i / this.trail.length;
      const radius = 2.0 * progress;
      const opacity = 0.45 * progress;

      this.ctx.fillStyle = `rgba(232, 230, 255, ${opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      this.ctx.fill();

      prevX = p.x;
      prevY = p.y;
    }

    requestAnimationFrame(() => this.loop());
  }
}
