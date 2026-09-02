import * as THREE from 'three';

/**
 * NodeMesh - Individual 3D project node within the Neural Sphere.
 * Node radius is driven by primaryMetricForNodeSize from portfolio.json.
 */
export class NodeMesh {
  constructor(projectData, categoryConfig, targetPosition) {
    this.project = projectData;
    this.category = categoryConfig;
    this.targetPosition = targetPosition.clone();
    
    // Scattered starting position for assembly sequence
    this.startPosition = new THREE.Vector3(
      (Math.random() - 0.5) * 28,
      (Math.random() - 0.5) * 28,
      (Math.random() - 0.5) * 28
    );
    this.currentPosition = this.startPosition.clone();

    // Node radius calculation: base + scaled metric
    const metricScale = typeof projectData.primaryMetricForNodeSize === 'number'
      ? projectData.primaryMetricForNodeSize
      : 0.5;
    
    // Tier modifier: flagship nodes are prominently larger
    const tierMultiplier = projectData.tier === 'flagship' ? 1.35 : 1.0;
    this.baseRadius = (0.16 + metricScale * 0.22) * tierMultiplier;

    this.group = new THREE.Group();
    this.group.position.copy(this.currentPosition);

    this.color = new THREE.Color(categoryConfig ? categoryConfig.color : '#EDEDF2');

    this.createGeometry();
  }

  createGeometry() {
    // 1. Core Sphere
    const coreGeo = new THREE.IcosahedronGeometry(this.baseRadius, 3);
    const coreMat = new THREE.MeshStandardMaterial({
      color: this.color,
      emissive: this.color,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.group.add(this.coreMesh);

    // 2. Halo / Orbit Ring
    const haloGeo = new THREE.RingGeometry(this.baseRadius * 1.35, this.baseRadius * 1.5, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: this.color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    this.haloMesh = new THREE.Mesh(haloGeo, haloMat);
    this.haloMesh.rotation.x = Math.PI / 2;
    this.group.add(this.haloMesh);

    // Metadata for raycasting / interaction
    this.group.userData = {
      project: this.project,
      nodeInstance: this,
    };
  }

  setPosition(pos) {
    this.currentPosition.copy(pos);
    this.group.position.copy(pos);
  }

  update(delta, elapsedTime, assemblyProgress) {
    // Halo gentle rotation
    if (this.haloMesh) {
      this.haloMesh.rotation.z = elapsedTime * 0.8;
    }

    // Gentle breathing pulse
    const pulse = 1 + Math.sin(elapsedTime * 2.5 + this.targetPosition.x) * 0.06;
    this.coreMesh.scale.setScalar(pulse);
  }

  dispose() {
    if (this.coreMesh) {
      this.coreMesh.geometry.dispose();
      this.coreMesh.material.dispose();
    }
    if (this.haloMesh) {
      this.haloMesh.geometry.dispose();
      this.haloMesh.material.dispose();
    }
  }
}
