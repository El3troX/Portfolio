import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './Skills.css';

/* ---- primary skills get the larger badge size ---- */
const PRIMARY = new Set([
  'Python',
  'LangChain',
  'React',
  'AWS Lambda',
  'RAG Systems',
  'LangGraph',
  'Node.js',
  'MongoDB',
]);

/* ---- skill data by category ---- */
const CATEGORIES = [
  {
    key: 'ai',
    label: 'AI/ML & Data',
    headerRotate: '-2deg',
    skills: [
      'LangChain',
      'LangGraph',
      'RAG Systems',
      'Graph RAG',
      'Advanced RAG',
      'Vector Embeddings',
      'Azure OpenAI',
      'Gemini API',
      'NumPy',
      'Pandas',
      'Matplotlib',
    ],
  },
  {
    key: 'languages',
    label: 'Languages',
    headerRotate: '1deg',
    skills: [
      'Python',
      'Java',
      'C',
      'JavaScript (ES6+)',
      'TypeScript',
      'SQL',
      'R',
      'MATLAB',
    ],
  },
  {
    key: 'frontend',
    label: 'Frontend',
    headerRotate: '3deg',
    skills: ['React', 'Tailwind CSS', 'HTML5', 'CSS3'],
  },
  {
    key: 'backend',
    label: 'Backend',
    headerRotate: '-1deg',
    skills: ['Node.js', 'Express', 'REST APIs', 'JWT Auth'],
  },
  {
    key: 'databases',
    label: 'Databases',
    headerRotate: '2deg',
    skills: ['MongoDB', 'MySQL', 'DynamoDB'],
  },
  {
    key: 'cloud',
    label: 'Cloud & Infra',
    headerRotate: '-3deg',
    skills: [
      'AWS Lambda',
      'DynamoDB',
      'Step Functions',
      'API Gateway',
      'Cognito',
      'S3',
      'CloudFront',
      'Vercel',
      'Railway',
    ],
  },
  {
    key: 'tools',
    label: 'Tools',
    headerRotate: '1deg',
    skills: ['Git', 'GitHub', 'VS Code', 'n8n', 'Streamlit', 'MCP'],
  },
];

