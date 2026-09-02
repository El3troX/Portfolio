import * as THREE from 'three';
import { animate } from 'animejs';

/**
 * ValkyrieAMLScene - 3D Force-Directed Account Graph with Sequential PageRank
 * Propagation, Flagged Anomaly States, and Interactive SHAP Feature Fan-Out.
 * Per PORTFOLIO_SITE_SPEC.md §7a.
 */
export class ValkyrieAMLScene {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.group = new THREE.Group();
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Node & Edge collections
    this.nodes = [];
    this.edges = [];
    this.pulses = [];
    this.activeShapGroup = null;
    this.selectedNode = null;

    // State
    this.isActive = false;
    this.hasPropagated = false;
    this.propagationTimeline = [];
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2(-1000, -1000);
    this.hoveredNode = null;

    this.initGraphTopology();
    this.initInteraction();
  }

  /**
   * Builds an organic, multi-hop financial network with layering, structuring,
   * mule accounts, and fan-out nodes.
   */
  initGraphTopology() {
    // 1. Define Account Topology
    const rawNodes = [
      { id: 'ACC-SEED-901', label: 'Seed Mule', x: -1.2, y: 0.8, z: 0.2, isSeed: true, flagged: true, risk: 0.96 },
      { id: 'ACC-LAY-104', label: 'Layering 1', x: 0.4, y: 1.4, z: -0.3, hop: 1, flagged: true, risk: 0.88 },
      { id: 'ACC-LAY-105', label: 'Layering 2', x: 0.2, y: -0.3, z: 0.6, hop: 1, flagged: false, risk: 0.45 },
      { id: 'ACC-FAN-201', label: 'Fan-Out A', x: 1.8, y: 1.8, z: 0.4, hop: 2, flagged: true, risk: 0.92 },
      { id: 'ACC-FAN-202', label: 'Fan-Out B', x: 1.6, y: 0.5, z: -0.5, hop: 2, flagged: true, risk: 0.84 },
      { id: 'ACC-FAN-203', label: 'Fan-Out C', x: 1.5, y: -1.2, z: 0.2, hop: 2, flagged: false, risk: 0.32 },
      { id: 'ACC-SINK-301', label: 'Offshore Sink', x: 3.2, y: 1.2, z: -0.2, hop: 3, flagged: true, risk: 0.98 },
      { id: 'ACC-SINK-302', label: 'Shell Corp', x: 2.9, y: -0.6, z: 0.5, hop: 3, flagged: true, risk: 0.91 },
      { id: 'ACC-NORM-01', label: 'Clean Retail', x: -2.2, y: -1.4, z: -0.4, hop: 2, flagged: false, risk: 0.08 },
      { id: 'ACC-NORM-02', label: 'Merchant Hub', x: -0.6, y: -1.9, z: -0.2, hop: 2, flagged: false, risk: 0.12 },
    ];

    const rawEdges = [
      { from: 0, to: 1, flow: '$180,000' },
      { from: 0, to: 2, flow: '$95,000' },
      { from: 1, to: 3, flow: '$89,000' },
      { from: 1, to: 4, flow: '$91,000' },
      { from: 2, to: 4, flow: '$45,000' },
      { from: 2, to: 5, flow: '$50,000' },
      { from: 3, to: 6, flow: '$85,000' },
      { from: 4, to: 6, flow: '$88,000' },
      { from: 4, to: 7, flow: '$42,000' },
      { from: 5, to: 7, flow: '$48,000' },
      { from: 0, to: 8, flow: '$1,200' },
      { from: 2, to: 9, flow: '$3,500' },
    ];

    // Node Visuals
    const nodeGeometry = new THREE.IcosahedronGeometry(0.18, 3);
    const defaultColor = new THREE.Color(0x3b82f6); // Base network blue
    const flaggedColor = new THREE.Color(0xf97316); // Red-Orange Warning

    rawNodes.forEach((data, index) => {
      const position = new THREE.Vector3(data.x, data.y, data.z);
      
      // Node Mesh
      const material = new THREE.MeshStandardMaterial({
        color: defaultColor,
        emissive: defaultColor,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.7,
      });

      const mesh = new THREE.Mesh(nodeGeometry, material);
      mesh.position.copy(position);

      // Outer Pulse Ring / Halo
      const ringGeo = new THREE.RingGeometry(0.24, 0.28, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: defaultColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      mesh.add(ringMesh);

      mesh.userData = {
        index,
        data,
        isFlagged: data.flagged,
        ringMesh,
        material,
        originalColor: defaultColor,
        flaggedColor: flaggedColor,
        activated: false,
      };

      this.nodes.push(mesh);
      this.group.add(mesh);
    });

    // 2. Edge Line Segments & Particles
    const linePositions = new Float32Array(rawEdges.length * 6);
    const lineColors = new Float32Array(rawEdges.length * 6);

    rawEdges.forEach((edge, idx) => {
      const pA = this.nodes[edge.from].position;
      const pB = this.nodes[edge.to].position;

      linePositions[idx * 6 + 0] = pA.x;
      linePositions[idx * 6 + 1] = pA.y;
      linePositions[idx * 6 + 2] = pA.z;
      linePositions[idx * 6 + 3] = pB.x;
      linePositions[idx * 6 + 4] = pB.y;
      linePositions[idx * 6 + 5] = pB.z;

      const baseCol = new THREE.Color(0x232330);
      for (let k = 0; k < 6; k += 3) {
        lineColors[idx * 6 + k] = baseCol.r;
        lineColors[idx * 6 + k + 1] = baseCol.g;
        lineColors[idx * 6 + k + 2] = baseCol.b;
      }

      this.edges.push({
        from: edge.from,
        to: edge.to,
        flow: edge.flow,
        lineIndex: idx,
      });
    });

    this.edgeGeometry = new THREE.BufferGeometry();
    this.edgeGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    this.edgeGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    this.edgeMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.lineSegments = new THREE.LineSegments(this.edgeGeometry, this.edgeMaterial);
    this.group.add(this.lineSegments);

    // 3. Propagation Particles (PageRank wave packet)
    this.initPropagationParticles();

    // Position entire group to the right of the 640px left content column
    this.updateLayoutPosition();
  }

  updateLayoutPosition() {
    const isDesktop = window.innerWidth >= 960;
    // Shift graph to center-right on desktop
    this.group.position.set(isDesktop ? 1.6 : 0, 0, 0);
  }

  initPropagationParticles() {
    this.packetCount = 35;
    this.packetGeometry = new THREE.BufferGeometry();
    const packetPos = new Float32Array(this.packetCount * 3);
    const packetCol = new Float32Array(this.packetCount * 3);

    this.packetGeometry.setAttribute('position', new THREE.BufferAttribute(packetPos, 3));
    this.packetGeometry.setAttribute('color', new THREE.BufferAttribute(packetCol, 3));

    this.packetMaterial = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.packetPoints = new THREE.Points(this.packetGeometry, this.packetMaterial);
    this.group.add(this.packetPoints);
  }

  /**
   * Sequential Personalized PageRank Propagation wave.
   * On scene entry, pulses cascade hop-by-hop from seed node -> layering -> sink.
   */
  startPropagationSequence() {
    if (this.hasPropagated && !this.reducedMotion) return;
    this.hasPropagated = true;
    this.packetMaterial.opacity = 1.0;

    // Ordered hops: Hop 0 (Seed) -> Hop 1 (Layering) -> Hop 2 (Fan-Out) -> Hop 3 (Sink)
    const hopDelays = {
      0: 100,
      1: 900,
      2: 1750,
      3: 2600,
    };

    this.nodes.forEach((node) => {
      const { hop, isSeed, isFlagged } = node.userData.data;
      const delay = isSeed ? hopDelays[0] : hopDelays[hop] || 2000;

      setTimeout(() => {
        // Node pulse activation
        node.userData.activated = true;
        
        // Single clean flash transition into warning state if flagged
        const targetColor = isFlagged ? node.userData.flaggedColor : new THREE.Color(0x38bdf8);
        
        animate(node.scale, {
          x: [1, 1.45, 1.15],
          y: [1, 1.45, 1.15],
          z: [1, 1.45, 1.15],
          duration: 500,
          ease: 'outBack',
        });

        animate(node.userData.material.color, {
          r: targetColor.r,
          g: targetColor.g,
          b: targetColor.b,
          duration: 600,
          ease: 'outQuart',
        });

        animate(node.userData.material.emissive, {
          r: targetColor.r,
          g: targetColor.g,
          b: targetColor.b,
          duration: 600,
          ease: 'outQuart',
        });

        // Edge illumination
        this.illuminateEdgesFrom(node.userData.index, targetColor);
      }, delay);
    });

    // Auto-select seed node after propagation completes if no user selection yet
    setTimeout(() => {
      if (!this.selectedNode) {
        this.selectNode(this.nodes[0]);
      }
    }, 3400);
  }

  illuminateEdgesFrom(sourceIdx, color) {
    const lineColAttr = this.edgeGeometry.attributes.color;
    this.edges.forEach((edge) => {
      if (edge.from === sourceIdx) {
        const idx = edge.lineIndex;
        lineColAttr.setXYZ(idx * 6 + 0, color.r * 0.8, color.g * 0.8, color.b * 0.8);
        lineColAttr.setXYZ(idx * 6 + 1, color.r * 0.8, color.g * 0.8, color.b * 0.8);
        lineColAttr.setXYZ(idx * 6 + 2, color.r * 0.8, color.g * 0.8, color.b * 0.8);
        lineColAttr.setXYZ(idx * 6 + 3, color.r * 0.8, color.g * 0.8, color.b * 0.8);
        lineColAttr.setXYZ(idx * 6 + 4, color.r * 0.8, color.g * 0.8, color.b * 0.8);
        lineColAttr.setXYZ(idx * 6 + 5, color.r * 0.8, color.g * 0.8, color.b * 0.8);
      }
    });
    lineColAttr.needsUpdate = true;
  }

  /**
   * Interactive Pointer Raycasting & Click Handler
   */
  initInteraction() {
    const onPointerMove = (e) => {
      const rect = this.sceneManager.canvas.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e) => {
      if (this.hoveredNode) {
        this.selectNode(this.hoveredNode);
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('resize', () => this.updateLayoutPosition());
  }

  /**
   * Generates SHAP-style Horizontal Feature Contribution Bars
   * fanning out from the selected account node per PORTFOLIO_SITE_SPEC §7a.
   */
  selectNode(node) {
    this.selectedNode = node;
    const { data } = node.userData;

    // Remove previous SHAP group
    if (this.activeShapGroup) {
      this.group.remove(this.activeShapGroup);
      this.activeShapGroup = null;
    }

    // Realistic SHAP features based on node anomaly
    const shapFeatures = [
      { name: 'transaction_velocity_zscore', value: +0.38, positive: true },
      { name: 'counterparty_risk_propagation', value: +0.29, positive: true },
      { name: 'structuring_amount_clustering', value: +0.22, positive: true },
      { name: 'offshore_destination_hop', value: +0.18, positive: true },
      { name: 'historical_account_baseline', value: -0.11, positive: false },
    ];

    const shapGroup = new THREE.Group();
    shapGroup.position.copy(node.position);

    // Build 3D SHAP Bar Overlay
    shapFeatures.forEach((feat, fIdx) => {
      const barHeight = 0.055;
      const barMaxWidth = Math.abs(feat.value) * 2.6;
      const isPositive = feat.positive;

      // Color: Red/Orange for risk-increasing features, Blue for risk-reducing
      const barColor = isPositive ? new THREE.Color(0xef4444) : new THREE.Color(0x3b82f6);

      const barGeo = new THREE.PlaneGeometry(0.01, barHeight);
      const barMat = new THREE.MeshBasicMaterial({
        color: barColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });

      const barMesh = new THREE.Mesh(barGeo, barMat);
      const yOffset = 0.5 - fIdx * 0.16;
      const xOffset = 0.4 + barMaxWidth / 2;

      barMesh.position.set(0.4, yOffset, 0.1);
      shapGroup.add(barMesh);

      // Animate bar expansion cleanly
      animate(barMesh.scale, {
        x: [0.1, barMaxWidth * 100],
        duration: 450,
        delay: fIdx * 65,
        ease: 'outQuart',
      });

      animate(barMesh.position, {
        x: [0.4, xOffset],
        duration: 450,
        delay: fIdx * 65,
        ease: 'outQuart',
      });
    });

    this.activeShapGroup = shapGroup;
    this.group.add(shapGroup);

    // Notify UI event if callback registered
    if (this.onNodeSelectedCallback) {
      this.onNodeSelectedCallback(data, shapFeatures);
    }
  }

  onNodeSelected(callback) {
    this.onNodeSelectedCallback = callback;
  }

  update(delta, elapsedTime) {
    // 1. Raycasting for hover state
    this.raycaster.setFromCamera(this.pointer, this.sceneManager.camera);
    const intersects = this.raycaster.intersectObjects(this.nodes, false);

    if (intersects.length > 0) {
      const hitNode = intersects[0].object;
      this.hoveredNode = hitNode;
      this.sceneManager.canvas.style.cursor = 'pointer';
      hitNode.scale.lerp(new THREE.Vector3(1.28, 1.28, 1.28), 0.15);
    } else {
      this.hoveredNode = null;
      this.sceneManager.canvas.style.cursor = 'default';
      this.nodes.forEach((n) => {
        if (n !== this.selectedNode) {
          n.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.08);
        }
      });
    }

    // 2. Halo rotations & breathing pulses
    this.nodes.forEach((node) => {
      const ring = node.userData.ringMesh;
      if (ring) {
        ring.rotation.z = elapsedTime * 0.6;
      }
    });

    // 3. Gentle graph breathing/floating
    this.group.position.y = Math.sin(elapsedTime * 0.8) * 0.08;
  }

  dispose() {
    this.nodes.forEach((n) => {
      n.geometry.dispose();
      n.material.dispose();
    });
    if (this.edgeGeometry) this.edgeGeometry.dispose();
    if (this.edgeMaterial) this.edgeMaterial.dispose();
    if (this.packetGeometry) this.packetGeometry.dispose();
    if (this.packetMaterial) this.packetMaterial.dispose();
    if (this.activeShapGroup) {
      this.group.remove(this.activeShapGroup);
    }
  }
}
