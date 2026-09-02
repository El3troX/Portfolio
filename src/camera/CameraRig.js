import * as THREE from 'three';
import { ExperienceRoadPath, SkillsCameraAnchor } from './paths.js';

/**
 * CameraRig - Multi-Section Camera Choreography State Machine.
 * On Desktop: Smooth 3D dive-throughs, curved road tracking, and flagship dock-ins.
 * On Mobile: Stable, centered camera vantage point; 3D scenes act as backdrop layers per PORTFOLIO_SITE_SPEC §10.
 */
export class CameraRig {
  constructor(camera) {
    this.camera = camera;
    this.isMobile = window.innerWidth < 960;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Defined Waypoints & Docks
    this.waypoints = {
      hero: { pos: new THREE.Vector3(0, 0, 8.5), lookAt: new THREE.Vector3(0.6, 0, 0) },
      about: { pos: new THREE.Vector3(0.5, 0.2, -1.8), lookAt: new THREE.Vector3(0.5, 0.2, -10) },
      skills: { pos: SkillsCameraAnchor.pos.clone(), lookAt: SkillsCameraAnchor.lookAt.clone() },
      'flagship-vidhan': { pos: new THREE.Vector3(0.8, 0.1, 5.4), lookAt: new THREE.Vector3(1.5, 0, 0) },
      'flagship-valkyrie': { pos: new THREE.Vector3(0.8, 0.1, 5.2), lookAt: new THREE.Vector3(1.4, 0, 0) },
      'flagship-washsale': { pos: new THREE.Vector3(0.6, 0.2, 5.0), lookAt: new THREE.Vector3(1.3, 0, 0) },
      'flagship-tixrush': { pos: new THREE.Vector3(0.7, 0.15, 4.8), lookAt: new THREE.Vector3(1.3, 0, 0) },
      'standard-strip': { pos: new THREE.Vector3(0.8, 0.1, 5.2), lookAt: new THREE.Vector3(1.4, 0, 0) },
      extras: { pos: new THREE.Vector3(0.5, 0.2, -1.8), lookAt: new THREE.Vector3(0.5, 0.2, -10) },
      contact: { pos: new THREE.Vector3(0.5, 0.2, -1.8), lookAt: new THREE.Vector3(0.5, 0.2, -10) },
    };

    // Mobile Anchor (Centered, subtle depth)
    this.mobilePos = new THREE.Vector3(0, 0, 7.8);
    this.mobileLookAt = new THREE.Vector3(0, 0, 0);

    this.currentLookAt = this.isMobile ? this.mobileLookAt.clone() : this.waypoints.hero.lookAt.clone();
    this.targetLookAt = this.currentLookAt.clone();
    this.targetPos = this.isMobile ? this.mobilePos.clone() : this.waypoints.hero.pos.clone();

    // Parallax
    this.parallax = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.initListeners();
  }

  initListeners() {
    const handleMouseMove = (e) => {
      if (this.isMobile) return;
      this.parallax.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.parallax.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 960;
    });
  }

  setScrollState(globalProgress, currentSection, sectionProgress = 0) {
    this.currentSection = currentSection;

    if (this.isMobile) {
      // Mobile uses centered background anchor for clarity
      this.targetPos.copy(this.mobilePos);
      this.targetLookAt.copy(this.mobileLookAt);
      return;
    }

    if (currentSection === 'hero') {
      const easeT = THREE.MathUtils.smoothstep(sectionProgress, 0, 1);
      this.targetPos.lerpVectors(this.waypoints.hero.pos, this.waypoints.about.pos, easeT);

      if (sectionProgress > 0 && sectionProgress < 1) {
        this.targetPos.x += Math.sin(sectionProgress * Math.PI) * 0.45;
        this.targetPos.y += Math.sin(sectionProgress * Math.PI * 2) * 0.15;
      }
      this.targetLookAt.lerpVectors(this.waypoints.hero.lookAt, this.waypoints.about.lookAt, easeT);

    } else if (currentSection === 'experience') {
      const pathT = THREE.MathUtils.clamp(sectionProgress, 0, 1);
      const roadPoint = ExperienceRoadPath.getPoint(pathT);
      const roadTangent = ExperienceRoadPath.getTangent(pathT);

      this.targetPos.copy(roadPoint);
      this.targetLookAt.copy(roadPoint).addScaledVector(roadTangent, 6.0);

    } else if (this.waypoints[currentSection]) {
      this.targetPos.copy(this.waypoints[currentSection].pos);
      this.targetLookAt.copy(this.waypoints[currentSection].lookAt);
    }
  }

  update(delta) {
    if (this.reducedMotion) {
      this.camera.position.copy(this.targetPos);
      this.camera.lookAt(this.targetLookAt);
      return;
    }

    // 1. Damped Parallax
    this.parallax.x += (this.parallax.targetX - this.parallax.x) * 0.05;
    this.parallax.y += (this.parallax.targetY - this.parallax.y) * 0.05;

    // 2. Camera position interpolation
    this.camera.position.x += (this.targetPos.x + this.parallax.x * 0.25 - this.camera.position.x) * 0.08;
    this.camera.position.y += (this.targetPos.y - this.parallax.y * 0.25 - this.camera.position.y) * 0.08;
    this.camera.position.z += (this.targetPos.z - this.camera.position.z) * 0.08;

    // 3. LookAt interpolation
    this.currentLookAt.lerp(this.targetLookAt, 0.08);
    this.camera.lookAt(this.currentLookAt);
  }
}