/* ---- Custom Animated Icons ---- */
const CloudIcon = () => (
  <svg className="cat-icon cat-icon--cloud" viewBox="0 0 100 50">
    <path className="cloud-body" d="M 30,40 Q 20,40 20,30 Q 20,15 35,15 Q 40,5 55,5 Q 70,5 75,15 Q 85,15 85,25 Q 85,40 70,40 Z" fill="var(--neon-blue, #3d5afe)" />
    <path className="wind-line wind-line-1" d="M 0,20 L 25,20" stroke="var(--electric-cyan, #00e5ff)" strokeWidth="3" strokeLinecap="round" />
    <path className="wind-line wind-line-2" d="M -10,30 L 15,30" stroke="var(--electric-cyan, #00e5ff)" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const LanguageIcon = () => (
  <div className="cat-icon cat-icon--lang">
    <span className="lang-prompt">&gt;_</span>
  </div>
);

const FrontendIcon = () => (
  <svg className="cat-icon cat-icon--front" viewBox="0 0 60 50">
    <g className="ui-panel ui-panel-1">
      <rect x="5" y="5" width="30" height="20" rx="2" fill="none" stroke="var(--neon-pink, #ff2d6b)" strokeWidth="2" />
      <line x1="5" y1="12" x2="35" y2="12" stroke="var(--neon-pink, #ff2d6b)" strokeWidth="1" />
    </g>
    <g className="ui-panel ui-panel-2">
      <rect x="15" y="15" width="30" height="20" rx="2" fill="var(--bg-elevated, #1a1a1a)" stroke="var(--electric-cyan, #00e5ff)" strokeWidth="2" />
      <line x1="15" y1="22" x2="45" y2="22" stroke="var(--electric-cyan, #00e5ff)" strokeWidth="1" />
    </g>
    <g className="ui-panel ui-panel-3">
      <rect x="25" y="25" width="30" height="20" rx="2" fill="var(--bg-dark, #111111)" stroke="var(--neon-lime, #b8ff00)" strokeWidth="2" />
      <circle cx="30" cy="30" r="2" fill="var(--neon-lime, #b8ff00)" />
      <circle cx="36" cy="30" r="2" fill="var(--neon-lime, #b8ff00)" />
      <circle cx="42" cy="30" r="2" fill="var(--neon-lime, #b8ff00)" />
    </g>
  </svg>
);

const BackendIcon = () => (
  <svg className="cat-icon cat-icon--back" viewBox="0 5 60 50">
    <g className="gear gear-1">
      <circle cx="20" cy="25" r="14" fill="none" stroke="var(--acid-yellow, #ffe500)" strokeWidth="6" strokeDasharray="6 4" />
      <circle cx="20" cy="25" r="11" fill="var(--bg-dark, #111111)" stroke="var(--acid-yellow, #ffe500)" strokeWidth="2" />
      <circle cx="20" cy="25" r="3" fill="var(--acid-yellow, #ffe500)" />
    </g>
    <g className="gear gear-2">
      <circle cx="44" cy="37" r="9" fill="none" stroke="var(--electric-cyan, #00e5ff)" strokeWidth="5" strokeDasharray="5 3.5" />
      <circle cx="44" cy="37" r="6" fill="var(--bg-dark, #111111)" stroke="var(--electric-cyan, #00e5ff)" strokeWidth="2" />
      <circle cx="44" cy="37" r="2" fill="var(--electric-cyan, #00e5ff)" />
    </g>
  </svg>
);

const ToolsIcon = () => (
  <svg className="cat-icon cat-icon--tools" viewBox="0 0 60 50">
    <rect className="toolbox-body" x="10" y="25" width="40" height="20" fill="var(--bg-elevated)" stroke="var(--text-muted)" strokeWidth="2" />
    <g className="tools-popup">
      <path className="wrench" d="M 20,25 L 20,10 A 5,5 0 1,1 30,10 L 30,25" fill="none" stroke="var(--electric-cyan)" strokeWidth="2" />
      <line className="screwdriver" x1="40" y1="25" x2="40" y2="5" stroke="var(--neon-pink)" strokeWidth="3" />
    </g>
    <rect className="toolbox-lid" x="10" y="20" width="40" height="5" fill="var(--text-muted)" />
  </svg>
);

const DatabaseIcon = () => (
  <svg className="cat-icon cat-icon--db" viewBox="0 0 60 60">
    <ellipse className="db-disc db-disc-3" cx="30" cy="45" rx="20" ry="6" fill="var(--bg-dark, #111111)" stroke="var(--deep-violet, #8b5cf6)" strokeWidth="2" />
    <ellipse className="db-disc db-disc-2" cx="30" cy="30" rx="20" ry="6" fill="var(--bg-dark, #111111)" stroke="var(--deep-violet, #8b5cf6)" strokeWidth="2" />
    <ellipse className="db-disc db-disc-1" cx="30" cy="15" rx="20" ry="6" fill="var(--bg-dark, #111111)" stroke="var(--deep-violet, #8b5cf6)" strokeWidth="2" />
    <line className="db-data-stream" x1="30" y1="5" x2="30" y2="45" stroke="var(--neon-lime, #b8ff00)" strokeWidth="2" strokeDasharray="4 4" />
  </svg>
);

const AiIcon = () => (
  <svg className="cat-icon cat-icon--ai" viewBox="0 0 60 50">
    <g className="nn-links" fill="none" stroke="var(--text-muted)" strokeWidth="1" opacity="0.5">
      <path d="M 10,10 L 30,15 M 10,10 L 30,35" />
      <path d="M 10,25 L 30,15 M 10,25 L 30,35" />
      <path d="M 10,40 L 30,15 M 10,40 L 30,35" />
      <path d="M 30,15 L 50,25" />
      <path d="M 30,35 L 50,25" />
    </g>
    <g className="nn-data-flow" fill="none" stroke="var(--neon-pink, #ff2d6b)" strokeWidth="2" strokeDasharray="4 20">
      <path className="data-flow-slow" d="M 10,10 L 30,15 M 10,10 L 30,35" />
      <path className="data-flow-slow" d="M 10,25 L 30,15 M 10,25 L 30,35" />
      <path className="data-flow-slow" d="M 10,40 L 30,15 M 10,40 L 30,35" />
      <path className="data-flow-fast" d="M 30,15 L 50,25" />
      <path className="data-flow-fast" d="M 30,35 L 50,25" />
    </g>
    <g className="nn-nodes" fill="var(--bg-elevated, #1a1a1a)" stroke="var(--neon-pink, #ff2d6b)" strokeWidth="2">
      <circle cx="10" cy="10" r="3" />
      <circle cx="10" cy="25" r="3" />
      <circle cx="10" cy="40" r="3" />
      <circle className="nn-hidden" cx="30" cy="15" r="4" />
      <circle className="nn-hidden" cx="30" cy="35" r="4" />
      <circle className="nn-output" cx="50" cy="25" r="5" stroke="var(--acid-yellow, #ffe500)" />
    </g>
  </svg>
);

const getCatIcon = (key) => {
  switch (key) {
    case 'ai': return <AiIcon />;
    case 'cloud': return <CloudIcon />;
    case 'languages': return <LanguageIcon />;
    case 'frontend': return <FrontendIcon />;
    case 'backend': return <BackendIcon />;
    case 'tools': return <ToolsIcon />;
    case 'databases': return <DatabaseIcon />;
    default: return null;
  }
};

function seededRandom(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = (h ^ (h >>> 16)) * 0x45d9f3b;
    h = (h ^ (h >>> 16)) * 0x45d9f3b;
    h ^= h >>> 16;
    return ((h >>> 0) / 0xffffffff);
  };
}

