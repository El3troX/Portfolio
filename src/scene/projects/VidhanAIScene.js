import * as THREE from 'three';
import { animate } from 'animejs';

/**
 * VidhanAIScene - 3D Dual-Beam Retrieval & Hierarchical Statute Filing Scene.
 * Features:
 * - Two distinct converging particle streams (Dense BGE-1.5 & Sparse BM25)
 * - Central Learning-to-Rank Re-Ranker Node
 * - Hierarchical Translucent Legal Planes (Part -> Chapter -> Section)
 * Per PORTFOLIO_SITE_SPEC.md §7a.
 */
export class VidhanAIScene {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.group = new THREE.Group();
    this.planes = [];
    this.streamParticles = [];

    this.initScene();
  }

  initScene() {
    const isDesktop = window.innerWidth >= 960;
    this.group.position.set(isDesktop ? 1.6 : 0, 0, 0);

    // 1. Central Re-Ranker Core
    const coreGeo = new THREE.IcosahedronGeometry(0.38, 3);
    const coreMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xa855f7),
      emissive: new THREE.Color(0xa855f7),
      emissiveIntensity: 0.6,
      roughness: 0.15,
      metalness: 0.85,
    });
    this.reRankerCore = new THREE.Mesh(coreGeo, coreMat);
    this.reRankerCore.position.set(0, 0, 0);
    this.group.add(this.reRankerCore);

    // Re-ranker outer pulsing gyro ring
    const gyroGeo = new THREE.TorusGeometry(0.55, 0.025, 16, 64);
    const gyroMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xe8e6ff),
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    this.gyroRing = new THREE.Mesh(gyroGeo, gyroMat);
    this.group.add(this.gyroRing);

    // 2. Dual Particle Streams (Stream 1: Dense BGE-1.5, Stream 2: Sparse BM25)
    this.initStreams();

    // 3. Hierarchical Translucent Filing Planes (Part -> Chapter -> Section)
    this.initHierarchyPlanes();
  }

  initStreams() {
    this.streamCount = 120;
    const densePositions = new Float32Array(this.streamCount * 3);
    const denseColors = new Float32Array(this.streamCount * 3);
    const bm25Positions = new Float32Array(this.streamCount * 3);
    const bm25Colors = new Float32Array(this.streamCount * 3);

    this.denseData = [];
    this.bm25Data = [];

    const denseCol = new THREE.Color(0xa855f7); // Dense BGE-1.5 Purple
    const bm25Col = new THREE.Color(0x3b82f6);  // Sparse BM25 Blue

    for (let i = 0; i < this.streamCount; i++) {
      const t = Math.random();
      this.denseData.push({ t, speed: 0.4 + Math.random() * 0.4, angle: Math.random() * Math.PI * 2 });
      this.bm25Data.push({ t, speed: 0.4 + Math.random() * 0.4, angle: Math.random() * Math.PI * 2 });

      denseColors[i * 3 + 0] = denseCol.r;
      denseColors[i * 3 + 1] = denseCol.g;
      denseColors[i * 3 + 2] = denseCol.b;

      bm25Colors[i * 3 + 0] = bm25Col.r;
      bm25Colors[i * 3 + 1] = bm25Col.g;
      bm25Colors[i * 3 + 2] = bm25Col.b;
    }

    // Dense Stream Points
    this.denseGeo = new THREE.BufferGeometry();
    this.denseGeo.setAttribute('position', new THREE.BufferAttribute(densePositions, 3));
    this.denseGeo.setAttribute('color', new THREE.BufferAttribute(denseColors, 3));
    this.denseMat = new THREE.PointsMaterial({
      size: 0.085,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.densePoints = new THREE.Points(this.denseGeo, this.denseMat);
    this.group.add(this.densePoints);

    // BM25 Stream Points
    this.bm25Geo = new THREE.BufferGeometry();
    this.bm25Geo.setAttribute('position', new THREE.BufferAttribute(bm25Positions, 3));
    this.bm25Geo.setAttribute('color', new THREE.BufferAttribute(bm25Colors, 3));
    this.bm25Mat = new THREE.PointsMaterial({
      size: 0.085,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.bm25Points = new THREE.Points(this.bm25Geo, this.bm25Mat);
    this.group.add(this.bm25Points);
  }

  initHierarchyPlanes() {
    // 3 Translucent Stacked Planes (Part, Chapter, Section) fanning to the right
    const hierarchyLevels = [
      { name: 'PART', label: 'Constitutional Parts', yOffset: 1.25, zOffset: -0.4, color: 0xa855f7 },
      { name: 'CHAPTER', label: 'Statutory Chapters', yOffset: 0.0, zOffset: 0.0, color: 0x3b82f6 },
      { name: 'SECTION', label: 'Preserved Citations', yOffset: -1.25, zOffset: 0.4, color: 0x22c55e },
    ];

    hierarchyLevels.forEach((lvl, idx) => {
      const planeGeo = new THREE.PlaneGeometry(2.4, 0.75);
      const planeMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(lvl.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const planeMesh = new THREE.Mesh(planeGeo, planeMat);
      planeMesh.position.set(2.2, lvl.yOffset, lvl.zOffset);
      planeMesh.rotation.y = -0.35;

      // Outer border wireframe for crisp filing look
      const edgesGeo = new THREE.EdgesGeometry(planeGeo);
      const edgesMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(lvl.color),
        transparent: true,
        opacity: 0.75,
      });
      const edgesLine = new THREE.LineSegments(edgesGeo, edgesMat);
      planeMesh.add(edgesLine);

      // Connecting beam from Re-Ranker -> Plane
      const beamGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(2.2, lvl.yOffset, lvl.zOffset),
      ]);
      const beamMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(lvl.color),
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });
      const beamLine = new THREE.Line(beamGeo, beamMat);
      this.group.add(beamLine);

      this.planes.push({ planeMesh, edgesLine, lvl });
      this.group.add(planeMesh);
    });
  }

  update(delta, elapsedTime) {
    if (!this.group.visible) return;

    // 1. Rotate Re-ranker core & ring
    this.reRankerCore.rotation.y = elapsedTime * 0.6;
    this.reRankerCore.rotation.x = elapsedTime * 0.4;
    this.gyroRing.rotation.x = elapsedTime * 0.8;
    this.gyroRing.rotation.y = elapsedTime * 0.5;

    // 2. Animate Converging Particle Streams
    const densePos = this.denseGeo.attributes.position.array;
    const bm25Pos = this.bm25Geo.attributes.position.array;

    for (let i = 0; i < this.streamCount; i++) {
      const d = this.denseData[i];
      const b = this.bm25Data[i];

      d.t = (d.t + delta * d.speed) % 1.0;
      b.t = (b.t + delta * b.speed) % 1.0;

      // Dense Stream: Top-Left Curve (-3.5, 2.2, -1.0) -> ReRanker (0, 0, 0)
      const dStart = new THREE.Vector3(-3.2, 2.0, -0.6);
      const dPos = dStart.clone().lerp(new THREE.Vector3(0, 0, 0), d.t);
      dPos.y += Math.sin(d.t * Math.PI) * 0.35;
      densePos[i * 3 + 0] = dPos.x + Math.sin(d.angle) * 0.12;
      densePos[i * 3 + 1] = dPos.y + Math.cos(d.angle) * 0.12;
      densePos[i * 3 + 2] = dPos.z;

      // BM25 Stream: Bottom-Left Curve (-3.2, -2.0, 0.6) -> ReRanker (0, 0, 0)
      const bStart = new THREE.Vector3(-3.2, -2.0, 0.6);
      const bPos = bStart.clone().lerp(new THREE.Vector3(0, 0, 0), b.t);
      bPos.y += Math.sin(b.t * Math.PI) * -0.35;
      bm25Pos[i * 3 + 0] = bPos.x + Math.cos(b.angle) * 0.12;
      bm25Pos[i * 3 + 1] = bPos.y + Math.sin(b.angle) * 0.12;
      bm25Pos[i * 3 + 2] = bPos.z;
    }

    this.denseGeo.attributes.position.needsUpdate = true;
    this.bm25Geo.attributes.position.needsUpdate = true;

    // 3. Floating Planes gentle hover
    this.planes.forEach((p, idx) => {
      p.planeMesh.position.y = p.lvl.yOffset + Math.sin(elapsedTime * 1.2 + idx) * 0.05;
    });
  }

  dispose() {
    this.reRankerCore.geometry.dispose();
    this.reRankerCore.material.dispose();
    this.gyroRing.geometry.dispose();
    this.gyroRing.material.dispose();
    this.denseGeo.dispose();
    this.denseMat.dispose();
    this.bm25Geo.dispose();
    this.bm25Mat.dispose();
    this.planes.forEach((p) => {
      p.planeMesh.geometry.dispose();
      p.planeMesh.material.dispose();
    });
  }
}
