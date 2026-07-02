import { useEffect, useRef } from 'react';
import './Contact.css';

const MARQUEE_TEXT =
  'DIVYAM PANDEY \u2022 AI/ML ENGINEER \u2022 FULL-STACK DEV \u2022 BUILD BREAK REPEAT \u2022 ';

const SOCIALS = [
  {
    name: 'GitHub',
    href: 'https://github.com/El3troX',
    modifier: 'github',
    label: 'GitHub profile',
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/divyam-pandey-231449202',
    modifier: 'linkedin',
    label: 'LinkedIn profile',
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'Email',
    href: 'mailto:divyampandey845@gmail.com',
    modifier: 'email',
    label: 'Send email',
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M1.5 4.5A1.5 1.5 0 013 3h18a1.5 1.5 0 011.5 1.5v.667l-10.5 7-10.5-7V4.5zm0 2.833l10.125 6.75a.75.75 0 00.75 0L22.5 7.333V19.5A1.5 1.5 0 0121 21H3a1.5 1.5 0 01-1.5-1.5V7.333z" />
      </svg>
    ),
  },
  {
    name: 'Phone',
    href: 'tel:+919479865784',
    modifier: 'phone',
    label: 'Call (+91) 94798 65784',
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1.003 1.003 0 011.01-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
      </svg>
    ),
  },
];

export default function Contact() {
  const headlineRef = useRef(null);
  const socialsRef = useRef(null);

  useEffect(() => {
    /* Check for reduced-motion preference */
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced) {
      /* Show everything immediately */
      if (headlineRef.current) {
        headlineRef.current.classList.add('is-visible');
      }
      if (socialsRef.current) {
        socialsRef.current.querySelectorAll('.social-icon-link').forEach((el) => {
          el.classList.add('is-visible');
        });
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const target = entry.target;

          /* Headline fade-in */
          if (target === headlineRef.current) {
            target.classList.add('is-visible');
            observer.unobserve(target);
          }

          /* Stagger social icons */
          if (target === socialsRef.current) {
            const icons = target.querySelectorAll('.social-icon-link');
            icons.forEach((icon, i) => {
              setTimeout(() => {
                icon.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s cubic-bezier(0.175,0.885,0.32,1.275) ${i * 0.1}s, background 0.3s cubic-bezier(0.175,0.885,0.32,1.275), box-shadow 0.3s ease, border-color 0.3s ease`;
                icon.classList.add('is-visible');
              }, 0);
            });
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (headlineRef.current) observer.observe(headlineRef.current);
    if (socialsRef.current) observer.observe(socialsRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" className="contact-section">
      {/* ---- CTA Area ---- */}
      <div className="contact-cta">
        <div className="contact-headline" ref={headlineRef}>
          <h2>
            Let&rsquo;s cause some{' '}
            <span className="chaos-word">chaos</span> together
          </h2>
        </div>

        <p className="contact-subtext">
          Got a project idea? Want to collaborate on something insane? Hit me up.
        </p>

        <a
          href="mailto:divyampandey845@gmail.com"
          className="contact-email-cta"
        >
          divyampandey845@gmail.com
        </a>

        <span className="contact-location-badge" aria-label="Location">
          📍 VIT Vellore, India
        </span>

        {/* Social icons */}
        <nav className="contact-socials" ref={socialsRef} aria-label="Social links">
          {SOCIALS.map((s) => (
            <a
              key={s.modifier}
              href={s.href}
              className={`social-icon-link social-icon-link--${s.modifier}`}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={s.label}
            >
              {s.icon}
            </a>
          ))}
        </nav>
      </div>

      {/* ---- Marquee Footer ---- */}
      <div className="marquee-footer" role="marquee" aria-label="Scrolling banner">
        <div className="marquee-track">
          {/* Duplicate content for seamless loop */}
          <span className="marquee-content">{MARQUEE_TEXT.repeat(6)}</span>
          <span className="marquee-content">{MARQUEE_TEXT.repeat(6)}</span>
        </div>
      </div>

      {/* ---- Copyright ---- */}
      <footer className="contact-copyright">
        <small>&copy; 2025 Divyam Pandey. Designed with controlled chaos.</small>
      </footer>
    </section>
  );
}
