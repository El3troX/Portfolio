import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, X, RotateCcw } from 'lucide-react';
import './BossBattle.css';

/* =========================================================================
   SYNTHESIZED SOUND SYSTEM (Web Audio API — 100% Offline & Reliable)
   ========================================================================= */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playArrowShoot() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {}
  }

  playBossHit() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.16);

      gain.gain.setValueAtTime(0.45, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {}
  }

  playLaserCharge() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(950, this.ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.8);
    } catch {}
  }

  playLaserFire() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.65);

      gain.gain.setValueAtTime(0.55, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.65);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.65);
    } catch {}
  }

  playPlayerHit() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {}
  }

  playRoar() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 0.35);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.45, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.8);
    } catch {}
  }

  playVictory() {
    if (this.muted || !this.ctx) return;
    try {
      [320, 420, 540, 780, 960].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const time = this.ctx.currentTime + i * 0.12;

        gain.gain.setValueAtTime(0.35, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + 0.4);
      });
    } catch {}
  }
}

const sounds = new SoundEngine();

/* =========================================================================
   BOSS BATTLE COMPONENT
   ========================================================================= */
export default function BossBattle({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const [bossHp, setBossHp] = useState(10);
  const [playerHp, setPlayerHp] = useState(5);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost'
  const [isReloading, setIsReloading] = useState(false);
  const [muted, setMuted] = useState(false);
  const [playerHitFlash, setPlayerHitFlash] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  // Bow Cursor position for DOM overlay
  const [bowPos, setBowPos] = useState({ x: -100, y: -100, angle: 0 });

  // Refs for animation loop
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight - 150 });
  const isMouseDownRef = useRef(false);
  const lastShotTimeRef = useRef(0);
  const ARROW_COOLDOWN = 650; // exactly 0.65s delay
  const fireArrowRef = useRef(null);

  const toggleMute = () => {
    sounds.muted = !muted;
    setMuted(!muted);
  };

  const handleRestart = useCallback(() => {
    setBossHp(10);
    setPlayerHp(5);
    setGameState('playing');
    setIsReloading(false);
    lastShotTimeRef.current = 0;
    setGameKey((k) => k + 1);
    sounds.init();
    sounds.playRoar();
  }, []);

  // Manage body class to hide standard pickaxe/sword cursor
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('boss-battle-active');
      document.body.style.overflow = 'hidden';
      sounds.init();
      sounds.playRoar();
    } else {
      document.body.classList.remove('boss-battle-active');
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.classList.remove('boss-battle-active');
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Main Canvas & Simulation Loop
  useEffect(() => {
    if (!isOpen) return;

    setBossHp(10);
    setPlayerHp(5);
    setGameState('playing');
    setIsReloading(false);
    lastShotTimeRef.current = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Gameplay states
    let currentBossHp = 10;
    let currentPlayerHp = 5;
    let playerInvulnerableUntil = 0;
    let screenShake = 0;

    const boss = {
      x: width / 2,
      y: height * 0.28,
      baseY: height * 0.28,
      radius: 85,
      hitFlash: 0,
      angle: 0,
      state: 'hovering', // 'hovering', 'charging', 'laser_charging', 'laser_firing', 'returning'
      stateTimer: 0,
      laserAngle: 0,
      laserLength: 2200,
      chargeTarget: { x: 0, y: 0 },
      chargeProgress: 0,
      attackCooldown: 1.8,
      tentaclePhase: 0,
    };

    const arrows = [];
    const bossProjectiles = [];
    const particles = [];
    const damageTexts = [];
    const riftStars = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.8,
      color: ['#ba68c8', '#00e5ff', '#ff2d6b', '#b8ff00'][Math.floor(Math.random() * 4)],
      speed: Math.random() * 0.7 + 0.3,
    }));

    // ==========================================
    // SHOOT SPECTRAL ARROW
    // ==========================================
    const fireArrow = () => {
      const now = performance.now();
      if (now - lastShotTimeRef.current < ARROW_COOLDOWN) return;
      if (currentBossHp <= 0 || currentPlayerHp <= 0) return;

      lastShotTimeRef.current = now;
      setIsReloading(true);
      setTimeout(() => setIsReloading(false), ARROW_COOLDOWN);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Angle from bow towards Boss
      const dx = boss.x - mx;
      const dy = boss.y - my;
      const angle = Math.atan2(dy, dx);
      const speed = 20;

      arrows.push({
        x: mx,
        y: my,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angle,
        life: 0,
      });

      sounds.playArrowShoot();

      // Launch muzzle burst particles
      for (let i = 0; i < 10; i++) {
        particles.push({
          x: mx,
          y: my,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          color: '#b8ff00',
          size: Math.random() * 5 + 2,
          life: 1,
          decay: 0.06,
        });
      }
    };

    fireArrowRef.current = fireArrow;

    // Listeners
    const onMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      const angle = Math.atan2(boss.y - e.clientY, boss.x - e.clientX);
      setBowPos({ x: e.clientX, y: e.clientY, angle: (angle * 180) / Math.PI });
    };

    const onMouseDown = (e) => {
      if (e.target && e.target.closest('button')) return;
      isMouseDownRef.current = true;
      fireArrow();
    };

    const onMouseUp = () => {
      isMouseDownRef.current = false;
    };

    const onKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        fireArrow();
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('keydown', onKeyDown);

    // ==========================================
    // RAF LOOP
    // ==========================================
    let lastTime = performance.now();

    const loop = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (isMouseDownRef.current) {
        fireArrow();
      }

      ctx.save();
      if (screenShake > 0) {
        const sx = (Math.random() - 0.5) * screenShake;
        const sy = (Math.random() - 0.5) * screenShake;
        ctx.translate(sx, sy);
        screenShake = Math.max(0, screenShake - dt * 25);
      }

      // Background
      ctx.fillStyle = '#04010a';
      ctx.fillRect(0, 0, width, height);

      // Stars
      riftStars.forEach((star) => {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
        ctx.fillStyle = star.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Boss AI
      if (currentBossHp > 0) {
        boss.tentaclePhase += dt * 4;
        boss.hitFlash = Math.max(0, boss.hitFlash - dt * 5);

        if (boss.state === 'hovering') {
          boss.angle += dt * 1.5;
          boss.x += (Math.sin(boss.angle) * 180 + width / 2 - boss.x) * dt * 2;
          boss.y += (Math.cos(boss.angle * 1.3) * 45 + boss.baseY - boss.y) * dt * 2;

          boss.attackCooldown -= dt;
          if (boss.attackCooldown <= 0) {
            const rand = Math.random();
            if (rand < 0.35) {
              boss.state = 'laser_charging';
              boss.stateTimer = 1.0;
              sounds.playLaserCharge();
            } else if (rand < 0.68) {
              boss.state = 'charging';
              boss.chargeTarget = { x: mouseRef.current.x, y: mouseRef.current.y };
              boss.chargeProgress = 0;
              sounds.playRoar();
            } else {
              const count = currentBossHp <= 5 ? 5 : 3;
              for (let i = 0; i < count; i++) {
                const spreadAngle = (i - (count - 1) / 2) * 0.35;
                const angleToPlayer =
                  Math.atan2(mouseRef.current.y - boss.y, mouseRef.current.x - boss.x) + spreadAngle;

                bossProjectiles.push({
                  x: boss.x,
                  y: boss.y + 40,
                  vx: Math.cos(angleToPlayer) * 7.5,
                  vy: Math.sin(angleToPlayer) * 7.5,
                  radius: 13,
                  color: '#00e5ff',
                  glow: '#ff2d6b',
                });
              }
              boss.attackCooldown = 2.0;
            }
          }
        } else if (boss.state === 'laser_charging') {
          boss.laserAngle = Math.atan2(mouseRef.current.y - boss.y, mouseRef.current.x - boss.x);
          boss.stateTimer -= dt;
          if (boss.stateTimer <= 0) {
            boss.state = 'laser_firing';
            boss.stateTimer = 0.7;
            screenShake = 14;
            sounds.playLaserFire();
          }
        } else if (boss.state === 'laser_firing') {
          boss.stateTimer -= dt;
          screenShake = 8;
          if (boss.stateTimer <= 0) {
            boss.state = 'hovering';
            boss.attackCooldown = 2.2;
          }
        } else if (boss.state === 'charging') {
          boss.chargeProgress += dt * 2.8;
          boss.x += (boss.chargeTarget.x - boss.x) * dt * 8;
          boss.y += (boss.chargeTarget.y - boss.y) * dt * 8;

          particles.push({
            x: boss.x + (Math.random() - 0.5) * 60,
            y: boss.y + (Math.random() - 0.5) * 60,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            color: '#ff2d6b',
            size: Math.random() * 8 + 4,
            life: 1,
            decay: 0.04,
          });

          if (boss.chargeProgress >= 1.0) {
            boss.state = 'returning';
          }
        } else if (boss.state === 'returning') {
          boss.x += (width / 2 - boss.x) * dt * 3;
          boss.y += (boss.baseY - boss.y) * dt * 3;
          if (Math.abs(boss.y - boss.baseY) < 25) {
            boss.state = 'hovering';
            boss.attackCooldown = 1.8;
          }
        }
      }

      // Laser Beam Drawing
      if (boss.state === 'laser_charging') {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 45, 107, 0.75)';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff2d6b';
        ctx.beginPath();
        ctx.moveTo(boss.x, boss.y);
        ctx.lineTo(
          boss.x + Math.cos(boss.laserAngle) * boss.laserLength,
          boss.y + Math.sin(boss.laserAngle) * boss.laserLength
        );
        ctx.stroke();
        ctx.restore();
      } else if (boss.state === 'laser_firing') {
        ctx.save();
        const endX = boss.x + Math.cos(boss.laserAngle) * boss.laserLength;
        const endY = boss.y + Math.sin(boss.laserAngle) * boss.laserLength;

        ctx.strokeStyle = 'rgba(255, 45, 107, 0.4)';
        ctx.lineWidth = 80;
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#ff2d6b';
        ctx.beginPath();
        ctx.moveTo(boss.x, boss.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 35;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00e5ff';
        ctx.beginPath();
        ctx.moveTo(boss.x, boss.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(boss.x, boss.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();

        // Laser collision with Player
        const playerX = mouseRef.current.x;
        const playerY = mouseRef.current.y;
        const A = playerX - boss.x;
        const B = playerY - boss.y;
        const C = endX - boss.x;
        const D = endY - boss.y;
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        const param = lenSq !== 0 ? dot / lenSq : -1;
        let xx, yy;
        if (param < 0) {
          xx = boss.x;
          yy = boss.y;
        } else if (param > 1) {
          xx = endX;
          yy = endY;
        } else {
          xx = boss.x + param * C;
          yy = boss.y + param * D;
        }

        const dist = Math.hypot(playerX - xx, playerY - yy);
        if (dist < 45 && time > playerInvulnerableUntil && currentPlayerHp > 0) {
          currentPlayerHp -= 1;
          setPlayerHp(currentPlayerHp);
          playerInvulnerableUntil = time + 1200;
          setPlayerHitFlash(true);
          setTimeout(() => setPlayerHitFlash(false), 300);
          screenShake = 18;
          sounds.playPlayerHit();
          if (currentPlayerHp <= 0) setGameState('lost');
        }
      }

      // Draw Elden Boss
      if (currentBossHp > 0) {
        ctx.save();
        ctx.translate(boss.x, boss.y);

        if (boss.hitFlash > 0) {
          ctx.filter = 'brightness(2.5) saturate(2)';
        }

        const isEnraged = currentBossHp <= 5;
        const bodyColor = isEnraged ? '#ff2d6b' : '#00e5ff';
        const shadowColor = isEnraged ? 'rgba(255, 45, 107, 0.9)' : 'rgba(168, 85, 247, 0.8)';

        ctx.shadowBlur = isEnraged ? 45 : 30;
        ctx.shadowColor = shadowColor;

        // Tendrils
        for (let i = -3; i <= 3; i++) {
          if (i === 0) continue;
          ctx.save();
          ctx.strokeStyle = isEnraged ? 'rgba(255, 45, 107, 0.6)' : 'rgba(168, 85, 247, 0.5)';
          ctx.lineWidth = 10;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(i * 18, 20);
          const wave = Math.sin(boss.tentaclePhase + i) * 35;
          ctx.quadraticCurveTo(
            i * 50 + wave,
            70 + Math.abs(i) * 15,
            i * 70 + wave * 1.5,
            120 + Math.abs(i) * 20
          );
          ctx.stroke();
          ctx.restore();
        }

        // Body
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.arc(0, 0, 65, Math.PI, 0, false);
        ctx.lineTo(65, 80);
        ctx.lineTo(45, 60);
        ctx.lineTo(25, 80);
        ctx.lineTo(0, 55);
        ctx.lineTo(-25, 80);
        ctx.lineTo(-45, 60);
        ctx.lineTo(-65, 80);
        ctx.closePath();
        ctx.fill();

        // Core
        ctx.fillStyle = isEnraged ? '#ffe500' : '#d946ef';
        ctx.beginPath();
        ctx.arc(0, 20, 16 + Math.sin(boss.tentaclePhase * 2) * 4, 0, Math.PI * 2);
        ctx.fill();

        // Crown
        ctx.fillStyle = '#ffe500';
        ctx.beginPath();
        ctx.moveTo(-45, -55);
        ctx.lineTo(-55, -95);
        ctx.lineTo(-25, -75);
        ctx.lineTo(0, -105);
        ctx.lineTo(25, -75);
        ctx.lineTo(55, -95);
        ctx.lineTo(45, -55);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ff2d6b';
        ctx.beginPath();
        ctx.arc(-55, -95, 6, 0, Math.PI * 2);
        ctx.arc(0, -105, 7, 0, Math.PI * 2);
        ctx.arc(55, -95, 6, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        const angleToMouse = Math.atan2(mouseRef.current.y - boss.y, mouseRef.current.x - boss.x);
        const pupilX = Math.cos(angleToMouse) * 8;
        const pupilY = Math.sin(angleToMouse) * 8;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(-26, -10, 15, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = isEnraged ? '#ff2d6b' : '#0a0a0a';
        ctx.beginPath();
        ctx.arc(-26 + pupilX, -10 + pupilY, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(26, -10, 15, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = isEnraged ? '#ff2d6b' : '#0a0a0a';
        ctx.beginPath();
        ctx.arc(26 + pupilX, -10 + pupilY, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Boss Charge Collision
        if (boss.state === 'charging') {
          const distToPlayer = Math.hypot(boss.x - mouseRef.current.x, boss.y - mouseRef.current.y);
          if (distToPlayer < 75 && time > playerInvulnerableUntil && currentPlayerHp > 0) {
            currentPlayerHp -= 1;
            setPlayerHp(currentPlayerHp);
            playerInvulnerableUntil = time + 1200;
            setPlayerHitFlash(true);
            setTimeout(() => setPlayerHitFlash(false), 300);
            screenShake = 20;
            sounds.playPlayerHit();
            if (currentPlayerHp <= 0) setGameState('lost');
          }
        }
      }

      // Boss Projectiles
      for (let i = bossProjectiles.length - 1; i >= 0; i--) {
        const p = bossProjectiles[i];
        p.x += p.vx;
        p.y += p.vy;

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        const dist = Math.hypot(p.x - mouseRef.current.x, p.y - mouseRef.current.y);
        if (dist < 32) {
          bossProjectiles.splice(i, 1);
          if (time > playerInvulnerableUntil && currentPlayerHp > 0) {
            currentPlayerHp -= 1;
            setPlayerHp(currentPlayerHp);
            playerInvulnerableUntil = time + 1200;
            setPlayerHitFlash(true);
            setTimeout(() => setPlayerHitFlash(false), 300);
            screenShake = 12;
            sounds.playPlayerHit();
            if (currentPlayerHp <= 0) setGameState('lost');
          }
          continue;
        }

        if (p.x < -50 || p.x > width + 50 || p.y < -50 || p.y > height + 50) {
          bossProjectiles.splice(i, 1);
        }
      }

      // Arrows
      for (let i = arrows.length - 1; i >= 0; i--) {
        const arrow = arrows[i];
        arrow.x += arrow.vx;
        arrow.y += arrow.vy;
        arrow.life += dt;

        particles.push({
          x: arrow.x,
          y: arrow.y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          color: '#b8ff00',
          size: Math.random() * 4 + 1.5,
          life: 1,
          decay: 0.08,
        });

        ctx.save();
        ctx.translate(arrow.x, arrow.y);
        ctx.rotate(arrow.angle);

        ctx.strokeStyle = '#d4ff4d';
        ctx.lineWidth = 4;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#b8ff00';

        ctx.beginPath();
        ctx.moveTo(-24, 0);
        ctx.lineTo(18, 0);
        ctx.stroke();

        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.moveTo(18, 0);
        ctx.lineTo(9, -6);
        ctx.lineTo(9, 6);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#ff2d6b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-24, 0);
        ctx.lineTo(-32, -6);
        ctx.moveTo(-24, 0);
        ctx.lineTo(-32, 6);
        ctx.stroke();

        ctx.restore();

        // Hit Detection with Boss
        if (currentBossHp > 0) {
          const hitDist = Math.hypot(arrow.x - boss.x, arrow.y - boss.y);
          if (hitDist < boss.radius + 15) {
            arrows.splice(i, 1);
            currentBossHp -= 1;
            setBossHp(currentBossHp);
            boss.hitFlash = 1.0;
            screenShake = 10;
            sounds.playBossHit();

            for (let k = 0; k < 18; k++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = Math.random() * 8 + 3;
              particles.push({
                x: arrow.x,
                y: arrow.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: ['#ba68c8', '#ff2d6b', '#00e5ff', '#b8ff00'][Math.floor(Math.random() * 4)],
                size: Math.random() * 6 + 3,
                life: 1,
                decay: 0.03,
              });
            }

            damageTexts.push({
              x: boss.x + (Math.random() - 0.5) * 40,
              y: boss.y - 60,
              text: currentBossHp <= 0 ? 'FATAL CRIT!' : '-1 HP',
              color: currentBossHp <= 0 ? '#b8ff00' : '#ff2d6b',
              life: 1,
            });

            if (currentBossHp <= 0) {
              setGameState('won');
              sounds.playVictory();
              for (let k = 0; k < 80; k++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 15 + 4;
                particles.push({
                  x: boss.x,
                  y: boss.y,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  color: ['#ffe500', '#ff2d6b', '#00e5ff', '#b8ff00', '#ffffff'][
                    Math.floor(Math.random() * 5)
                  ],
                  size: Math.random() * 9 + 4,
                  life: 1,
                  decay: 0.015,
                });
              }
            }
            continue;
          }
        }

        if (arrow.x < -100 || arrow.x > width + 100 || arrow.y < -100 || arrow.y > height + 100) {
          arrows.splice(i, 1);
        }
      }

      // Particles & Damage texts
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      for (let i = damageTexts.length - 1; i >= 0; i--) {
        const dtObj = damageTexts[i];
        dtObj.y -= 1.2;
        dtObj.life -= dt * 1.5;

        if (dtObj.life <= 0) {
          damageTexts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = dtObj.life;
        ctx.font = 'bold 22px "Space Grotesk", sans-serif';
        ctx.fillStyle = dtObj.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = dtObj.color;
        ctx.textAlign = 'center';
        ctx.fillText(dtObj.text, dtObj.x, dtObj.y);
        ctx.restore();
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, gameKey]);

  if (!isOpen) return null;

  return (
    <div
      className="boss-battle-overlay"
      role="dialog"
      aria-label="Elden Boss Battle"
      onPointerDown={(e) => {
        if (e.target && e.target.closest('button')) return;
        if (fireArrowRef.current) fireArrowRef.current();
      }}
    >
      {/* Background Interactive Canvas */}
      <canvas ref={canvasRef} className="boss-canvas" />

      {/* Screen Effects */}
      <div className="rift-dimensional-vignette" />
      <div className="rift-scanlines" />
      {playerHitFlash && <div className="player-hit-flash" />}

      {/* Custom Dedicated Enchanted Bow Cursor Overlay */}
      <div
        className="boss-bow-cursor"
        style={{
          left: `${bowPos.x}px`,
          top: `${bowPos.y}px`,
        }}
      >
        <div
          className="bow-container-inner"
          style={{ transform: `rotate(${bowPos.angle}deg)` }}
        >
          {/* Aiming Crosshair */}
          <div className="bow-crosshair">
            <div className="bow-crosshair-dot" />
          </div>

          {/* Enchanted Bow SVG */}
          <svg viewBox="0 0 60 60" className="bow-svg-graphic" aria-hidden="true">
            {/* Bow Wood Limbs */}
            <path
              d="M 15,8 Q 42,30 15,52"
              fill="none"
              stroke="#b45309"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Bow Enchantment Sheen */}
            <path
              d="M 15,8 Q 42,30 15,52"
              fill="none"
              stroke="#00e5ff"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="drop-shadow(0 0 6px #00e5ff)"
            />
            {/* Bowstring */}
            <path
              d={isReloading ? "M 15,8 L 18,30 L 15,52" : "M 15,8 L 6,30 L 15,52"}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
            />
            {/* Nocked Spectral Arrow */}
            {!isReloading && (
              <g filter="drop-shadow(0 0 8px #b8ff00)">
                <line x1="6" y1="30" x2="48" y2="30" stroke="#b8ff00" strokeWidth="3.5" />
                <polygon points="48,30 38,24 38,36" fill="#00e5ff" />
                <line x1="6" y1="30" x2="0" y2="24" stroke="#ff2d6b" strokeWidth="2.5" />
                <line x1="6" y1="30" x2="0" y2="36" stroke="#ff2d6b" strokeWidth="2.5" />
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Top Controls: Sound & Close */}
      <div className="boss-controls-top-right">
        <button
          onClick={toggleMute}
          className="boss-hud-btn"
          title={muted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          <span>{muted ? 'Muted' : 'Audio On'}</span>
        </button>

        <button
          onClick={onClose}
          className="boss-hud-btn"
          title="Exit Rift [ESC]"
        >
          <X size={16} />
          <span>Exit Rift</span>
        </button>
      </div>

      {/* Top Boss HUD */}
      <div className="boss-hud-top">
        <div className="boss-title-container">
          <span className="boss-icon-skull">👑</span>
          <span className="boss-name">MALAKOR • THE ELDEN GHOST KING</span>
          <span className="boss-icon-skull">👑</span>
        </div>
        <div className="boss-subtitle">LORD OF THE PACMAN RIFT</div>

        {/* 10 HP Segmented Boss Bar */}
        <div className="boss-hp-bar-frame">
          <span className="boss-hp-text">{bossHp} / 10 HP</span>
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`boss-hp-segment ${i >= bossHp ? 'boss-hp-segment--lost' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Player HUD */}
      <div className="player-hud-bottom">
        <div className="player-hud-card">
          <div className="player-hearts-row">
            <span style={{ fontSize: '0.8rem', color: '#00e5ff', marginRight: '0.4rem' }}>
              BOW HP:
            </span>
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`player-heart-icon ${i >= playerHp ? 'player-heart-icon--lost' : ''}`}
              >
                ❤️
              </span>
            ))}
          </div>

          <div className="player-bow-status">
            <span style={{ color: 'var(--text-muted, #888)' }}>ENCHANTED BOW:</span>
            <span
              className={`bow-cooldown-pill ${
                isReloading ? 'bow-cooldown-pill--reloading' : 'bow-cooldown-pill--ready'
              }`}
            >
              {isReloading ? 'RELOADING (0.65s)' : 'READY TO FIRE [L-CLICK / SPACE]'}
            </span>
          </div>
        </div>
      </div>

      {/* Victory Modal */}
      {gameState === 'won' && (
        <div className="boss-outcome-modal">
          <div className="boss-outcome-title boss-outcome-title--victory">
            REVENANT VANQUISHED!
          </div>
          <div className="boss-outcome-subtitle">
            You shattered the Elden Ghost King with your enchanted spectral arrows. The dimensional rift dissolves and normal reality restores!
          </div>
          <div className="boss-outcome-actions">
            <button
              onClick={handleRestart}
              className="boss-outcome-btn boss-outcome-btn--primary"
            >
              <RotateCcw size={18} style={{ display: 'inline', marginRight: '6px' }} />
              Replay Boss Fight
            </button>
            <button
              onClick={onClose}
              className="boss-outcome-btn boss-outcome-btn--secondary"
            >
              Return To Portfolio
            </button>
          </div>
        </div>
      )}

      {/* Defeat Modal */}
      {gameState === 'lost' && (
        <div className="boss-outcome-modal">
          <div className="boss-outcome-title boss-outcome-title--defeat">
            YOU DIED
          </div>
          <div className="boss-outcome-subtitle">
            Your Bow was crushed by the Elden Ghost King&apos;s cosmic beams and shadow charges.
          </div>
          <div className="boss-outcome-actions">
            <button
              onClick={handleRestart}
              className="boss-outcome-btn boss-outcome-btn--primary"
            >
              <RotateCcw size={18} style={{ display: 'inline', marginRight: '6px' }} />
              Try Again
            </button>
            <button
              onClick={onClose}
              className="boss-outcome-btn boss-outcome-btn--secondary"
            >
              Escape The Rift
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
