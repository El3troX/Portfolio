import * as THREE from 'three';
import { ExperienceRoadPath } from '../camera/paths.js';

/**
 * ExperienceRoad - 3D glowing path with 2 portal ring waypoints
 * (Mahindra & Mahindra and EY GDS) per PORTFOLIO_SITE_SPEC.md §5.
 */
export class ExperienceRoad {
  constructor() {
    this.group = new THREE.Group();
    this.waypoints = [];
    this.initRoad();
    this.initWaypoints();
  }

  initRoad() {
    // 1. Generate curved tube / ribbon along path
    const points = ExperienceRoadPath.getPoints(120);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(0x3b82f6),
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    this.roadLine = new THREE.Line(geometry, material);
    this.group.add(this.roadLine);

    // 2. Road Guide Particles along the path
    const particleCount = 180;
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const c1 = new THREE.Color(0x3b82f6);
    const c2 = new THREE.Color(0xa855f7);

    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      const pt = ExperienceRoadPath.getPoint(t);
      pos[i * 3 + 0] = pt.x + (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 1] = pt.y + (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 2] = pt.z + (Math.random() - 0.5) * 0.4;

      const mixed = c1.clone().lerp(c2, t);
      col[i * 3 + 0] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.roadParticles = new THREE.Points(pGeo, pMat);
    this.group.add(this.roadParticles);
  }

  initWaypoints() {
    const waypointData = [
      {
        id: 'mahindra',
        title: 'Mahindra & Mahindra',
        pos: ExperienceRoadPath.getPoint(0.28), // Waypoint 1
        color: new THREE.Color(0xa855f7),
      },
      {
        id: 'ey-gds',
        title: 'EY GDS',
        pos: ExperienceRoadPath.getPoint(0.72), // Waypoint 2
        color: new THREE.Color(0x3b82f6),
      },
    ];

    waypointData.forEach((wp, idx) => {
      const wpGroup = new THREE.Group();
      wpGroup.position.copy(wp.pos);

      // Portal Ring
      const ringGeo = new THREE.TorusGeometry(1.1, 0.04, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: wp.color,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      wpGroup.add(ringMesh);

      // Core anchor node
      const coreGeo = new THREE.IcosahedronGeometry(0.25, 2);
      const coreMat = new THREE.MeshStandardMaterial({
        color: wp.color,
        emissive: wp.color,
        emissiveIntensity: 0.5,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      wpGroup.add(coreMesh);

      this.waypoints.push({
        id: wp.id,
        group: wpGroup,
        ringMesh,
        ringMat,
        coreMesh,
        baseColor: wp.color,
      });

      this.group.add(wpGroup);
    });
  }

  update(delta, elapsedTime, cameraPos) {
    // Rotate portal rings & illuminate on camera approach
    this.waypoints.forEach((wp) => {
      wp.ringMesh.rotation.z = elapsedTime * 0.75;

      const dist = cameraPos.distanceTo(wp.group.position);
      // Brighten significantly when camera is close (< 4.5 units)
      const proximity = THREE.MathUtils.clamp(1 - dist / 5.5, 0, 1);
      wp.ringMat.opacity = 0.35 + proximity * 0.65;
      wp.coreMesh.scale.setScalar(1 + proximity * 0.4);
    });
  }

  dispose() {
    if (this.roadLine) {
      this.roadLine.geometry.dispose();
      this.roadLine.material.dispose();
    }
    if (this.roadParticles) {
      this.roadParticles.geometry.dispose();
      this.roadParticles.material.dispose();
    }
    this.waypoints.forEach((wp) => {
      wp.ringMesh.geometry.dispose();
      wp.ringMesh.material.dispose();
      wp.coreMesh.geometry.dispose();
      wp.coreMesh.material.dispose();
    });
  }
}
