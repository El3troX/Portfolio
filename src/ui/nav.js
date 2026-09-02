/**
 * Persistent Glassmorphic Navigation HUD & Status Bar.
 * Mounted directly to document.body per Phase 8 specification.
 * Features:
 * - Brand wordmark + pulsing status indicator
 * - Smooth scroll jump links with active scroll-spy state
 * - Direct GitHub, LinkedIn, and Resume links from portfolio.json data
 * - Real-time glowing scroll progress indicator
 */
export class NavigationBar {
  constructor(portfolioData) {
    this.portfolio = portfolioData || {};
    this.meta = this.portfolio.meta || {};
    this.element = null;
    this.progressBar = null;
    this.navLinks = [];

    this.render();
  }

  render() {
    // Prevent duplicate nav instances
    const existing = document.getElementById('neural-nav-hud');
    if (existing) existing.remove();

    this.element = document.createElement('header');
    this.element.id = 'neural-nav-hud';
    this.element.className = 'nav-hud';

    const githubUrl = this.meta.github || 'https://github.com/El3troX';
    const linkedinUrl = this.meta.linkedin || 'https://linkedin.com/in/divyam-pandey';
    const resumeUrl = this.meta.resume || 'https://drive.google.com/file/d/1y676-e_L9wBw1uU72Nn9e54K4m8YqV_g/view?usp=sharing';

    this.element.innerHTML = `
      <div class="nav-brand">
        <a href="#hero-section" class="nav-brand-title" style="text-decoration: none; color: inherit;">
          DP // NEURAL CORE
        </a>
        <div class="nav-brand-status">
          <span class="pulse-dot"></span>
          <span>AVAILABLE FOR ROLES</span>
        </div>
      </div>

      <nav class="nav-links" aria-label="Main Navigation">
        <a href="#about-section" class="nav-link-pill" data-target="about">01 About</a>
        <a href="#experience-section" class="nav-link-pill" data-target="experience">02 Experience</a>
        <a href="#skills-section" class="nav-link-pill" data-target="skills">03 Skills</a>
        <a href="#project-vidhan-ai" class="nav-link-pill" data-target="flagship">04 Flagships</a>
        <a href="#projects-standard-strip" class="nav-link-pill" data-target="archive">05 Archive</a>
        <a href="#contact-section" class="nav-link-pill" data-target="contact">06 Contact</a>
      </nav>

      <div class="nav-actions">
        <a href="${githubUrl}" target="_blank" rel="noopener noreferrer" class="nav-icon-link" aria-label="GitHub Profile" title="GitHub">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>

        <a href="${linkedinUrl}" target="_blank" rel="noopener noreferrer" class="nav-icon-link" aria-label="LinkedIn Profile" title="LinkedIn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </a>

        <a href="${resumeUrl}" target="_blank" rel="noopener noreferrer" class="nav-btn nav-btn--primary" title="View Resume">
          <span>Resume</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 17l9.2-9.2M17 17V7H7"/>
          </svg>
        </a>
      </div>

      <div class="nav-progress-track">
        <div class="nav-progress-bar" id="nav-scroll-progress"></div>
      </div>
    `;

    document.body.appendChild(this.element);

    this.progressBar = this.element.querySelector('#nav-scroll-progress');
    this.navLinks = Array.from(this.element.querySelectorAll('.nav-link-pill'));

    // Smooth click handler
    this.navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').replace('#', '');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  updateActiveSection(sectionKey, globalProgress) {
    if (this.progressBar && typeof globalProgress === 'number') {
      const pct = Math.max(0, Math.min(100, globalProgress * 100));
      this.progressBar.style.width = `${pct}%`;
    }

    // Map active scene/section key to nav category
    let targetCategory = null;
    if (sectionKey === 'about') targetCategory = 'about';
    else if (sectionKey === 'experience') targetCategory = 'experience';
    else if (sectionKey === 'skills') targetCategory = 'skills';
    else if (sectionKey && sectionKey.startsWith('flagship')) targetCategory = 'flagship';
    else if (sectionKey === 'standard-strip' || sectionKey === 'extras') targetCategory = 'archive';
    else if (sectionKey === 'contact') targetCategory = 'contact';

    this.navLinks.forEach((link) => {
      const match = link.getAttribute('data-target') === targetCategory;
      if (match) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}
