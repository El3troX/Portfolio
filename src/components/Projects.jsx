import { useEffect, useRef, useCallback } from 'react';
import './Projects.css';

const PROJECTS = [
  {
    id: 1,
    name: 'MarketPulse',
    subtitle: 'NIFTY-50 Stock Forecasting Framework',
    impact: '~12% MAPE on 30-day forecasts across 4 models with 6-fold cross-validation',
    details:
      'Ingested 5+ years of historical data (~1,250 trading sessions) to build and benchmark ARIMA, SARIMA, ETS, and GARCH models for NIFTY-50 index prediction.',
    tech: ['R', 'ARIMA', 'SARIMA', 'ETS', 'GARCH', 'Time-Series'],
    date: 'May 2026',
    github: 'https://github.com/El3troX',
    color: 'var(--neon-lime)',
  },
  {
    id: 2,
    name: 'Vidhan AI',
    subtitle: 'Legal RAG Assistant',
    impact: '87% retrieval precision on 50-query legal benchmark, <3s per query',
    details:
      'Indexed 200+ statutory documents (~3,000 pages) covering the Constitution, BNS, and BNSS using a Retrieval-Augmented Generation pipeline powered by LangChain and Google Generative AI.',
    tech: ['RAG', 'LLMs', 'LangChain', 'Google Gen AI'],
    date: 'Mar 2026',
    github: 'https://github.com/El3troX',
    color: 'var(--neon-pink)',
  },
  {
    id: 3,
    name: 'AI Agent Framework',
    subtitle: 'Financial Research Automation',
    impact: 'Slashed research time from ~5 hours to under 4 minutes per report',
    details:
      'Multi-agent pipeline across 20+ companies, aggregating 6 sources via LangGraph orchestration with Firecrawl and Serper API for automated financial analysis.',
    tech: ['LangGraph', 'LangChain', 'Firecrawl', 'Serper API'],
    date: 'Jun 2025',
    github: 'https://github.com/El3troX',
    color: 'var(--neon-blue)',
  },
  {
    id: 4,
    name: 'Multimodal AI Assistant',
    subtitle: 'Vision + Text + Audio Processing',
    impact: '3-modality support with <2s end-to-end latency',
    details:
      'Processes images up to 12MP with visual response under 800ms. Built with Streamlit and Google Gemini API, supporting real-time image analysis via OpenCV and Pillow.',
    tech: ['Streamlit', 'Gemini API', 'OpenCV', 'Pillow'],
    date: 'Dec 2025',
    github: 'https://github.com/El3troX',
    color: 'var(--acid-yellow)',
  },
  {
    id: 5,
    name: 'BlogIT',
    subtitle: 'AI-Powered Blogging Platform',
    impact: '120+ users, <200ms API response, 99.8% uptime',
    details:
      'Full-stack blogging platform with AI-assisted drafting that reduced post creation time by ~60%. Features real-time collaboration with Firebase and a RESTful Express backend.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Firebase'],
    date: 'Jun 2025',
    github: 'https://github.com/El3troX',
    color: 'var(--deep-violet)',
  },
  {
    id: 6,
    name: 'AWS Serverless Event Booking',
    subtitle: 'Cloud-Native Booking System',
    impact: '500+ concurrent bookings, <400ms cold-start, 99.5% success rate',
    details:
      'Achieved 40% cost reduction vs EC2 with a 6-step Step Functions workflow. Fully serverless architecture using Lambda, API Gateway, DynamoDB, and Cognito auth.',
    tech: ['AWS Lambda', 'API Gateway', 'DynamoDB', 'Step Functions', 'Cognito'],
    date: 'Nov 2024',
    github: 'https://github.com/El3troX',
    color: 'var(--electric-cyan)',
  },
  {
    id: 7,
    name: 'BUSIT',
    subtitle: 'Bus Credit System',
    impact: '300+ user accounts, <150ms transaction validation',
    details:
      'Handles 5 transaction types across 8 normalized MySQL tables. Built as a lightweight, performant credit management system for campus bus services.',
    tech: ['HTML', 'CSS', 'JavaScript', 'MySQL'],
    date: 'Sept 2024',
    github: 'https://github.com/El3troX',
    color: 'var(--neon-lime)',
  },
];

function ProjectCard({ project, index }) {
  const wrapperRef = useRef(null);
  const cardRef = useRef(null);
  const isMobile = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      isMobile.current = window.innerWidth <= 768 || window.matchMedia("(pointer: coarse)").matches;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            wrapper.style.transitionDelay = `${index * 0.08}s`;
            wrapper.classList.add('projects__card-wrapper--visible');
            observer.unobserve(wrapper);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [index]);

  const handleMouseMove = useCallback((e) => {
    if (isMobile.current) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const wrapper = wrapperRef.current;
    const card = cardRef.current;
    if (!wrapper || !card) return;

    const rect = wrapper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);

    const rotateY = offsetX * 10;
    const rotateX = -offsetY * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = '';
  }, []);

  const paddedIndex = String(index + 1).padStart(2, '0');
  const isLarge = index < 2;
  const rotation = index % 2 === 0 ? 'projects__card-wrapper--rot-neg' : 'projects__card-wrapper--rot-pos';

  return (
    <div
      ref={wrapperRef}
      className={`projects__card-wrapper ${isLarge ? 'projects__card-wrapper--large' : ''} ${rotation}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <article
        ref={cardRef}
        className="projects__card"
        style={{ '--card-accent': project.color }}
      >
        <span className="projects__card-number" aria-hidden="true">
          {paddedIndex}
        </span>

        <header className="projects__card-header">
          <h3 className="projects__card-title">{project.name}</h3>
          <span className="projects__card-subtitle">{project.subtitle}</span>
        </header>

        <p className="projects__card-impact">{project.impact}</p>

        <p className="projects__card-details">{project.details}</p>

        <div className="projects__card-tags">
          {project.tech.map((tag) => (
            <span key={tag} className="projects__tag">
              {tag}
            </span>
          ))}
        </div>

        <footer className="projects__card-footer">
          <time className="projects__card-date">{project.date}</time>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="projects__github-link"
            aria-label={`View ${project.name} on GitHub`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
        </footer>
      </article>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="projects">
      <h2 className="projects__title">
        <span className="projects__title-accent">PROJ</span>ECTS
      </h2>

      <div className="projects__grid">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
