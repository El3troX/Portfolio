import { SceneManager } from './scene/SceneManager.js';
import { loadPortfolio } from './data/loadPortfolio.js';
import { NeuralSphere } from './scene/NeuralSphere.js';
import { ParticleField } from './scene/ParticleField.js';
import { ExperienceRoad } from './scene/ExperienceRoad.js';
import { SkillsCloud } from './scene/SkillsCloud.js';
import { VidhanAIScene } from './scene/projects/VidhanAIScene.js';
import { ValkyrieAMLScene } from './scene/projects/ValkyrieAMLScene.js';
import { WashSaleScene } from './scene/projects/WashSaleScene.js';
import { TixRushScene } from './scene/projects/TixRushScene.js';
import { LightTemplateScene } from './scene/projects/LightTemplateScene.js';
import { CameraRig } from './camera/CameraRig.js';
import { ScrollBridge } from './motion/scrollBridge.js';
import { LoadingScreen } from './ui/loading.js';
import { CustomCursor } from './ui/cursor.js';
import { SudoEasterEgg } from './easterEgg/sudo.js';
import { NavigationBar } from './ui/nav.js';
import { HeroSection } from './ui/sections/Hero.js';
import { AboutSection } from './ui/sections/About.js';
import { ExperienceSection } from './ui/sections/Experience.js';
import { SkillsSection } from './ui/sections/Skills.js';
import { ProjectsFlagshipSection } from './ui/sections/ProjectsFlagship.js';
import { ProjectsStripSection } from './ui/sections/ProjectsStrip.js';
import { ExtrasSection } from './ui/sections/Extras.js';
import { ContactSection } from './ui/sections/Contact.js';

async function bootstrap() {
  const canvas = document.getElementById('webgl-canvas');
  const appContainer = document.getElementById('app');

  // 1. Loading sequence
  const loadingScreen = new LoadingScreen();

  // 2. Custom particle trail cursor (desktop only)
  new CustomCursor();

  // 3. Sudo terminal easter egg listener
  new SudoEasterEgg();

  const loadTask = (async () => {
    // 4. Initialize Single SceneManager (Renderer, Camera, Loop)
    const sceneManager = new SceneManager(canvas);

    // 5. Ambient Particle Field (Background)
    const particleField = new ParticleField();
    sceneManager.scene.add(particleField.group);

    // 6. Fetch and validate portfolio data
    const portfolio = await loadPortfolio();

    // Persistent Navigation HUD mounted directly to document.body
    const navBar = new NavigationBar(portfolio);

    // 7. Hero NeuralSphere
    const neuralSphere = new NeuralSphere(portfolio);
    sceneManager.scene.add(neuralSphere.group);

    // 8. Experience Glowing Road (Waypoints: Mahindra & Mahindra, EY GDS)
    const experienceRoad = new ExperienceRoad();
    experienceRoad.group.visible = false;
    sceneManager.scene.add(experienceRoad.group);

    // 9. Skills 3D Floating Cloud
    const skillsCloud = new SkillsCloud(sceneManager, portfolio);
    skillsCloud.group.visible = false;
    sceneManager.scene.add(skillsCloud.group);

    // 10. Flagship 01: Vidhan-AI Scene
    const vidhanScene = new VidhanAIScene(sceneManager);
    vidhanScene.group.visible = false;
    sceneManager.scene.add(vidhanScene.group);

    // 11. Flagship 02: Valkyrie-AML Scene
    const valkyrieScene = new ValkyrieAMLScene(sceneManager);
    valkyrieScene.group.visible = false;
    sceneManager.scene.add(valkyrieScene.group);

    // 12. Flagship 03: Wash Sale Auditor Scene
    const washSaleScene = new WashSaleScene(sceneManager);
    washSaleScene.group.visible = false;
    sceneManager.scene.add(washSaleScene.group);

    // 13. Flagship 04: TixRush Scene
    const tixRushScene = new TixRushScene(sceneManager);
    tixRushScene.group.visible = false;
    sceneManager.scene.add(tixRushScene.group);

    // 14. Standard Projects Shared 3D Template Scene (Rotating Low-Poly Icosahedron)
    const lightTemplateScene = new LightTemplateScene(sceneManager);
    lightTemplateScene.group.visible = false;
    sceneManager.scene.add(lightTemplateScene.group);

    // 15. Camera Rig State Machine
    const cameraRig = new CameraRig(sceneManager.camera);

    // 16. Mount All UI Sections in Sequential Order into DOM
    appContainer.innerHTML = '';
    const heroSection = new HeroSection(appContainer);
    const aboutSection = new AboutSection(appContainer, portfolio);
    const experienceSection = new ExperienceSection(appContainer, portfolio);
    const skillsSection = new SkillsSection(appContainer, portfolio, skillsCloud);
    const flagshipSection = new ProjectsFlagshipSection(appContainer, portfolio, {
      vidhanScene,
      valkyrieScene,
      washSaleScene,
      tixRushScene,
    });
    const stripSection = new ProjectsStripSection(appContainer, portfolio, lightTemplateScene);
    const extrasSection = new ExtrasSection(appContainer, portfolio);
    const contactSection = new ContactSection(appContainer, portfolio);

    // 17. Wire 3D Skills Hover to HUD Cross-Reference Inspector
    skillsCloud.onSkillHover((skillData) => {
      skillsSection.updateHUD(skillData);
    });

    // 18. Wire 3D Valkyrie Node Click to SHAP Inspector
    valkyrieScene.onNodeSelected((nodeData, shapFeatures) => {
      flagshipSection.updateInspector(nodeData, shapFeatures);
    });

    // 19. Wire Global ScrollBridge
    const scrollBridge = new ScrollBridge({
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
    });

    // Connect ScrollBridge active section & scroll progress to NavigationBar HUD
    scrollBridge.onSectionChange((sectionKey, sectionId, globalProgress) => {
      navBar.updateActiveSection(sectionKey, globalProgress);
    });


    // 20. Register 60fps render loop updates
    sceneManager.registerUpdate((delta, elapsedTime) => {
      if (neuralSphere.group.visible) {
        neuralSphere.update(delta, elapsedTime);
      }
      particleField.update(delta, elapsedTime);
      if (experienceRoad.group.visible) {
        experienceRoad.update(delta, elapsedTime, sceneManager.camera.position);
      }
      if (skillsCloud.group.visible) {
        skillsCloud.update(delta, elapsedTime);
      }
      if (vidhanScene.group.visible) {
        vidhanScene.update(delta, elapsedTime);
      }
      if (valkyrieScene.group.visible) {
        valkyrieScene.update(delta, elapsedTime);
      }
      if (washSaleScene.group.visible) {
        washSaleScene.update(delta, elapsedTime);
      }
      if (tixRushScene.group.visible) {
        tixRushScene.update(delta, elapsedTime);
      }
      if (lightTemplateScene.group.visible) {
        lightTemplateScene.update(delta, elapsedTime);
      }
      cameraRig.update(delta);
    });

    return { sceneManager, portfolio };
  })();

  // Track progress and finish
  await loadingScreen.trackLoad(loadTask, () => {
    console.log('[NeuralCore] Phase 7 — Mobile, Reduced-Motion, Cursor, and Easter Egg Live.');
  });
}

// Start application
window.addEventListener('DOMContentLoaded', bootstrap);
