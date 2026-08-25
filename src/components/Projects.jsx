import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Sparkles, Users, Briefcase } from 'lucide-react';
import NetherPortal from './NetherPortal';
import ProjectModal from './ProjectModal';
import './Projects.css';

const PROJECTS = [
  {
    id: 1,
    name: 'MarketPulse',
    category: 'ai',
    hasPortal: true,
    subtitle: 'NIFTY-50 Stock Forecasting Framework',
    impact: '~12% MAPE on 30-day forecasts across 4 models with 6-fold cross-validation',
    details:
      'Ingested 5+ years of historical data (~1,250 trading sessions) to build and benchmark ARIMA, SARIMA, ETS, and GARCH models for NIFTY-50 index prediction.',
    tech: ['R', 'ARIMA', 'SARIMA', 'ETS', 'GARCH', 'Time-Series'],
    date: 'May 2026',
    github: 'https://github.com/El3troX/MarketPulse',
    repoName: 'MarketPulse',
    cloneUrl: 'https://github.com/El3troX/MarketPulse.git',
    color: 'var(--neon-lime)',
  },
  {
    id: 2,
    name: 'Vidhan AI',
    category: 'ai',
    hasPortal: true,
    subtitle: 'Legal RAG Assistant',
    impact: '87% retrieval precision on 50-query legal benchmark, <3s per query',
    details:
      'Indexed 200+ statutory documents (~3,000 pages) covering the Constitution, BNS, and BNSS using a Retrieval-Augmented Generation pipeline powered by LangChain and Google Generative AI.',
    tech: ['RAG', 'LLMs', 'LangChain', 'Google Gen AI'],
    date: 'Mar 2026',
    github: 'https://github.com/El3troX/vidhan_ai',
    repoName: 'vidhan_ai',
    cloneUrl: 'https://github.com/El3troX/vidhan_ai.git',
    color: 'var(--neon-pink)',
  },
  {
    id: 3,
    name: 'AI Agent Framework',
    category: 'ai',
    hasPortal: false, // Internship Project — no portal
    subtitle: 'Financial Research Automation',
    impact: 'Slashed research time from ~5 hours to under 4 minutes per report',
    details:
      'Multi-agent financial research pipeline scraping Yahoo Finance, Moneycontrol, and Screener across 20+ companies via 6 sources using LangGraph orchestration with Firecrawl and Serper API.',
    tech: ['LangGraph', 'LangChain', 'Firecrawl', 'Serper API'],
    date: 'Jun 2025',
    github: null,
    badge: 'Internship Project',
    color: 'var(--neon-blue)',
  },
  {
    id: 4,
    name: 'Multimodal AI Assistant',
    category: 'ai',
    hasPortal: true,
    subtitle: 'Vision + Text + Audio Processing',
    impact: '3-modality support with <2s end-to-end latency',
    details:
      'Processes images up to 12MP with visual response under 800ms. Built with Streamlit and Google Gemini API, supporting real-time image analysis via OpenCV and Pillow.',
    tech: ['Streamlit', 'Gemini API', 'OpenCV', 'Pillow'],
    date: 'Dec 2025',
    github: 'https://github.com/El3troX/AI-PROJECT-MULTIMODAL_PROJECT',
    repoName: 'AI-PROJECT-MULTIMODAL_PROJECT',
    cloneUrl: 'https://github.com/El3troX/AI-PROJECT-MULTIMODAL_PROJECT.git',
    color: 'var(--acid-yellow)',
  },
  {
    id: 5,
    name: 'BlogIT',
    category: 'fullstack',
    hasPortal: true,
    subtitle: 'AI-Powered Blogging Platform',
    impact: '120+ users, <200ms API response, 99.8% uptime',
    details:
      'Full-stack blogging platform with AI-assisted drafting that reduced post creation time by ~60%. Features real-time collaboration with Firebase and a RESTful Express backend.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Firebase'],
    date: 'Jun 2025',
    github: 'https://github.com/El3troX/BlogIT',
    repoName: 'BlogIT',
    cloneUrl: 'https://github.com/El3troX/BlogIT.git',
    color: 'var(--deep-violet)',
  },
  {
    id: 6,
    name: 'AWS Serverless Event Booking',
    category: 'cloud',
    hasPortal: false, // Group Project — no portal
    subtitle: 'Cloud-Native Booking System',
    impact: '500+ concurrent bookings, <400ms cold-start, 99.5% success rate',
    details:
      'Group engineering system achieving 40% cost reduction vs EC2 with a 6-step Step Functions workflow. Fully serverless architecture using Lambda, API Gateway, DynamoDB, and Cognito auth.',
    tech: ['AWS Lambda', 'API Gateway', 'DynamoDB', 'Step Functions', 'Cognito'],
    date: 'Nov 2024',
    github: null,
    badge: 'Group Project',
    color: 'var(--electric-cyan)',
  },
  {
    id: 7,
    name: 'BUSIT',
    category: 'fullstack',
    hasPortal: true,
    subtitle: 'Bus Credit System',
    impact: '300+ user accounts, <150ms transaction validation',
    details:
      'Handles 5 transaction types across 8 normalized MySQL tables. Built as a lightweight, performant credit management system for campus bus services.',
    tech: ['HTML', 'CSS', 'JavaScript', 'MySQL'],
    date: 'Sept 2024',
    github: 'https://github.com/El3troX/BCS',
    repoName: 'BCS',
    cloneUrl: 'https://github.com/El3troX/BCS.git',
    color: 'var(--neon-lime)',
  },
];