export default function Skills() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const sectionRef = useRef(null);

  const filters = [
    { key: 'all', label: 'All Arsenal' },
    { key: 'ai', label: 'AI/ML & Data' },
    { key: 'languages', label: 'Languages' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'cloud', label: 'Cloud' },
    { key: 'tools', label: 'Tools' },
  ];

  const displayedCategories =
    selectedFilter === 'all'
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.key === selectedFilter);

  return (
    <motion.section
      id="skills"
      className="skills"
      ref={sectionRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
    >
      <h2 className="skills__title">
        TECH <span className="skills__title-accent">ARSENAL</span>
      </h2>

      {/* Category Quick Filter */}
      <div className="skills__filters" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center', marginBottom: '3rem' }}>
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setSelectedFilter(f.key)}
            className={`skills__filter-btn monospace ${selectedFilter === f.key ? 'active' : ''}`}
            style={{
              background: selectedFilter === f.key ? 'var(--neon-lime)' : 'rgba(255, 255, 255, 0.04)',
              color: selectedFilter === f.key ? 'var(--bg-void)' : 'var(--text-muted)',
              border: '1px solid ' + (selectedFilter === f.key ? 'var(--neon-lime)' : 'rgba(255, 255, 255, 0.1)'),
              padding: '0.45rem 1.1rem',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
              transition: 'all 0.2s ease',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        {displayedCategories.map((cat) => (
          <motion.div
            key={cat.key}
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className={`skills__category skills__category--${cat.key}`}
          >
            <h3
              className="skills__cat-header"
              style={{ '--header-rotate': cat.headerRotate }}
            >
              {getCatIcon(cat.key)}
              <span className="skills__cat-label">{cat.label}</span>
            </h3>

            <div className="skills__badges">
              {cat.skills.map((skill, idx) => {
                const rng = seededRandom(skill + cat.key);
                const rotation = (rng() * 4 - 2).toFixed(1);
                const isPrimary = PRIMARY.has(skill);

                return (
                  <motion.span
                    key={skill}
                    className={`skills__badge ${
                      isPrimary ? 'skills__badge--primary' : 'skills__badge--secondary'
                    }`}
                    initial={{ opacity: 0, y: 15, rotate: parseFloat(rotation) }}
                    animate={{ opacity: 1, y: 0, rotate: parseFloat(rotation) }}
                    transition={{ duration: 0.3, delay: idx * 0.02 }}
                    whileHover={{ scale: 1.12, y: -4, rotate: 0, zIndex: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {skill}
                  </motion.span>
                );
              })}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.section>
  );
}
