import * as THREE from 'three';

/**
 * WashSaleScene - 3D Price Ribbon with Translucent 61-Day Sliding Window &
 * Ledger Entry Locking Animation per PORTFOLIO_SITE_SPEC.md §7a.
 */
export class WashSaleScene {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.group = new THREE.Group();
    this.ledgerCards = [];
    this.windowProgress = 0;

    this.initScene();
  }

  initScene() {
    const isDesktop = window.innerWidth >= 960;
    this.group.position.set(isDesktop ? 1.6 : 0, 0, 0);

    // 1. 3D Price Chart Ribbon
    this.initPriceRibbon();

    // 2. Translucent 61-Day Sliding Window Rectangle
    this.initSlidingWindow();

    // 3. Stacked Tax Ledger on the Right
    this.initStackedLedger();
  }

  initPriceRibbon() {
    // Generate synthetic price curve with a loss sale & wash repurchase
    const curvePoints = [];
    const count = 40;
    const width = 6.0;

    for (let i = 0; i <= count; i++) {
      const x = -width / 2 + (i / count) * width;
      const y = Math.sin(i * 0.35) * 0.6 - (i > 15 && i < 28 ? 0.85 : 0.0);
      const z = Math.cos(i * 0.2) * 0.25;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.04, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xf59e0b),
      emissive: new THREE.Color(0xf59e0b),
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.7,
    });
    this.ribbonMesh = new THREE.Mesh(tubeGeo, tubeMat);
    this.group.add(this.ribbonMesh);

    // Transaction Lot Pins (Loss Sale & Wash Repurchase)
    const pinGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 16);
    const lossMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const buyMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });

    // Sale pin (Loss)
    this.salePin = new THREE.Mesh(pinGeo, lossMat);
    this.salePin.position.set(-0.8, -0.6, 0);
    this.group.add(this.salePin);

    // Replacement buy pin
    this.buyPin = new THREE.Mesh(pinGeo, buyMat);
    this.buyPin.position.set(0.6, -0.1, 0);
    this.group.add(this.buyPin);
  }

  initSlidingWindow() {
    // Translucent 61-day window bounding box
    const windowGeo = new THREE.PlaneGeometry(1.9, 2.2);
    const windowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xf59e0b),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.windowMesh = new THREE.Mesh(windowGeo, windowMat);
    this.windowMesh.position.set(-0.8, 0, 0.15);

    // Border Frame for 61-day window
    const edges = new THREE.EdgesGeometry(windowGeo);
    const borderMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(0xf59e0b),
      transparent: true,
      opacity: 0.85,
    });
    this.windowBorder = new THREE.LineSegments(edges, borderMat);
    this.windowMesh.add(this.windowBorder);

    this.group.add(this.windowMesh);
  }

  initStackedLedger() {
    // Stack of 3 Ledger Cards on the Right
    const ledgerGroup = new THREE.Group();
    ledgerGroup.position.set(2.8, -0.4, 0.5);

    const cardGeo = new THREE.PlaneGeometry(1.6, 0.55);
    const cardColors = [0xef4444, 0xf59e0b, 0x22c55e];

    cardColors.forEach((col, idx) => {
      const cardMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(col),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });

      const card = new THREE.Mesh(cardGeo, cardMat);
      card.position.set(0, idx * 0.65, -idx * 0.15);

      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(cardGeo),
        new THREE.LineBasicMaterial({ color: new THREE.Color(col), opacity: 0.9, transparent: true })
      );
      card.add(edge);

      this.ledgerCards.push(card);
      ledgerGroup.add(card);
    });

    this.ledgerGroup = ledgerGroup;
    this.group.add(ledgerGroup);
  }

  update(delta, elapsedTime) {
    if (!this.group.visible) return;

    // 1. Sliding window oscillation across the 61-day window span
    this.windowProgress = (Math.sin(elapsedTime * 1.4) + 1) / 2; // 0 -> 1
    const minX = -1.6;
    const maxX = 0.8;
    this.windowMesh.position.x = minX + this.windowProgress * (maxX - minX);

    // 2. Lock & Ledger slide animation when window aligns with both pins
    const isLocked = Math.abs(this.windowMesh.position.x - (-0.1)) < 0.45;
    this.windowBorder.material.opacity = isLocked ? 1.0 : 0.4;
    this.windowMesh.material.opacity = isLocked ? 0.35 : 0.15;

    // Ledger card dynamic feedback
    this.ledgerCards.forEach((c, i) => {
      c.position.x = Math.sin(elapsedTime * 2 + i) * 0.04;
    });
  }

  dispose() {
    this.ribbonMesh.geometry.dispose();
    this.ribbonMesh.material.dispose();
    this.windowMesh.geometry.dispose();
    this.windowMesh.material.dispose();
    this.salePin.geometry.dispose();
    this.salePin.material.dispose();
    this.buyPin.geometry.dispose();
    this.buyPin.material.dispose();
    this.ledgerCards.forEach((c) => {
      c.geometry.dispose();
      c.material.dispose();
    });
  }
}
