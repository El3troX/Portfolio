import { useEffect, useRef } from 'react';
import netherPortalImg from '../assets/nether_portal.png';
import './NetherPortal.css';

export default function NetherPortal({ isWarping = false, className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth || 300);
    let height = (canvas.height = canvas.offsetHeight || 300);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 300;
      height = canvas.height = canvas.offsetHeight || 300;
      ctx.imageSmoothingEnabled = false;
    };

    window.addEventListener('resize', handleResize);

    // Load official Minecraft Nether Portal sprite sheet
    const portalSprite = new Image();
    portalSprite.src = netherPortalImg;
    let spriteLoaded = false;
    portalSprite.onload = () => {
      spriteLoaded = true;
    };

    // Ascending Minecraft Portal Particles (purple pixel squares)
    const particles = [];
    const particleCount = isWarping ? 70 : 30;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.floor(Math.random() * 3 + 2) * 2, // integer pixel size
        speedY: -(Math.random() * 1.8 + 0.8),
        speedX: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        color: ['#bd34eb', '#a832d4', '#e056fd', '#7d12ff', '#ffffff'][Math.floor(Math.random() * 5)],
      });
    }

    let frameIndex = 0;
    let lastFrameTime = 0;
    const frameInterval = isWarping ? 45 : 70; // ms per frame

    const render = (now) => {
      if (now - lastFrameTime > frameInterval) {
        frameIndex = (frameIndex + 1) % 32; // 32 frames in official nether_portal.png
        lastFrameTime = now;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw tiled official Nether Portal texture
      if (spriteLoaded && portalSprite.width > 0) {
        const frameHeight = portalSprite.width; // 16px square frame
        const frameY = frameIndex * frameHeight;
        const tileSize = isWarping ? 64 : 48; // Scaled pixelated tiles

        for (let x = 0; x < width; x += tileSize) {
          for (let y = 0; y < height; y += tileSize) {
            ctx.drawImage(
              portalSprite,
              0,
              frameY,
              portalSprite.width,
              frameHeight,
              x,
              y,
              tileSize,
              tileSize
            );
          }
        }

        // Purple overlay tint
        ctx.fillStyle = isWarping
          ? 'rgba(92, 10, 150, 0.25)'
          : 'rgba(50, 5, 80, 0.35)';
        ctx.fillRect(0, 0, width, height);
      } else {
        // Fallback gradient while loading
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#2a0845');
        bgGrad.addColorStop(0.5, '#4a0e68');
        bgGrad.addColorStop(1, '#1b002c');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Render Ascending Minecraft Portal Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.y += p.speedY * (isWarping ? 2.5 : 1);
        p.x += p.speedX;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      }
      ctx.globalAlpha = 1.0;

      // 3. Obsidian Edge Vignette
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.1,
        width / 2,
        height / 2,
        width * 0.75
      );
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(8, 2, 14, 0.75)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isWarping]);

  return <canvas ref={canvasRef} className={`nether-portal-canvas ${className}`} aria-hidden="true" />;
}
