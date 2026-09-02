/**
 * scrollBridge - Generic scroll manager across all 10 portfolio sections.
 * Guarantees zero leftover renderer/camera state bleeding across scene transitions.
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

    this.scenes = [
      this.neuralSphere,
      this.experienceRoad,
      this.skillsCloud,
      this.vidhanScene,
      this.valkyrieScene,
      this.washSaleScene,
      this.tixRushScene,
      this.lightTemplateScene,
    ];

    this.init();
  }

  hideAllScenesExcept(activeScene) {
    this.scenes.forEach((s) => {
      if (s && s.group) {
        s.group.visible = (s === activeScene);
      }
    });
  }

  init() {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const vh = window.innerHeight;

      if (scrollY <= vh * 1.0) {
        // --- 1. HERO ---
        const heroProgress = Math.min(1.0, Math.max(0.0, scrollY / (vh * 1.0)));
        this.cameraRig.setScrollState(0, 'hero', heroProgress);

        this.hideAllScenesExcept(this.neuralSphere);
        this.neuralSphere.group.visible = heroProgress < 0.98;
        this.neuralSphere.setDissolution(heroProgress);
        this.particleField.setDiveProgress(heroProgress);

        if (heroProgress >= 0.85 && this.aboutSection) {
          this.aboutSection.triggerHeadlineReveal();
        }

      } else if (scrollY > vh * 1.0 && scrollY <= vh * 2.0) {
        // --- 2. ABOUT ---
        const aboutProgress = Math.min(1.0, Math.max(0.0, (scrollY - vh * 1.0) / (vh * 1.0)));
        this.cameraRig.setScrollState(0.1, 'about', aboutProgress);

        this.hideAllScenesExcept(this.experienceRoad);
        this.particleField.setDiveProgress(1.0);

        if (this.aboutSection) {
          this.aboutSection.triggerHeadlineReveal();
        }

      } else if (scrollY > vh * 2.0 && scrollY <= vh * 3.2) {
        // --- 3. EXPERIENCE ROAD ---
        const expProgress = Math.min(1.0, Math.max(0.0, (scrollY - vh * 2.0) / (vh * 1.2)));
        this.cameraRig.setScrollState(0.2, 'experience', expProgress);

        this.hideAllScenesExcept(this.experienceRoad);

      } else if (scrollY > vh * 3.2 && scrollY <= vh * 4.4) {
        // --- 4. SKILLS CLOUD ---
        const skillsProgress = Math.min(1.0, Math.max(0.0, (scrollY - vh * 3.2) / (vh * 1.2)));
        this.cameraRig.setScrollState(0.3, 'skills', skillsProgress);

        this.hideAllScenesExcept(this.skillsCloud);

      } else if (scrollY > vh * 4.4 && scrollY <= vh * 5.6) {
        // --- 5. FLAGSHIP 01: VIDHAN-AI ---
        const vProgress = Math.min(1.0, Math.max(0.0, (scrollY - vh * 4.4) / (vh * 1.2)));
        this.cameraRig.setScrollState(0.4, 'flagship-vidhan', vProgress);

        this.hideAllScenesExcept(this.vidhanScene);
        if (this.flagshipSection) {
          this.flagshipSection.triggerNdcgAnimation();
        }

      } else if (scrollY > vh * 5.6 && scrollY <= vh * 6.8) {
        // --- 6. FLAGSHIP 02: VALKYRIE-AML ---
        const valkProgress = Math.min(1.0, Math.max(0.0, (scrollY - vh * 5.6) / (vh * 1.2)));
        this.cameraRig.setScrollState(0.5, 'flagship-valkyrie', valkProgress);

        this.hideAllScenesExcept(this.valkyrieScene);
        if (this.valkyrieScene && !this.valkyrieScene.hasPropagated) {
          this.valkyrieScene.startPropagationSequence();
        }

      } else if (scrollY > vh * 6.8 && scrollY <= vh * 8.0) {
        // --- 7. FLAGSHIP 03: WASH SALE AUDITOR ---
        const wsProgress = Math.min(1.0, Math.max(0.0, (scrollY - vh * 6.8) / (vh * 1.2)));
        this.cameraRig.setScrollState(0.6, 'flagship-washsale', wsProgress);

        this.hideAllScenesExcept(this.washSaleScene);

      } else if (scrollY > vh * 8.0 && scrollY <= vh * 9.2) {
        // --- 8. FLAGSHIP 04: TIXRUSH ---
        const tixProgress = Math.min(1.0, Math.max(0.0, (scrollY - vh * 8.0) / (vh * 1.2)));
        this.cameraRig.setScrollState(0.7, 'flagship-tixrush', tixProgress);

        this.hideAllScenesExcept(this.tixRushScene);

      } else if (scrollY > vh * 9.2 && scrollY <= vh * 10.4) {
        // --- 9. STANDARD PROJECT STRIP ---
        const stripProgress = Math.min(1.0, Math.max(0.0, (scrollY - vh * 9.2) / (vh * 1.2)));
        this.cameraRig.setScrollState(0.8, 'standard-strip', stripProgress);

        this.hideAllScenesExcept(this.lightTemplateScene);

      } else if (scrollY > vh * 10.4 && scrollY <= vh * 11.4) {
        // --- 10. EXTRAS (HONORS & CERTIFICATIONS) ---
        const extrasProgress = Math.min(1.0, Math.max(0.0, (scrollY - vh * 10.4) / (vh * 1.0)));
        this.cameraRig.setScrollState(0.9, 'extras', extrasProgress);

        this.hideAllScenesExcept(null);
        this.particleField.setDiveProgress(1.0);

      } else {
        // --- 11. CONTACT TERMINAL ---
        const contactProgress = Math.min(1.0, Math.max(0.0, (scrollY - vh * 11.4) / (vh * 1.0)));
        this.cameraRig.setScrollState(1.0, 'contact', contactProgress);

        this.hideAllScenesExcept(null);
        this.particleField.setDiveProgress(1.0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }
}
