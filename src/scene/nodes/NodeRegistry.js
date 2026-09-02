import * as THREE from 'three';
import { NodeMesh } from './NodeMesh.js';

/**
 * NodeRegistry - Clusters projects into 4 anatomical brain lobes/regions on the sphere.
 * Cluster Centers (Normalized on sphere of radius R):
 * - rag-agentic: Top-Right / Front-Right (+X, +Y, +Z)
 * - quant: Top-Left / Front-Left (-X, +Y, +Z)
 * - fullstack: Bottom-Right / Lateral (+X, -Y, +Z)
 * - applied-ml: Bottom-Left / Posterior (-X, -Y, -Z)
 */
export class NodeRegistry {
  constructor(portfolioData) {
    this.portfolio = portfolioData;
    this.nodes = [];
    this.sphereRadius = 3.3;

    this.clusterCenters = {
      'rag-agentic': new THREE.Vector3(1.5, 1.8, 1.6).normalize(),
      'quant': new THREE.Vector3(-1.6, 1.7, 1.4).normalize(),
      'fullstack': new THREE.Vector3(1.8, -1.2, 1.7).normalize(),
      'applied-ml': new THREE.Vector3(-1.7, -1.5, -0.8).normalize(),
    };

    this.buildNodes();
  }

  buildNodes() {
    const projectsByCategory = {};
    
    this.portfolio.projects.forEach((proj) => {
      if (!projectsByCategory[proj.category]) {
        projectsByCategory[proj.category] = [];
      }
      projectsByCategory[proj.category].push(proj);
    });

    Object.keys(projectsByCategory).forEach((catKey) => {
      const projs = projectsByCategory[catKey];
      const centerDir = this.clusterCenters[catKey] || new THREE.Vector3(0, 1, 0);
      const categoryConfig = this.portfolio.categories[catKey];

      projs.forEach((proj, idx) => {
        // Scatter offset around cluster center to create natural organic lobe formation
        const phi = (idx / Math.max(1, projs.length)) * Math.PI * 2;
        const spread = 0.55 + (idx % 2) * 0.25;
        
        // Perpendicular tangent vectors
        const u = new THREE.Vector3(0, 1, 0).cross(centerDir).normalize();
        if (u.lengthSq() < 0.001) u.set(1, 0, 0);
        const v = centerDir.clone().cross(u).normalize();

        const offsetDir = centerDir.clone()
          .addScaledVector(u, Math.cos(phi) * spread)
          .addScaledVector(v, Math.sin(phi) * spread)
          .normalize();

        // Jitter radius slightly so nodes don't lie on a rigid shell
        const nodeRadius = this.sphereRadius * (0.92 + (idx % 3) * 0.08);
        const targetPos = offsetDir.multiplyScalar(nodeRadius);

        const node = new NodeMesh(proj, categoryConfig, targetPos);
        this.nodes.push(node);
      });
    });
  }

  getNodes() {
    return this.nodes;
  }

  dispose() {
    this.nodes.forEach((n) => n.dispose());
  }
}
