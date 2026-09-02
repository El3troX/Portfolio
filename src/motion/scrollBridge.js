/**
 * scrollBridge - DOM-measured scroll manager across all portfolio sections.
 * Dynamically measures real section bounding client rects and viewport center crossing
 * to guarantee camera waypoints, scene visibility, and transitions stay perfectly in sync
 * regardless of content height, screen size, or zoom level.
 */
export class ScrollBridge {
  constructor({
    cameraRig,
    neuralSphere,
    particleField,
    experienceRoad,
    skillsCloud,
    vidhanScene,
    valkyrieScene,
    washSaleScene,
    tixRushScene,
    lightTemplateScene,
    aboutSection,
    flagshipSection,
  }) {
    this.cameraRig = cameraRig;
    this.neuralSphere = neuralSphere;
    this.particleField = particleField;
    this.experienceRoad = experienceRoad;
    this.skillsCloud = skillsCloud;
    this.vidhanScene = vidhanScene;
    this.valkyrieScene = valkyrieScene;
    this.washSaleScene = washSaleScene;
    this.tixRushScene = tixRushScene;
    this.lightTemplateScene = lightTemplateScene;
    this.aboutSection = aboutSection;
    this.flagshipSection = flagshipSection;

    this.sceneMap = {
      neuralSphere: this.neuralSphere,
      experienceRoad: this.experienceRoad,
      skillsCloud: this.skillsCloud,
      vidhanScene: this.vidhanScene,
      valkyrieScene: this.valkyrieScene,
      washSaleScene: this.washSaleScene,
      tixRushScene: this.tixRushScene,
      lightTemplateScene: this.lightTemplateScene,
    };

    this.scenes = Object.values(this.sceneMap);

    // Section definitions matching exact DOM IDs and CameraRig waypoint keys
    this.sectionConfigs = [
      { id: 'hero-section', key: 'hero', sceneKey: 'neuralSphere' },
      { id: 'about-section', key: 'about', sceneKey: 'experienceRoad' },
      { id: 'experience-section', key: 'experience', sceneKey: 'experienceRoad' },
      { id: 'skills-section', key: 'skills', sceneKey: 'skillsCloud' },
      { id: 'project-vidhan-ai', key: 'flagship-vidhan', sceneKey: 'vidhanScene' },
      { id: 'project-valkyrie-aml', key: 'flagship-valkyrie', sceneKey: 'valkyrieScene' },
      { id: 'project-wash-sale', key: 'flagship-washsale', sceneKey: 'washSaleScene' },
      { id: 'project-tixrush', key: 'flagship-tixrush', sceneKey: 'tixRushScene' },
      { id: 'projects-standard-strip', key: 'standard-strip', sceneKey: 'lightTemplateScene' },
      { id: 'extras-section', key: 'extras', sceneKey: null },
      { id: 'contact-section', key: 'contact', sceneKey: null },
    ];

    // State tracking
    this.activeSectionIndex = 0;
    this.activeSectionKey = 'hero';
    this.activeSectionId = 'hero-section';
    this.listeners = new Set();

    // One-shot triggers
    this.hasTriggeredNdcg = false;
    this.hasTriggeredValkyrie = false;

    // Intersection ratios map
    this.intersectionRatios = new Map();

    this.init();
  }

  onSectionChange(cb) {
    if (typeof cb === 'function') {
      this.listeners.add(cb);
      // Immediately invoke with initial state
      cb(this.activeSectionKey, this.activeSectionId, 0);
    }
    return () => this.listeners.delete(cb);
  }

  notifyListeners(globalProgress) {
    for (const cb of this.listeners) {
      try {
        cb(this.activeSectionKey, this.activeSectionId, globalProgress);
      } catch (err) {
        console.error('[ScrollBridge] Error in section change listener:', err);
      }
    }
  }

  hideAllScenesExcept(activeScene) {
    this.scenes.forEach((s) => {
      if (s && s.group) {
        s.group.visible = (s === activeScene);
      }
    });
  }

