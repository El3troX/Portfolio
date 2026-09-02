import * as THREE from 'three';

/**
 * SceneManager - Single source of truth for WebGL rendering, camera, and render loop.
 * Implements the architecture rules defined in CLAUDE.md & PROJECT_PLAN.md:
 * - Exactly one WebGLRenderer instance
 * - Exactly one render loop (requestAnimationFrame / setAnimationLoop)
 * - DPR capping: Math.min(window.devicePixelRatio, 2)
 * - Background color: #0A0A0F
 * - Pluggable update hooks & scene nodes
 */
export class SceneManager {
  constructor(canvasElement) {
    if (!canvasElement) {
      throw new Error('[SceneManager] A valid HTMLCanvasElement must be provided.');
    }

    this.canvas = canvasElement;
    this.updateCallbacks = new Set();
    this.clock = new THREE.Clock();
    this.isRunning = false;
    this.animationFrameId = null;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0f);

    // 2. Camera
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 10);

    // 3. WebGLRenderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    // 4. Lighting defaults
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xe8e6ff, 1.2);
    this.directionalLight.position.set(5, 10, 7);
    this.scene.add(this.directionalLight);

    // 5. Resize Handling
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);

    // Start loop
    this.start();
  }

  handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  /**
   * Register a per-frame update callback.
   * @param {Function} callback (delta: number, elapsedTime: number) => void
   * @returns {Function} Unsubscribe function
   */
  registerUpdate(callback) {
    if (typeof callback === 'function') {
      this.updateCallbacks.add(callback);
    }
    return () => this.updateCallbacks.delete(callback);
  }

  unregisterUpdate(callback) {
    this.updateCallbacks.delete(callback);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clock.start();

    const loop = () => {
      if (!this.isRunning) return;

      const delta = this.clock.getDelta();
      const elapsedTime = this.clock.getElapsedTime();

      // Run registered update callbacks
      for (const cb of this.updateCallbacks) {
        try {
          cb(delta, elapsedTime);
        } catch (err) {
          console.error('[SceneManager] Error in update callback:', err);
        }
      }

      this.renderer.render(this.scene, this.camera);
      this.animationFrameId = requestAnimationFrame(loop);
    };

    loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  dispose() {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
    this.updateCallbacks.clear();

    // Dispose scene objects
    this.scene.traverse((obj) => {
      if (obj.isMesh) {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      }
    });

    this.renderer.dispose();
  }
}
