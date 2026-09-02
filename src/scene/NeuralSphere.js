import * as THREE from 'three';
import { NodeRegistry } from './nodes/NodeRegistry.js';

/**
 * NeuralSphere - Core 3D Hero visualization.
 * Features:
 * - 4 category-clustered project nodes
 * - Synapse edges with irregular particle firing pulses
 * - Spring-eased assembly convergence over ~2.5s
 * - Idle auto-orbit (~90s per rotation) + damped pointer drag
 * - Dive-through particle streaming & dispersion
 */
export class NeuralSphere {
  constructor(portfolioData) {
    this.portfolio = portfolioData;
    this.group = new THREE.Group();
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Node registry
    this.nodeRegistry = new NodeRegistry(portfolioData);
    this.nodes = this.nodeRegistry.getNodes();

    // Assembly state
    this.assemblyProgress = this.reducedMotion ? 1.0 : 0.0;
    this.isAssembled = this.reducedMotion;
    this.assemblyDuration = 2.5; // seconds
    this.assemblyElapsed = 0;

    // Interaction & Orbit
    this.autoOrbitSpeed = (Math.PI * 2) / 90; // ~90s full revolution
    this.rotationVelocity = { x: 0, y: 0 };
    this.pointerDown = false;
    this.lastPointerPos = { x: 0, y: 0 };

    // Dive dissolution factor (0 = fully formed, 1 = streamed past)
    this.dissolution = 0;

    this.initScene();
    this.initInteraction();
  }

  initScene() {
    // 1. Add all node meshes
    this.nodes.forEach((node) => {
      this.group.add(node.group);
    });

    // 2. Build Synapse Particle Edges & Pulses
    this.initSynapses();

    // 3. Ambient inner shell lattice points
    this.initLattice();

    // Position sphere centered slightly to the right on desktop for asymmetric layout
    this.updateLayoutPosition();
  }

  updateLayoutPosition() {
    const isDesktop = window.innerWidth >= 960;
    // On desktop, shift right ~1.6 units to clear the left 640px content column
    this.group.position.set(isDesktop ? 1.4 : 0, 0, 0);
  }

