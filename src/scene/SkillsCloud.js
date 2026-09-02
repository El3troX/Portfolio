import * as THREE from 'three';

/**
 * SkillsCloud - 3D Floating Term Cloud with stack frequency sizing and
 * interactive connected-node graph reveals per PORTFOLIO_SITE_SPEC.md §6.
 */
export class SkillsCloud {
  constructor(sceneManager, portfolioData) {
    this.sceneManager = sceneManager;
    this.portfolio = portfolioData;
    this.group = new THREE.Group();
    this.group.position.set(1.5, 0, -28.0); // Docked beside content column

    this.skillNodes = [];
    this.projectAnchors = [];
    this.connectingLines = null;
    this.hoveredSkill = null;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2(-1000, -1000);

    this.computeFrequencies();
    this.initCloud();
    this.initProjectAnchors();
    this.initInteraction();
  }

  /**
   * Computes exact frequency of each term across all project stacks in portfolio.json.
   */
  computeFrequencies() {
    this.frequencyMap = {};
    this.skillToProjects = {};

    this.portfolio.projects.forEach((proj) => {
      proj.stack.forEach((skill) => {
        this.frequencyMap[skill] = (this.frequencyMap[skill] || 0) + 1;
        if (!this.skillToProjects[skill]) {
          this.skillToProjects[skill] = [];
        }
        this.skillToProjects[skill].push(proj);
      });
    });

    // Sort terms by frequency
    this.skillsList = Object.keys(this.frequencyMap).map((name) => ({
      name,
      count: this.frequencyMap[name],
      projects: this.skillToProjects[name],
    })).sort((a, b) => b.count - a.count);
  }

  createSkillCanvas(text, count, maxCount, isHovered = false) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;

    const normalizedSize = 28 + (count / maxCount) * 26;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background pill if hovered
    if (isHovered) {
      ctx.fillStyle = 'rgba(232, 230, 255, 0.15)';
      ctx.strokeStyle = '#e8e6ff';
      ctx.lineWidth = 4;
      ctx.roundRect(16, 16, canvas.width - 32, canvas.height - 32, 24);
      ctx.fill();
      ctx.stroke();
    }