const CATEGORIES = [
  { key: 'all', label: 'All Projects' },
  { key: 'ai', label: 'AI/ML & RAG' },
  { key: 'fullstack', label: 'Full-Stack' },
  { key: 'cloud', label: 'Cloud & Systems' },
];

function ProjectCard({ project, index, onCardClick }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, isHovering: false, mouseX: 0, mouseY: 0 });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = -((y - centerY) / centerY) * 8;

    setTilt({
      rotateX,
      rotateY,
      mouseX: x,
      mouseY: y,
      isHovering: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt((prev) => ({
      ...prev,
      rotateX: 0,
      rotateY: 0,
      isHovering: false,
    }));
  }, []);

  const paddedIndex = String(index + 1).padStart(2, '0');
  const isLarge = index < 2;

  const handleClick = () => {
    if (project.hasPortal) {
      onCardClick(project);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`projects__card-wrapper ${isLarge ? 'projects__card-wrapper--large' : ''} ${
        project.hasPortal ? 'projects__card-wrapper--portal interactive' : 'projects__card-wrapper--static'
      }`}
      onClick={handleClick}
      role={project.hasPortal ? 'button' : 'region'}
      tabIndex={project.hasPortal ? 0 : -1}
      aria-label={project.hasPortal ? `Open Nether portal for ${project.name}` : project.name}
      onKeyDown={(e) => {
        if (project.hasPortal && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="projects__card"
        style={{
          '--card-accent': project.color,
          transform: tilt.isHovering
            ? `perspective(1000px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: tilt.isHovering
            ? 'transform 0.08s ease-out, box-shadow 0.3s ease'
            : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease',
        }}
      >
        {/* Minecraft Nether Portal Animated Ambient Canvas (only on portal cards) */}
        {project.hasPortal && (
          <div className="card-nether-portal-layer">
            <NetherPortal />
          </div>
        )}

        <span className="projects__card-number" aria-hidden="true">
          {paddedIndex}
        </span>

        {/* Portal Ribbon or Badge */}
        {project.hasPortal ? (
          <div className="projects__portal-ribbon monospace">
            <Sparkles size={13} className="portal-sparkle-spin" />
            <span>⚡ Enter Nether Portal</span>
          </div>
        ) : (
          <div className="projects__group-ribbon monospace">
            {project.badge === 'Internship Project' ? (
              <>
                <Briefcase size={13} color="var(--neon-blue)" />
                <span>Internship Project • Architecture View</span>
              </>
            ) : (
              <>
                <Users size={13} />
                <span>Group Project • Architecture View</span>
              </>
            )}
          </div>
        )}

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

          {project.hasPortal ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="projects__enter-pill monospace">
                <span>Warp Portal</span>
                <span className="pill-arrow">→</span>
              </span>

              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="projects__github-link interactive"
                aria-label={`View ${project.name} on GitHub`}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={16} />
              </a>
            </div>
          ) : (
            <div className="projects__group-tag monospace">
              <span>{project.badge || 'Collaborative Project'}</span>
            </div>
          )}
        </footer>
      </article>
    </motion.div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [warpingProject, setWarpingProject] = useState(null);

  const filteredProjects =
    filter === 'all'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === filter);

  const handleTriggerPortal = (project) => {
    if (!project.hasPortal) return;
    setWarpingProject(project);

    // Play punchy 1.2-second Nether Portal warp transition then open modal
    setTimeout(() => {
      setActiveModalProject(project);
      setWarpingProject(null);
    }, 1200);
  };

  return (
    <motion.section
      id="projects"
      className="projects"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
    >
      {/* Full-Screen Nether Portal Warp Distortion Transition */}
      <AnimatePresence>
        {warpingProject && (
          <div className="nether-warp-overlay">
            <NetherPortal isWarping={true} className="nether-warp-canvas-bg" />
            <div className="nether-warp-swirl" />
            <div className="nether-warp-title">
              Entering {warpingProject.name}...
            </div>
          </div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem', marginBottom: '3.5rem' }}>
        <div>
          <h2 className="projects__title" style={{ margin: 0 }}>
            <span className="projects__title-accent">PROJ</span>ECTS
          </h2>
          <p className="monospace" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Click solo project cards to warp into their Nether Portal repository viewer
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              className="monospace"
              style={{
                background: filter === cat.key ? 'var(--acid-yellow)' : 'rgba(255, 255, 255, 0.04)',
                color: filter === cat.key ? 'var(--bg-void)' : 'var(--text-muted)',
                border: '1px solid ' + (filter === cat.key ? 'var(--acid-yellow)' : 'rgba(255, 255, 255, 0.1)'),
                padding: '0.45rem 1.1rem',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.85rem',
                transition: 'all 0.2s ease',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="projects__grid">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onCardClick={handleTriggerPortal}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* In-App GitHub Warp Portal Modal */}
      <ProjectModal
        project={activeModalProject}
        isOpen={Boolean(activeModalProject)}
        onClose={() => setActiveModalProject(null)}
      />
    </motion.section>
  );
}