  initSynapses() {
    this.edges = [];
    const maxDistance = 3.2;

    // Connect node pairs based on proximity & cluster affinity
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const nA = this.nodes[i];
        const nB = this.nodes[j];
        const dist = nA.targetPosition.distanceTo(nB.targetPosition);

        // Same category or within proximity distance
        const sameCategory = nA.project.category === nB.project.category;
        if (dist <= maxDistance || (sameCategory && dist <= maxDistance * 1.35)) {
          this.edges.push({
            nodeA: nA,
            nodeB: nB,
            color: nA.color.clone().lerp(nB.color, 0.5),
            pulses: [
              { progress: Math.random(), speed: 0.25 + Math.random() * 0.45, interval: 2 + Math.random() * 4 },
              { progress: Math.random(), speed: 0.3 + Math.random() * 0.35, interval: 3 + Math.random() * 5 },
            ],
          });
        }
      }
    }

    // Line segments for base static edges (40% opacity)
    const linePositions = new Float32Array(this.edges.length * 6);
    const lineColors = new Float32Array(this.edges.length * 6);

    this.edges.forEach((edge, idx) => {
      const c = edge.color;
      lineColors[idx * 6 + 0] = c.r * 0.4;
      lineColors[idx * 6 + 1] = c.g * 0.4;
      lineColors[idx * 6 + 2] = c.b * 0.4;
      lineColors[idx * 6 + 3] = c.r * 0.4;
      lineColors[idx * 6 + 4] = c.g * 0.4;
      lineColors[idx * 6 + 5] = c.b * 0.4;
    });

    this.edgeGeometry = new THREE.BufferGeometry();
    this.edgeGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    this.edgeGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    this.edgeMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.lineSegments = new THREE.LineSegments(this.edgeGeometry, this.edgeMaterial);
    this.group.add(this.lineSegments);

    // Particle pulses along edges (Synapse firing)
    this.totalPulses = this.edges.length * 2;
    const pulsePositions = new Float32Array(this.totalPulses * 3);
    const pulseColors = new Float32Array(this.totalPulses * 3);

    this.pulseGeometry = new THREE.BufferGeometry();
    this.pulseGeometry.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));
    this.pulseGeometry.setAttribute('color', new THREE.BufferAttribute(pulseColors, 3));

    this.pulseMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.pulsePoints = new THREE.Points(this.pulseGeometry, this.pulseMaterial);
    this.group.add(this.pulsePoints);
  }

  initLattice() {
    // Subtle background point constellation within the sphere
    const latticeCount = 350;
    const pos = new Float32Array(latticeCount * 3);
    const colors = new Float32Array(latticeCount * 3);
    const baseColor = new THREE.Color(0xe8e6ff);

    for (let i = 0; i < latticeCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 3.3 * Math.cbrt(Math.random());

      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      colors[i * 3 + 0] = baseColor.r * 0.3;
      colors[i * 3 + 1] = baseColor.g * 0.3;
      colors[i * 3 + 2] = baseColor.b * 0.4;
    }

    this.latticeGeometry = new THREE.BufferGeometry();
    this.latticeGeometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.latticeGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.latticeMaterial = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.latticeMesh = new THREE.Points(this.latticeGeometry, this.latticeMaterial);
    this.group.add(this.latticeMesh);
  }

  initInteraction() {
    const onPointerDown = (e) => {
      this.pointerDown = true;
      this.lastPointerPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      if (!this.pointerDown) return;
      const deltaX = e.clientX - this.lastPointerPos.x;
      const deltaY = e.clientY - this.lastPointerPos.y;

      this.rotationVelocity.y += deltaX * 0.0035;
      this.rotationVelocity.x += deltaY * 0.0035;

      this.lastPointerPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      this.pointerDown = false;
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('resize', () => this.updateLayoutPosition());
  }

  // Spring easing function with slight overshoot per PORTFOLIO_SITE_SPEC §1
  springEase(t) {
    if (t >= 1) return 1;
    const c4 = (2 * Math.PI) / 3;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }

  setDissolution(val) {
    this.dissolution = THREE.MathUtils.clamp(val, 0, 1);
    
    // As dissolution approaches 1, fade edges and disperse nodes outward like stars
    if (this.edgeMaterial) {
      this.edgeMaterial.opacity = (1 - this.dissolution) * 0.55;
    }
    if (this.pulseMaterial) {
      this.pulseMaterial.opacity = (1 - this.dissolution) * 0.9;
    }
    if (this.latticeMaterial) {
      this.latticeMaterial.opacity = (1 - this.dissolution) * 0.4;
    }
  }

  update(delta, elapsedTime) {
    // 1. Assembly Convergence Spring
    if (!this.isAssembled) {
      this.assemblyElapsed += delta;
      const rawProgress = Math.min(1.0, this.assemblyElapsed / this.assemblyDuration);
      this.assemblyProgress = this.springEase(rawProgress);

      if (rawProgress >= 1.0) {
        this.isAssembled = true;
        this.assemblyProgress = 1.0;
      }
    }

    // 2. Node positions interpolation (start -> target + dive stream offset)
    this.nodes.forEach((node) => {
      const currentPos = new THREE.Vector3().lerpVectors(
        node.startPosition,
        node.targetPosition,
        this.assemblyProgress
      );

      // If diving past, disperse outward radially
      if (this.dissolution > 0) {
        const disperseDir = node.targetPosition.clone().normalize();
        currentPos.addScaledVector(disperseDir, this.dissolution * 12.0);
        currentPos.z += this.dissolution * 6.0; // Stream past camera
      }

      node.setPosition(currentPos);
      node.update(delta, elapsedTime, this.assemblyProgress);
    });

    // 3. Update Synapse Edges & Pulses
    this.updateSynapses(delta, elapsedTime);

    // 4. Orbit & Inertial Damping
    if (this.isAssembled) {
      this.group.rotation.y += this.autoOrbitSpeed * delta;
    }

    this.group.rotation.y += this.rotationVelocity.y;
    this.group.rotation.x += this.rotationVelocity.x;

    // Damping friction
    this.rotationVelocity.x *= 0.92;
    this.rotationVelocity.y *= 0.92;

    // Restrict pitch angle
    this.group.rotation.x = THREE.MathUtils.clamp(this.group.rotation.x, -0.6, 0.6);
  }

  updateSynapses(delta, elapsedTime) {
    if (!this.lineSegments || !this.pulsePoints) return;

    const linePosAttr = this.edgeGeometry.attributes.position;
    const pulsePosAttr = this.pulseGeometry.attributes.position;
    const pulseColAttr = this.pulseGeometry.attributes.color;

    let pulseIdx = 0;

    this.edges.forEach((edge, eIdx) => {
      const posA = edge.nodeA.currentPosition;
      const posB = edge.nodeB.currentPosition;

      // Update line endpoints
      linePosAttr.setXYZ(eIdx * 2 + 0, posA.x, posA.y, posA.z);
      linePosAttr.setXYZ(eIdx * 2 + 1, posB.x, posB.y, posB.z);

      // Update pulse particles along edge
      edge.pulses.forEach((pulse) => {
        pulse.progress += delta * pulse.speed;
        if (pulse.progress > 1.0) {
          pulse.progress = 0.0;
        }

        const pulsePos = new THREE.Vector3().lerpVectors(posA, posB, pulse.progress);
        pulsePosAttr.setXYZ(pulseIdx, pulsePos.x, pulsePos.y, pulsePos.z);

        // Flash brightness at pulse midpoint
        const intensity = Math.sin(pulse.progress * Math.PI);
        const col = edge.color.clone().multiplyScalar(0.5 + intensity * 0.85);
        pulseColAttr.setXYZ(pulseIdx, col.r, col.g, col.b);

        pulseIdx++;
      });
    });

    linePosAttr.needsUpdate = true;
    pulsePosAttr.needsUpdate = true;
    pulseColAttr.needsUpdate = true;
  }

  dispose() {
    this.nodeRegistry.dispose();
    if (this.edgeGeometry) this.edgeGeometry.dispose();
    if (this.edgeMaterial) this.edgeMaterial.dispose();
    if (this.pulseGeometry) this.pulseGeometry.dispose();
    if (this.pulseMaterial) this.pulseMaterial.dispose();
    if (this.latticeGeometry) this.latticeGeometry.dispose();
    if (this.latticeMaterial) this.latticeMaterial.dispose();
  }
}
