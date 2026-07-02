import { useEffect, useRef, useState } from 'react';
import './Experience.css';

/**
 * Highlights known technical terms in a text string with <span class="tech-highlight">.
 */
const TECH_TERMS = [
  'AI', 'Machine Learning', 'Deep Learning', 'NLP', 'RAG', 'Graph RAG',
  'Advanced RAG', 'LLM', 'LangChain', 'LangGraph', 'vector embeddings',
  'speech-to-text', 'Model Context Protocol', 'MCP', 'n8n',
  'retrieval pipelines', 'knowledge-grounded AI', 'multimodal',
  'distributed systems', 'enterprise AI',
];

function highlightTech(text) {
  // Sort longest first so "Advanced RAG" matches before "RAG"
  const sorted = [...TECH_TERMS].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'g');

  const parts = text.split(regex);
  return parts.map((part, i) => {
    if (sorted.some((t) => t === part)) {
      return (
        <span key={i} className="tech-highlight">
          {part}
        </span>
      );
    }
    return part;
  });
}

/* ---- Data ---- */
const experiences = [
  {
    date: 'June 2026 – Aug 2026',
    role: 'Intern',
    company: 'Ernst & Young Global Delivery Service (EY GDS)',
    location: 'Kochi, Kerala',
    bullets: [
      'Underwent intensive training in AI, Machine Learning, Deep Learning, NLP, RAG, Graph RAG, and Advanced RAG techniques for enterprise AI applications.',
      'Gained hands-on exposure to enterprise-scale software architectures, distributed systems, and globally scalable business solutions.',
      'Investigated modern LLM application patterns, retrieval pipelines, and knowledge-grounded AI systems used in production environments.',
    ],
  },
  {
    date: 'June 2025 – July 2025',
    role: 'AI Intern',
    company: 'Mahindra & Mahindra',
    location: 'Mumbai, Maharashtra',
    bullets: [
      'Engineered a RAG pipeline using LangChain and vector embeddings to enhance contextual response quality in enterprise chatbots.',
      'Designed stateful AI workflows using LangGraph enabling multi-step reasoning, tool-calling, and memory retention.',
      'Built a multimodal conversational system integrating speech-to-text processing with contextual LLM responses.',
      'Integrated Model Context Protocol (MCP) for secure tool orchestration and external API interaction.',
      'Automated enterprise workflows using n8n, reducing manual task execution.',
    ],
  },
];

const education = {
  date: 'Aug 2023 – Present',
  degree: 'B.Tech CSE (Data Science)',
  institution: 'VIT Vellore',
  cgpa: 9.09,
  cgpaMax: 10,
};

const certifications = [
  { name: 'MERN_Stack_Development_Ethnus_2025' },
  { name: 'ML_Specialization_Coursera_AndrewNg_2025' },
];

/* ---- Mini Ghost Sprite ---- */
function MiniGhost({ color }) {
  return (
    <svg viewBox="0 0 100 100" className="mini-ghost-sprite" aria-hidden="true">
      <path d="M 20,50 A 30,30 0 0,1 80,50 L 80,95 L 70,85 L 60,95 L 50,85 L 40,95 L 30,85 L 20,95 Z" fill={color} />
      <ellipse cx="40" cy="45" rx="8" ry="12" fill="#fff" />
      <ellipse cx="60" cy="45" rx="8" ry="12" fill="#fff" />
      <circle cx="40" cy="48" r="4" fill="#0a0a0a" />
      <circle cx="60" cy="48" r="4" fill="#0a0a0a" />
    </svg>
  );
}

