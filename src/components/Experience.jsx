import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import BossBattle from './BossBattle';
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
  const sorted = [...TECH_TERMS].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'g');

  const parts = text.split(regex);
  return parts.map((part, i) => {
    if (sorted.some((t) => t === part)) {
      return (
        <motion.span
          key={i}
          className="tech-highlight"
          whileHover={{ color: 'var(--neon-lime)', textShadow: '0 0 8px rgba(184, 255, 0, 0.8)' }}
        >
          {part}
        </motion.span>
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
function buildCgpaBar(
  cgpa,
  max,
  ghostRef,
  pupilOffset,
  onGhostClick,
  isEnraged,
  pokeCount,
  ghostDialogue
) {
  const percent = (cgpa / max) * 100;
  const pos = Math.max(0, Math.min(20, Math.round((percent / 100) * 20)));
  const isMouthOpen = pos % 2 === 0;

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

  const ghostSpriteClass = isEnraged
    ? 'ghost-sprite--enraged'
    : pokeCount === 2
    ? 'ghost-sprite--annoyed-2'
    : pokeCount === 1
    ? 'ghost-sprite--annoyed-1'
    : '';

  const ghostBodyFill = isEnraged
    ? '#ff2d6b'
    : pokeCount === 2
    ? '#f43f5e'
    : pokeCount === 1
    ? '#d946ef'
    : 'var(--electric-cyan, #00e5ff)';

  const ghostSvg = (
    <svg
      viewBox="0 0 100 100"
      className={`ghost-sprite ${ghostSpriteClass}`}
      ref={ghostRef}
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
      <path d="M 30,22 L 25,0 L 40,12 L 50,-5 L 60,12 L 75,0 L 70,22 Z" fill="var(--acid-yellow, #ffe500)" />
      <circle cx="25" cy="0" r="3" fill="var(--neon-pink, #ff2d6b)" />
      <circle cx="50" cy="-5" r="3" fill="var(--neon-pink, #ff2d6b)" />
      <circle cx="75" cy="0" r="3" fill="var(--neon-pink, #ff2d6b)" />
      <path d="M 20,50 A 30,30 0 0,1 80,50 L 80,95 L 70,85 L 60,95 L 50,85 L 40,95 L 30,85 L 20,95 Z" fill={ghostBodyFill} />
      <ellipse cx="40" cy="45" rx="8" ry="12" fill="#fff" />
      <ellipse cx="60" cy="45" rx="8" ry="12" fill="#fff" />
      <g style={{ transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)` }}>
        <circle cx="40" cy="48" r="4" fill="#0a0a0a" />
        <circle cx="60" cy="48" r="4" fill="#0a0a0a" />
      </g>
    </svg>
  );

  const elements = [];
  for (let i = 0; i < pos; i++) {
    elements.push(<span key={`filled-${i}`} className="cgpa-bar-filled">█</span>);
  }
  elements.push(<span key="pacman" className="cgpa-bar-pacman">{pacmanSvg}</span>);
  for (let i = pos; i < 20; i++) {
    if (i === 5) {
      elements.push(<span key={`ghost-${i}`} className="cgpa-bar-empty"><MiniGhost color="var(--neon-blue, #3d5afe)" /></span>);
    } else if (i === 11) {
      elements.push(<span key={`ghost-${i}`} className="cgpa-bar-empty"><MiniGhost color="var(--neon-lime, #b8ff00)" /></span>);
    } else if (i === 17) {
      elements.push(<span key={`ghost-${i}`} className="cgpa-bar-empty"><MiniGhost color="var(--neon-pink, #ff2d6b)" /></span>);
    } else {
      elements.push(<span key={`dot-${i}`} className="cgpa-bar-empty">•</span>);
    }
  }

  return (
    <>
      {elements}
      <button
        type="button"
        className={`cgpa-bar-ghost interactive boss-trigger-btn ${pokeCount > 0 ? 'is-speaking' : ''}`}
        onClick={onGhostClick}
        title="👑 Ghost King"
        aria-label="Interact with Ghost King"
      >
        {ghostSvg}
        <span className={`ghost-challenge-tooltip monospace ${pokeCount > 0 ? 'is-visible' : ''} ${isEnraged ? 'is-enraged' : ''}`}>
          {ghostDialogue}
        </span>
      </button>
    </>
  );
}

export default function Experience() {
  const ghostRef = useRef(null);
  const resetTimerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('all');
  const [displayCgpa, setDisplayCgpa] = useState(0);
  const [hasStartedLoading, setHasStartedLoading] = useState(false);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isBossBattleOpen, setIsBossBattleOpen] = useState(false);
  const [isEnraged, setIsEnraged] = useState(false);
  const [pokeCount, setPokeCount] = useState(0);
  const [ghostDialogue, setGhostDialogue] = useState('👑 Ghost King');

  const tabs = [
    { id: 'all', label: 'career.log' },
    { id: 'internships', label: 'internships.log' },
    { id: 'education', label: 'education.sh' },
    { id: 'certs', label: 'certifications.json' },
  ];

  // Progressive Irritation on Slashes -> 3rd Slash triggers Boss Battle
  const handleGhostSlash = useCallback(() => {
    if (isEnraged) return;

    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    setPokeCount((prev) => {
      const nextCount = prev + 1;

      if (nextCount === 1) {
        setGhostDialogue('💬 "Hey! Watch the crown, mortal!"');
        // Reset if left alone
        resetTimerRef.current = setTimeout(() => {
          setPokeCount(0);
          setGhostDialogue('👑 Ghost King');
        }, 4500);
      } else if (nextCount === 2) {
        setGhostDialogue('💬 "I am warning you... CEASE this at once!"');
        resetTimerRef.current = setTimeout(() => {
          setPokeCount(0);
          setGhostDialogue('👑 Ghost King');
        }, 4500);
      } else if (nextCount >= 3) {
        setGhostDialogue('🔥 "YOU BROUGHT THIS UPON YOURSELF!"');
        setIsEnraged(true);

        // Fly out into the sky and launch the Boss Battle
        setTimeout(() => {
          setIsBossBattleOpen(true);
        }, 900);
      }

      return nextCount;
    });
  }, [isEnraged]);

  // Mouse tracking for ghost eyes
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ghostRef.current) return;
      const rect = ghostRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      const angle = Math.atan2(dy, dx);
      const distance = Math.min(4, Math.sqrt(dx * dx + dy * dy) / 30);

      setPupilOffset({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Loading bar animation effect
  useEffect(() => {
    if (!hasStartedLoading) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayCgpa(education.cgpa);
      return;
    }

    let current = 0;
    const target = education.cgpa;
    const duration = 2400;
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

  const cgpaBar = buildCgpaBar(
    displayCgpa,
    education.cgpaMax,
    ghostRef,
    pupilOffset,
    handleGhostSlash,
    isEnraged,
    pokeCount,
    ghostDialogue
  );
  const cgpaPercent = ((displayCgpa / education.cgpaMax) * 100).toFixed(1);

  return (
    <motion.section
      id="experience"
      className="experience-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      onViewportEnter={() => setHasStartedLoading(true)}
      transition={{ duration: 0.7 }}
    >
      <h2 className="experience-title">
        <span className="experience-title-accent">EXP</span>ERIENCE
      </h2>

      <div className="terminal-window" role="region" aria-label="Career experience terminal">
        {/* Terminal Tab Header */}
        <div className="terminal-header" aria-hidden="true" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="terminal-dots">
              <span className="terminal-dot terminal-dot--red" />
              <span className="terminal-dot terminal-dot--yellow" />
              <span className="terminal-dot terminal-dot--green" />
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--neon-lime)' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.2rem 0.6rem',
                    fontSize: '0.75rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <span className="terminal-header-title">divyam@portfolio:~$</span>
        </div>

        {/* Terminal Body */}
        <div className="terminal-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Experience Entries */}
              {(activeTab === 'all' || activeTab === 'internships') && (
                <div>
                  {experiences.map((exp, idx) => (
                    <div className="log-entry exp-entry log-entry--visible" key={idx}>
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
                </div>
              )}

              {activeTab === 'all' && <hr className="terminal-divider" />}

              {/* Education */}
              {(activeTab === 'all' || activeTab === 'education') && (
                <div className="log-entry edu-entry log-entry--visible">
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
              )}

              {activeTab === 'all' && <hr className="terminal-divider" />}

              {/* Certifications */}
              {(activeTab === 'all' || activeTab === 'certs') && (
                <div className="log-entry cert-section log-entry--visible">
                  <div className="cert-command">
                    <span className="cert-cmd-highlight">$ </span>
                    ls certifications/
                  </div>
                  <ul className="cert-list">
                    {certifications.map((cert, cIdx) => (
                      <motion.li
                        className="cert-item"
                        key={cIdx}
                        whileHover={{ x: 6, color: 'var(--neon-lime)' }}
                      >
                        <span className="cert-icon" role="img" aria-label="certificate">
                          📜
                        </span>
                        {cert.name}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Blinking Cursor */}
          <div className="log-entry log-entry--visible">
            <span className="terminal-cursor" aria-hidden="true">
              █
            </span>
          </div>
        </div>
      </div>

      {/* Elden Ghost King Boss Battle Fullscreen Rift Overlay */}
      <BossBattle
        isOpen={isBossBattleOpen}
        onClose={() => {
          setIsBossBattleOpen(false);
          setIsEnraged(false);
        }}
      />
    </motion.section>
  );
}