    ctx.font = `600 ${normalizedSize}px "Space Grotesk", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(237, 237, 242, 0.75)';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas;
  }

  initCloud() {
    const maxCount = Math.max(...this.skillsList.map((s) => s.count), 1);
    const radius = 3.6;

    this.skillsList.forEach((skill, idx) => {
      // Golden spiral distribution on 3D sphere volume
      const phi = Math.acos(1 - 2 * (idx + 0.5) / this.skillsList.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (idx + 0.5);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta) * 0.85;
      const z = radius * Math.cos(phi) * 0.9;

      const canvas = this.createSkillCanvas(skill.name, skill.count, maxCount, false);
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;

      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      });

      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.set(x, y, z);
      
      const scaleBase = 1.4 + (skill.count / maxCount) * 0.8;
      sprite.scale.set(scaleBase * 1.5, scaleBase * 0.38, 1);

      sprite.userData = {
        skillData: skill,
        baseScale: new THREE.Vector3(scaleBase * 1.5, scaleBase * 0.38, 1),
        basePosition: sprite.position.clone(),
        maxCount,
        texture,
        material: spriteMat,
      };

      this.skillNodes.push(sprite);
      this.group.add(sprite);
    });
  }

  initProjectAnchors() {
    // Hidden anchor points representing connected project nodes in 3D space
    this.anchorGroup = new THREE.Group();
    const anchorGeo = new THREE.IcosahedronGeometry(0.18, 2);

    this.portfolio.projects.forEach((proj, idx) => {
      const angle = (idx / this.portfolio.projects.length) * Math.PI * 2;
      const catConfig = this.portfolio.categories[proj.category];
      const color = new THREE.Color(catConfig ? catConfig.color : '#3b82f6');

      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.0, // hidden until related skill hovered
        blending: THREE.AdditiveBlending,
      });

      const mesh = new THREE.Mesh(anchorGeo, mat);
      const r = 5.2;
      mesh.position.set(Math.cos(angle) * r, Math.sin(angle * 2) * 1.2, Math.sin(angle) * r);

      mesh.userData = { project: proj, material: mat };
      this.projectAnchors.push(mesh);
      this.anchorGroup.add(mesh);
    });

    this.group.add(this.anchorGroup);
  }

  initInteraction() {
    const onPointerMove = (e) => {
      const rect = this.sceneManager.canvas.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('pointermove', onPointerMove);
  }

  highlightSkill(skillSprite) {
    if (this.hoveredSkill === skillSprite) return;
    this.hoveredSkill = skillSprite;

    // Reset lines
    if (this.connectingLines) {
      this.group.remove(this.connectingLines);
      this.connectingLines.geometry.dispose();
      this.connectingLines.material.dispose();
      this.connectingLines = null;
    }

    if (!skillSprite) {
      // Restore all sprites to normal
      this.skillNodes.forEach((s) => {
        const d = s.userData;
        const c = this.createSkillCanvas(d.skillData.name, d.skillData.count, d.maxCount, false);
        d.texture.image = c;
        d.texture.needsUpdate = true;
        d.material.opacity = 0.85;
      });

      // Hide all project anchors
      this.projectAnchors.forEach((a) => {
        a.userData.material.opacity = 0.0;
      });

      if (this.onSkillHoverCallback) {
        this.onSkillHoverCallback(null);
      }
      return;
    }

    const { skillData, maxCount } = skillSprite.userData;

    // 1. Brighten hovered sprite
    const c = this.createSkillCanvas(skillData.name, skillData.count, maxCount, true);
    skillSprite.userData.texture.image = c;
    skillSprite.userData.texture.needsUpdate = true;
    skillSprite.userData.material.opacity = 1.0;

    // 2. Dim other skill sprites
    this.skillNodes.forEach((s) => {
      if (s !== skillSprite) {
        s.userData.material.opacity = 0.3;
      }
    });

    // 3. Light up connected project anchors & draw glowing lines
    const connectedProjects = skillData.projects;
    const lineCoords = [];
    const lineColors = [];

    this.projectAnchors.forEach((anchor) => {
      const isConnected = connectedProjects.some((p) => p.id === anchor.userData.project.id);
      if (isConnected) {
        anchor.userData.material.opacity = 0.9;

        // Line from skill -> project anchor
        lineCoords.push(
          skillSprite.position.x, skillSprite.position.y, skillSprite.position.z,
          anchor.position.x, anchor.position.y, anchor.position.z
        );

        const col = anchor.userData.material.color;
        lineColors.push(
          1, 1, 1,
          col.r, col.g, col.b
        );
      } else {
        anchor.userData.material.opacity = 0.0;
      }
    });

    // 4. Build connection line geometry
    if (lineCoords.length > 0) {
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineCoords, 3));
      lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

      const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
      });

      this.connectingLines = new THREE.LineSegments(lineGeo, lineMat);
      this.group.add(this.connectingLines);
    }

    // 5. Notify DOM callback
    if (this.onSkillHoverCallback) {
      this.onSkillHoverCallback(skillData);
    }
  }

  onSkillHover(callback) {
    this.onSkillHoverCallback = callback;
  }

  update(delta, elapsedTime) {
    if (!this.group.visible) return;

    // 1. Raycast for hover
    this.raycaster.setFromCamera(this.pointer, this.sceneManager.camera);
    const intersects = this.raycaster.intersectObjects(this.skillNodes, false);

    if (intersects.length > 0) {
      this.highlightSkill(intersects[0].object);
      this.sceneManager.canvas.style.cursor = 'pointer';
    } else {
      this.highlightSkill(null);
    }

    // 2. Gentle cloud rotation & floating drift
    this.group.rotation.y = elapsedTime * 0.12;
    this.group.position.y = Math.sin(elapsedTime * 0.7) * 0.15;
  }

  dispose() {
    this.skillNodes.forEach((s) => {
      s.userData.texture.dispose();
      s.material.dispose();
    });
    this.projectAnchors.forEach((a) => {
      a.geometry.dispose();
      a.material.dispose();
    });
    if (this.connectingLines) {
      this.connectingLines.geometry.dispose();
      this.connectingLines.material.dispose();
    }
  }
}
