import * as THREE from 'three';

/**
 * TixRushScene - High-Concurrency Distributed Ticket Booking Seat Grid Scene
 * with Atomic Redis TTL Countdown Lock Rings per PORTFOLIO_SITE_SPEC.md §7a.
 */
export class TixRushScene {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.group = new THREE.Group();
    this.seats = [];
    this.lockedSeats = [];

    this.initScene();
  }

  initScene() {
    const isDesktop = window.innerWidth >= 960;
    this.group.position.set(isDesktop ? 1.6 : 0, 0, 0);

    // 1. Grid of 4 rows x 6 columns = 24 Seats
    const rows = 4;
    const cols = 6;
    const seatGeo = new THREE.BoxGeometry(0.35, 0.35, 0.2);
    const spacingX = 0.55;
    const spacingY = 0.55;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - (cols - 1) / 2) * spacingX;
        const y = ((rows - 1) / 2 - r) * spacingY;
        const z = -r * 0.15; // Theater stadium pitch

        const isInitiallyLocked = (r === 1 && c === 2) || (r === 2 && c === 3) || (r === 0 && c === 4);

        const mat = new THREE.MeshStandardMaterial({
          color: isInitiallyLocked ? new THREE.Color(0xef4444) : new THREE.Color(0x3b82f6),
          emissive: isInitiallyLocked ? new THREE.Color(0xef4444) : new THREE.Color(0x3b82f6),
          emissiveIntensity: isInitiallyLocked ? 0.65 : 0.3,
          roughness: 0.3,
          metalness: 0.6,
        });

        const seatMesh = new THREE.Mesh(seatGeo, mat);
        seatMesh.position.set(x, y, z);

        const seatObj = {
          mesh: seatMesh,
          mat,
          isLocked: isInitiallyLocked,
          ttlTimer: isInitiallyLocked ? Math.random() * 5.0 : 0,
          row: r,
          col: c,
        };

        // Add radial countdown ring to locked seats (Redis TTL visualization)
        if (isInitiallyLocked) {
          const ringGeo = new THREE.RingGeometry(0.24, 0.28, 32);
          const ringMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0xef4444),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
          });
          const ring = new THREE.Mesh(ringGeo, ringMat);
          ring.position.z = 0.15;
          seatMesh.add(ring);
          seatObj.ttlRing = ring;
          this.lockedSeats.push(seatObj);
        }

        this.seats.push(seatObj);
        this.group.add(seatMesh);
      }
    }
  }

  update(delta, elapsedTime) {
    if (!this.group.visible) return;

    // Simulate Redis TTL countdown and seat state transitions
    this.lockedSeats.forEach((seat) => {
      if (seat.ttlRing) {
        seat.ttlRing.rotation.z -= delta * 1.5;
        // Pulse ring scale to simulate heartbeat TTL
        const s = 1 + Math.sin(elapsedTime * 4) * 0.08;
        seat.ttlRing.scale.set(s, s, 1);
      }
    });

    // Gentle theater pitch sway
    this.group.rotation.y = Math.sin(elapsedTime * 0.6) * 0.08;
    this.group.rotation.x = 0.2 + Math.cos(elapsedTime * 0.4) * 0.04;
  }

  dispose() {
    this.seats.forEach((s) => {
      s.mesh.geometry.dispose();
      s.mat.dispose();
      if (s.ttlRing) {
        s.ttlRing.geometry.dispose();
        s.ttlRing.material.dispose();
      }
    });
  }
}