/* ---- CGPA Bar Builder (Maximalist Pac-Man Style) ---- */
function buildCgpaBar(cgpa, max, ghostRef, pupilOffset) {
  const percent = (cgpa / max) * 100;
  const pos = Math.max(0, Math.min(20, Math.round((percent / 100) * 20)));
  
  // Alternate mouth based on position for a chomping effect
  const isMouthOpen = pos % 2 === 0;
  
  // Custom SVG Pac-Man Sprite with an eye
  const pacmanSvg = isMouthOpen ? (
    <svg viewBox="0 0 100 100" className="pacman-sprite" aria-hidden="true">
      <path d="M50,50 L93.3,25 A50,50 0 1,0 93.3,75 Z" fill="var(--acid-yellow, #ffe500)" />
      <circle cx="55" cy="25" r="6" fill="#0a0a0a" />
    </svg>
  ) : (
    <svg viewBox="0 0 100 100" className="pacman-sprite" aria-hidden="true">
      <circle cx="50" cy="50" r="50" fill="var(--acid-yellow, #ffe500)" />
      <line x1="50" y1="50" x2="100" y2="50" stroke="#0a0a0a" strokeWidth="4" />
      <circle cx="55" cy="25" r="6" fill="#0a0a0a" />
    </svg>
  );

  // SVG Ghost Sprite at the end (Ghost King)
  const ghostSvg = (
    <svg viewBox="0 0 100 100" className="ghost-sprite" ref={ghostRef} aria-hidden="true" style={{ overflow: 'visible' }}>
      {/* Crown */}
      <path d="M 30,22 L 25,0 L 40,12 L 50,-5 L 60,12 L 75,0 L 70,22 Z" fill="var(--acid-yellow, #ffe500)" />
      <circle cx="25" cy="0" r="3" fill="var(--neon-pink, #ff2d6b)" />
      <circle cx="50" cy="-5" r="3" fill="var(--neon-pink, #ff2d6b)" />
      <circle cx="75" cy="0" r="3" fill="var(--neon-pink, #ff2d6b)" />

      {/* Ghost Body */}
      <path d="M 20,50 A 30,30 0 0,1 80,50 L 80,95 L 70,85 L 60,95 L 50,85 L 40,95 L 30,85 L 20,95 Z" fill="var(--electric-cyan, #00e5ff)" />
      {/* Whites of eyes */}
      <ellipse cx="40" cy="45" rx="8" ry="12" fill="#fff" />
      <ellipse cx="60" cy="45" rx="8" ry="12" fill="#fff" />
      {/* Pupils (offset by mouse position) */}
      <g style={{ transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)` }}>
        <circle cx="40" cy="48" r="4" fill="#0a0a0a" />
        <circle cx="60" cy="48" r="4" fill="#0a0a0a" />
      </g>
    </svg>
  );
  
  const elements = [];
  
  // 1. Filled path
  for (let i = 0; i < pos; i++) {
    elements.push(<span key={`filled-${i}`} className="cgpa-bar-filled">█</span>);
  }
  
  // 2. Pac-Man
  elements.push(<span key="pacman" className="cgpa-bar-pacman">{pacmanSvg}</span>);
  
  // 3. Remaining path with ghosts and dots
  for (let i = pos; i < 20; i++) {
    if (i === 5) {
      // 3.0 CGPA
      elements.push(<span key={`ghost-${i}`} className="cgpa-bar-empty"><MiniGhost color="var(--neon-blue, #3d5afe)" /></span>);
    } else if (i === 11) {
      // 6.0 CGPA
      elements.push(<span key={`ghost-${i}`} className="cgpa-bar-empty"><MiniGhost color="var(--neon-lime, #b8ff00)" /></span>);
    } else if (i === 17) {
      // 9.0 CGPA
      elements.push(<span key={`ghost-${i}`} className="cgpa-bar-empty"><MiniGhost color="var(--neon-pink, #ff2d6b)" /></span>);
    } else {
      // Normal dot
      elements.push(<span key={`dot-${i}`} className="cgpa-bar-empty">•</span>);
    }
  }
  
  return (
    <>
      {elements}
      <span className="cgpa-bar-ghost">{ghostSvg}</span>
    </>
  );
}

/* ---- Component ---- */
export default function Experience() {
  const sectionRef = useRef(null);
  const ghostRef = useRef(null);
  const [displayCgpa, setDisplayCgpa] = useState(0);
  const [hasStartedLoading, setHasStartedLoading] = useState(false);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });

  // Mouse tracking for the ghost eyes
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ghostRef.current) return;
      const rect = ghostRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      
      const angle = Math.atan2(dy, dx);
      // Max pupil movement radius is ~4px to stay inside the whites
      const distance = Math.min(4, Math.sqrt(dx * dx + dy * dy) / 30);
      
      setPupilOffset({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const entries = section.querySelectorAll('.log-entry');
    const observer = new IntersectionObserver(
      (observed) => {
        observed.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('log-entry--visible');
            
            // If this is the education entry, trigger the loading bar
            if (entry.target.classList.contains('edu-entry') && !hasStartedLoading) {
              setHasStartedLoading(true);
            }
            
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    entries.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [hasStartedLoading]);

  // Loading bar animation effect
  useEffect(() => {
    if (!hasStartedLoading) return;
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayCgpa(education.cgpa);
      return;
    }

    let current = 0;
    const target = education.cgpa;
    const duration = 3000; // 3.0s loading time for slower, visible animation
    const fps = 60;
    const steps = duration / (1000 / fps);
    const increment = target / steps;
    
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayCgpa(target);
        clearInterval(interval);
      } else {
        setDisplayCgpa(current);
      }
    }, 1000 / fps);
    
    return () => clearInterval(interval);
  }, [hasStartedLoading]);

  const cgpaBar = buildCgpaBar(displayCgpa, education.cgpaMax, ghostRef, pupilOffset);
  const cgpaPercent = ((displayCgpa / education.cgpaMax) * 100).toFixed(1);

  return (
    <section id="experience" className="experience-section" ref={sectionRef}>
      <h2 className="experience-title">
        <span className="experience-title-accent">EXP</span>ERIENCE
      </h2>

      <div className="terminal-window" role="region" aria-label="Career experience terminal">
        {/* Header */}
        <div className="terminal-header" aria-hidden="true">
          <div className="terminal-dots">
            <span className="terminal-dot terminal-dot--red" />
            <span className="terminal-dot terminal-dot--yellow" />
            <span className="terminal-dot terminal-dot--green" />
          </div>
          <span className="terminal-header-title">
            divyam@portfolio:~$ cat career.log
          </span>
        </div>

        {/* Body */}
        <div className="terminal-body">
          {/* Experience Entries */}
          {experiences.map((exp, idx) => (
            <div className="log-entry exp-entry" key={idx}>
              <div className="exp-header">
                <span className="exp-prompt">&gt; </span>
                <span className="exp-date">[{exp.date}]</span>{' '}
                <span className="exp-role">{exp.role}</span>{' '}
                <span className="exp-company">@ {exp.company}</span>
              </div>

              <div className="exp-location">
                <span className="tree-char">└─ </span>
                <span className="exp-location-text">{exp.location}</span>
              </div>

              <div className="exp-separator">
                <span className="tree-char">│</span>
              </div>

              <ul className="exp-bullets">
                {exp.bullets.map((bullet, bIdx) => {
                  const isLast = bIdx === exp.bullets.length - 1;
                  return (
                    <li className="exp-bullet" key={bIdx}>
                      <span className="tree-char">
                        {isLast ? '└─ ' : '├─ '}
                      </span>
                      {highlightTech(bullet)}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <hr className="terminal-divider" />

          {/* Education */}
          <div className="log-entry edu-entry">
            <div className="edu-header">
              <span className="exp-prompt">&gt; </span>
              <span className="exp-date">[{education.date}]</span>{' '}
              <span className="exp-company">{education.degree}</span>{' '}
              <span className="exp-role">@ {education.institution}</span>
            </div>

            <div className="edu-cgpa-line">
              <span className="tree-char">└─ </span>
              <span className="cgpa-label">
                CGPA: {education.cgpa}/{education.cgpaMax}
              </span>
              <span className="cgpa-bar">{cgpaBar}</span>
              <span className="cgpa-percent">{cgpaPercent}%</span>
            </div>
          </div>

          <hr className="terminal-divider" />

          {/* Certifications */}
          <div className="log-entry cert-section">
            <div className="cert-command">
              <span className="cert-cmd-highlight">$ </span>
              ls certifications/
            </div>
            <ul className="cert-list">
              {certifications.map((cert, cIdx) => (
                <li className="cert-item" key={cIdx}>
                  <span className="cert-icon" role="img" aria-label="certificate">
                    📜
                  </span>
                  {cert.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Blinking Cursor */}
          <div className="log-entry">
            <span className="terminal-cursor" aria-hidden="true">
              █
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