  init() {
    // Setup IntersectionObserver for robust section detection
    const observerOptions = {
      root: null,
      threshold: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1.0],
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        this.intersectionRatios.set(entry.target.id, entry.intersectionRatio);
      });
      this.updateScroll();
    }, observerOptions);

    this.sectionConfigs.forEach((cfg) => {
      const el = document.getElementById(cfg.id);
      if (el) observer.observe(el);
    });

    const onScroll = () => {
      this.updateScroll();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial pass after DOM settle
    requestAnimationFrame(() => this.updateScroll());
  }

  updateScroll() {
    const vh = window.innerHeight;
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportCenter = vh * 0.5;

    // Measure all sections in the DOM
    const measurements = this.sectionConfigs.map((cfg, idx) => {
      const el = document.getElementById(cfg.id);
      if (!el) {
        return { cfg, idx, rect: null, progress: 0, containsCenter: false };
      }
      const rect = el.getBoundingClientRect();
      const containsCenter = rect.top <= viewportCenter && rect.bottom >= viewportCenter;

      let progress = 0;
      if (cfg.key === 'hero') {
        progress = Math.max(0, Math.min(1, scrollY / Math.max(1, rect.height)));
      } else {
        progress = Math.max(0, Math.min(1, (viewportCenter - rect.top) / Math.max(1, rect.height)));
      }

      return { cfg, idx, rect, progress, containsCenter };
    });

    // 1. Determine active section: section containing viewportCenter, or highest intersection ratio
    let activeItem = measurements.find((m) => m.containsCenter);

    if (!activeItem) {
      // Fallback: pick section with highest intersection ratio or closest rect to center
      let maxRatio = -1;
      measurements.forEach((m) => {
        const ratio = this.intersectionRatios.get(m.cfg.id) || 0;
        if (ratio > maxRatio && m.rect) {
          maxRatio = ratio;
          activeItem = m;
        }
      });
    }

    // Default to first section if still not found
    if (!activeItem || !activeItem.rect) {
      activeItem = measurements[0];
    }

    const { cfg: activeCfg, idx: activeIdx, progress: sectionProgress } = activeItem;
    const prevKey = this.activeSectionKey;

    this.activeSectionIndex = activeIdx;
    this.activeSectionKey = activeCfg.key;
    this.activeSectionId = activeCfg.id;

    // 2. Compute Global Progress (0.0 to 1.0)
    const totalSections = this.sectionConfigs.length;
    const globalProgress = Math.max(0, Math.min(1, (activeIdx + sectionProgress) / totalSections));

    // 3. Notify CameraRig with exact DOM-measured values
    this.cameraRig.setScrollState(globalProgress, activeCfg.key, sectionProgress);

    // 4. Update Scene Visibility & Section Effects
    const targetScene = activeCfg.sceneKey ? this.sceneMap[activeCfg.sceneKey] : null;

    if (activeCfg.key === 'hero') {
      this.hideAllScenesExcept(this.neuralSphere);
      this.neuralSphere.group.visible = sectionProgress < 0.98;
      this.neuralSphere.setDissolution(sectionProgress);
      this.particleField.setDiveProgress(sectionProgress);

      if (sectionProgress >= 0.85 && this.aboutSection) {
        this.aboutSection.triggerHeadlineReveal();
      }
    } else {
      this.hideAllScenesExcept(targetScene);
      this.particleField.setDiveProgress(1.0);

      if (activeCfg.key === 'about' && this.aboutSection) {
        this.aboutSection.triggerHeadlineReveal();
      }
    }

    // 5. Fire One-Shot Flagship Animations on section entry
    if (activeCfg.key === 'flagship-vidhan' && !this.hasTriggeredNdcg) {
      this.hasTriggeredNdcg = true;
      if (this.flagshipSection) {
        this.flagshipSection.triggerNdcgAnimation();
      }
    }

    if (activeCfg.key === 'flagship-valkyrie' && !this.hasTriggeredValkyrie) {
      this.hasTriggeredValkyrie = true;
      if (this.valkyrieScene) {
        this.valkyrieScene.startPropagationSequence();
      }
    }

    // 6. Notify Nav & external subscribers
    this.notifyListeners(globalProgress);
  }
}
