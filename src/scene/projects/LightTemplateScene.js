import * as THREE from 'three';

/**
 * LightTemplateScene - ONE shared 3D backdrop scene for all 8 standard/light projects.
 * Features a rotating low-poly icosahedron dynamically colored by the active project's category.
 * Per PORTFOLIO_SITE_SPEC.md §7b & PROJECT_PLAN.md Phase 5.
 */
export class LightTemplateScene {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.group = new THREE.Group();

    this.activeColor = new THREE.Color(0x3b82f6);
    this.targetColor = new THREE.Color(0x3b82f6);

    this.initScene();
  }

  initScene() {
    const isDesktop = window.innerWidth >= 960;
    this.group.position.set(isDesktop ? 1.6 : 0, 0, 0);

    // 1. Low-poly rotating icosahedron
    const geo = new THREE.IcosahedronGeometry(0.85, 0);
    this.material = new THREE.MeshStandardMaterial({
      color: this.activeColor,
      emissive: this.activeColor,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.6,
      flatShading: true,
    });

    this.mesh = new THREE.Mesh(geo, this.material);
    this.group.add(this.mesh);

    // 2. Outer orbit wireframe ring
    const ringGeo = new THREE.TorusGeometry(1.25, 0.02, 16, 48);
    this.ringMat = new THREE.MeshBasicMaterial({
      color: this.activeColor,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    this.ringMesh = new THREE.Mesh(ringGeo, this.ringMat);
    this.group.add(this.ringMesh);
  }

  /**
   * Sets the active project data to update color dynamically from portfolio.json categories.
   */
  setProject(projectData, categoryConfig) {
    if (!categoryConfig) return;
    const colHex = categoryConfig.color || '#3b82f6';
    this.targetColor.set(colHex);
  }

  update(delta, elapsedTime) {
    if (!this.group.visible) return;

    // Smooth color transition
    this.activeColor.lerp(this.targetColor, 0.08);
    this.material.color.copy(this.activeColor);
    this.material.emissive.copy(this.activeColor);
    this.ringMat.color.copy(this.activeColor);

    // Rotation
    this.mesh.rotation.x += delta * 0.5;
    this.mesh.rotation.y += delta * 0.7;
    this.ringMesh.rotation.z += delta * 0.4;
    this.ringMesh.rotation.x = Math.sin(elapsedTime * 0.8) * 0.3;

    // Gentle hovering
    this.group.position.y = Math.sin(elapsedTime * 1.5) * 0.1;
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.material.dispose();
    this.ringMesh.geometry.dispose();
    this.ringMat.dispose();
  }
}
