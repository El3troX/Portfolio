import * as THREE from 'three';

/**
 * ParticleField - Ambient background field that forms post-dive-through
 * and provides persistent, subtle depth texture for the rest of the site per PORTFOLIO_SITE_SPEC §3 & §10.
 */
export class ParticleField {
  constructor() {
    this.group = new THREE.Group();
    this.isDesktop = window.innerWidth >= 960;
    this.particleCount = this.isDesktop ? 1800 : 750;
    this.targetOpacity = 0.45;
    this.currentOpacity = 0.0; // Starts invisible during hero, fades in as dive occurs

    this.init();
  }

  init() {
    const pos = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const speeds = new Float32Array(this.particleCount);

    const palette = [
      new THREE.Color(0xe8e6ff), // Glow
      new THREE.Color(0xa855f7), // RAG purple
      new THREE.Color(0x3b82f6), // Fullstack blue
      new THREE.Color(0x8b8b9b), // Muted secondary
    ];

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      pos[i3 + 0] = (Math.random() - 0.5) * 45;
      pos[i3 + 1] = (Math.random() - 0.5) * 45;
      pos[i3 + 2] = -5 - Math.random() * 45; // Spread deep behind camera & through space

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i3 + 0] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      speeds[i] = 0.15 + Math.random() * 0.35;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.speeds = speeds;

    this.material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.group.add(this.points);
  }

  setDiveProgress(progress) {
    // Fades in when dive crosses threshold 0.3 -> 1.0
    const fade = THREE.MathUtils.smoothstep(progress, 0.25, 0.95);
    this.material.opacity = fade * this.targetOpacity;
  }

  update(delta, elapsedTime) {
    if (this.material.opacity <= 0.001) return;

    const pos = this.geometry.attributes.position.array;
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      // Gentle forward drift
      pos[i3 + 2] += delta * this.speeds[i] * 1.5;
      if (pos[i3 + 2] > 5) {
        pos[i3 + 2] = -45;
      }
    }
    this.geometry.attributes.position.needsUpdate = true;
  }

  dispose() {
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
  }
}
