import * as THREE from 'three';

/**
 * Camera waypoint curves and 3D paths for section choreography per PROJECT_PLAN.md.
 */
export const ExperienceRoadPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0.5, 0.2, -1.8),   // Start from post-dive About
  new THREE.Vector3(1.2, 0.5, -6.5),   // Approach Waypoint 1: Mahindra & Mahindra
  new THREE.Vector3(-0.4, 0.3, -12.0), // Curve between waypoints
  new THREE.Vector3(0.8, 0.4, -17.5),  // Approach Waypoint 2: EY GDS (closer/prominent)
  new THREE.Vector3(0.5, 0.2, -22.0),  // Exit toward Skills Cloud
]);

export const SkillsCameraAnchor = {
  pos: new THREE.Vector3(0, 0, -26.0),
  lookAt: new THREE.Vector3(0.8, 0, -32.0),
};
