import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Copy, Check, ExternalLink } from 'lucide-react';
import obsidianImg from '../assets/obsidian.png';
import cryingObsidianImg from '../assets/crying_obsidian.png';
import './ResumeModal.css';

const RESUME_DATA = {
  name: 'Divyam Pandey',
  title: 'AI/ML Engineer & Data Scientist',
  contact: {
    phone: '(+91) 94798 65784',
    email: 'divyampandey845@gmail.com',
    location: 'Vellore Institute of Technology, Vellore, India – 632014',
    github: 'https://github.com/El3troX',
    linkedin: 'https://linkedin.com/in/divyam-pandey-231449202',
    pdfUrl: '/resume.pdf',
    driveUrl: 'https://drive.google.com/file/d/1SUslgzp4uRAD4ObgWZyu5QMrOxpS9OSB/view?usp=drivesdk',
  },
  education: {
    degree: 'B.Tech in Computer Science & Engineering (Data Science)',
    institution: 'Vellore Institute of Technology, Vellore, Tamil Nadu',
    cgpa: '9.09 / 10',
    period: 'Aug. 2023 – Present',
    coursework: [
      'Machine Learning',
      'Artificial Intelligence',
      'Information Retrieval',
      'Natural Language Processing',
      'Probability & Statistics',
      'Data Structures & Algorithms',
      'Database Management Systems',
    ],
  },
  experience: [
    {
      role: 'Intern',
      company: 'Ernst & Young Global Delivery Service (EY GDS)',
      location: 'Kochi, Kerala',
      period: 'June 2026 – Aug 2026',
      highlights: [
        'Evaluated retrieval quality and ranking behavior of production LLM-based search pipelines across distributed enterprise architectures, following training in Deep Learning, NLP, Graph RAG, and Advanced RAG architectures.',
      ],
      tech: ['Deep Learning', 'NLP', 'Graph RAG', 'Advanced RAG', 'Distributed Architectures'],
    },
    {
      role: 'AI Intern',
      company: 'Mahindra & Mahindra',
      location: 'Mumbai, Maharashtra',
      period: 'June 2025 – July 2025',
      highlights: [
        'Improved retrieval relevance in enterprise chatbots by engineering a Retrieval-Augmented Generation (RAG) pipeline using LangChain and vector embeddings.',
        'Enabled complex, multi-step reasoning and cross-session memory by designing stateful AI workflows utilizing LangGraph.',
        'Improved enterprise workflow efficiency by automating manual processes using n8n and integrating the Model Context Protocol (MCP) for secure tool orchestration.',
      ],
      tech: ['LangChain', 'LangGraph', 'Vector Embeddings', 'Model Context Protocol (MCP)', 'n8n'],
    },
  ],
  projects: [
    {
      name: 'Vidhan-AI (Legal RAG Assistant with Learning-to-Rank)',
      tech: 'LangChain, ChromaDB, BGE-1.5, PyTorch, LightGBM',
      date: 'Mar 2026 – Jul 2026',
      github: 'https://github.com/El3troX/vidhan_ai',
      points: [
        'Built a Retrieval-Augmented Generation assistant answering natural-language queries over Indian statutory law (Constitution, BNS, BNSS), indexing 200+ documents into 1,390 structure-aware, citation-preserving chunks using ChromaDB and BGE-large-1.5 embeddings.',
        'Engineered a learning-to-rank re-ranking layer (PyTorch RankNet, LightGBM LambdaRank) combining dense embedding similarity, BM25, and exact-citation-match features atop the retrieval pipeline.',
        'Improved ranking quality over the embedding-only baseline by 17.6% relative Precision@3 and 9.6% relative MRR, and lifted baseline nDCG@5 by 18.2% absolute (0.70→ 0.83); selected LightGBM over PyTorch for sub-millisecond CPU production inference.',
      ],
    },
    {
      name: 'Valkyrie-AML (Agentic Anti-Money-Laundering Platform)',
      tech: 'Next.js, FastAPI, LangGraph, scikit-learn, SHAP, NetworkX',
      date: '2026',
      github: 'https://github.com/El3troX/Valkyrie-AML',
      points: [
        'Engineered an agentic AML investigation platform combining Random Forest/Isolation Forest detection, SHAP explainability, and NetworkX-based Personalized PageRank risk propagation, achieving 82.7% F1 (73.0% precision, 95.3% recall) across 200,000 transactions.',
        'Built an 8-tool LangGraph-orchestrated agent that routes natural-language compliance queries to detection, fund-flow-tracing, and SAR-generation tools, automating FinCEN-style Suspicious Activity Report drafting via LLM with a deterministic fallback.',
      ],
    },
    {
      name: 'Market Pulse',
      tech: 'R, ARIMA, SARIMA, ETS, GARCH',
      date: 'May 2026',
      github: 'https://github.com/El3troX/marketpulse',
      points: [
        'Recorded ~12% MAPE on 30-day out-of-sample forecasts by developing a time-series forecasting and model evaluation framework.',
        'Validated predictive accuracy across 5+ years of NIFTY-50 data (~1,250 sessions) using 6-fold time-series cross-validation.',
      ],
    },
  ],
  skills: {
    languages: ['Python', 'JavaScript (ES6+)', 'SQL', 'R'],
    ml_ir: [
      'PyTorch',
      'LightGBM',
      'scikit-learn',
      'Random Forest',
      'Isolation Forest',
      'SHAP',
      'Learning-to-Rank (RankNet, LambdaRank)',
      'NDCG/MRR/Precision@k',
      'RAG Systems',
      'LangChain',
      'LangGraph',
    ],
    search_infra: ['ChromaDB', 'Vector Embeddings', 'Sentence-Transformers (MiniLM, BGE-1.5)', 'NetworkX'],
    databases: ['MySQL', 'PostgreSQL'],
    tools: ['NumPy', 'Pandas', 'Matplotlib', 'Git', 'GitHub', 'VS Code', 'n8n', 'Streamlit', 'Next.js', 'FastAPI'],
  },
  certifications: [
    { title: 'Google Data Analyst Certificate', issuer: 'Google', year: '2026' },
    { title: 'Machine Learning Specialization', issuer: 'Coursera – Andrew Ng', year: '2025' },
    { title: 'MERN Stack Development', issuer: 'Ethnus', year: '2025' },
  ],
  hackathons: [
    'IIT Bombay Eureka 25',
    'Deloitte Hacksplosion',
    'HackWithInfy',
    'Goldman Sachs India Hackathon (2025–2026)',
  ],
  leadership: {
    role: 'Senior Core Member',
    club: 'Technology and Gaming Club',
    institution: 'VIT',
    period: '2023 – Present',
    description:
      'Coordinated cross-team logistics and scheduling for Riviera and Gravitas events, serving 300+ participants.',
  },
};

export default function ResumeModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyPlainText = () => {
    const plainText = `
${RESUME_DATA.name}
${RESUME_DATA.contact.location}
Phone: ${RESUME_DATA.contact.phone} | Email: ${RESUME_DATA.contact.email}
LinkedIn: ${RESUME_DATA.contact.linkedin} | GitHub: ${RESUME_DATA.contact.github}

EDUCATION:
${RESUME_DATA.education.degree} — ${RESUME_DATA.education.institution} (${RESUME_DATA.education.period})
CGPA: ${RESUME_DATA.education.cgpa}
Relevant Coursework: ${RESUME_DATA.education.coursework.join(', ')}

EXPERIENCE:
${RESUME_DATA.experience.map(e => `
• ${e.role} @ ${e.company} (${e.period}, ${e.location})
  ${e.highlights.join('\n  ')}
  Tech: ${e.tech.join(', ')}
`).join('\n')}

PROJECTS:
${RESUME_DATA.projects.map(p => `
• ${p.name} | ${p.tech} (${p.date})
  ${p.points.join('\n  ')}
`).join('\n')}

TECHNICAL SKILLS:
Languages: ${RESUME_DATA.skills.languages.join(', ')}
ML & IR: ${RESUME_DATA.skills.ml_ir.join(', ')}
Search & Retrieval Infra: ${RESUME_DATA.skills.search_infra.join(', ')}
Databases: ${RESUME_DATA.skills.databases.join(', ')}
Data & Tools: ${RESUME_DATA.skills.tools.join(', ')}

CERTIFICATIONS:
${RESUME_DATA.certifications.map(c => `• ${c.title} (${c.issuer}, ${c.year})`).join('\n')}

HACKATHONS:
${RESUME_DATA.hackathons.map(h => `• ${h}`).join('\n')}

LEADERSHIP / EXTRACURRICULAR:
• ${RESUME_DATA.leadership.role} @ ${RESUME_DATA.leadership.club}, ${RESUME_DATA.leadership.institution} (${RESUME_DATA.leadership.period})
  ${RESUME_DATA.leadership.description}
    `.trim();

    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="mc-nether-resume-backdrop" onClick={onClose}>
        <motion.div
          className="mc-nether-portal-resume-wrapper"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.85, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 50 }}
          transition={{ type: 'spring', damping: 24, stiffness: 260 }}
        >
          {/* Floating Top Portal Control Header */}
          <div className="mc-portal-top-bar">
            <div className="mc-portal-title-pill monospace">
              <span className="mc-portal-spark-dot" />
              <span>Nether Portal • Resume Chamber</span>
            </div>

            <div className="mc-portal-actions">
              <a
                href={RESUME_DATA.contact.pdfUrl}
                download="Divyam_Pandey_Resume.pdf"
                className="mc-pixel-btn mc-pixel-btn--lime monospace interactive"
                title="Download official PDF"
              >
                <Download size={15} />
                <span>Download PDF</span>
              </a>

              <button
                onClick={handleCopyPlainText}
                className="mc-pixel-btn monospace interactive"
                title="Copy plaintext resume"
              >
                {copied ? <Check size={15} color="#b8ff00" /> : <Copy size={15} />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>

              <a
                href={RESUME_DATA.contact.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mc-pixel-btn monospace interactive"
                title="Open Google Drive Mirror"
              >
                <ExternalLink size={15} />
              </a>

              <button
                onClick={onClose}
                className="mc-pixel-close-btn interactive"
                aria-label="Close Nether Portal"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Authentic 4x5 Minecraft Nether Portal Block Structure */}
          <div className="mc-nether-portal-monolith">
            {/* Top Obsidian Frame Bar */}
            <div className="mc-portal-frame-border mc-portal-frame-border--top">
              {[...Array(8)].map((_, i) => (
                <div
                  key={`top-${i}`}
                  className="mc-obsidian-block"
                  style={{
                    backgroundImage: `url(${i % 3 === 1 ? cryingObsidianImg : obsidianImg})`,
                  }}
                />
              ))}
            </div>

            {/* Middle Section: Left Obsidian Column + Central Resume Inside Portal + Right Obsidian Column */}
            <div className="mc-portal-middle-row">
              {/* Left Column */}
              <div className="mc-portal-frame-border mc-portal-frame-border--side">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={`left-${i}`}
                    className="mc-obsidian-block"
                    style={{
                      backgroundImage: `url(${i === 2 || i === 7 ? cryingObsidianImg : obsidianImg})`,
                    }}
                  />
                ))}
              </div>

              {/* Central Portal Opening With Rendered Authentic Resume Document */}
              <div className="mc-portal-inner-chamber">
                {/* Purple Plasma Aura Glow around opening */}
                <div className="mc-portal-purple-vignette" />

                {/* Floating Ascending Portal Sparks */}
                <div className="mc-portal-ambient-sparks">
                  <span className="mc-ambient-spark spark-1" />
                  <span className="mc-ambient-spark spark-2" />
                  <span className="mc-ambient-spark spark-3" />
                  <span className="mc-ambient-spark spark-4" />
                </div>

                {/* Embedded Resume Reader Inside Portal Aperture */}
                <div className="mc-portal-resume-content">
                  <iframe
                    src={RESUME_DATA.contact.pdfUrl}
                    title="Divyam Pandey Official Resume"
                    className="mc-portal-resume-iframe"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="mc-portal-frame-border mc-portal-frame-border--side">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={`right-${i}`}
                    className="mc-obsidian-block"
                    style={{
                      backgroundImage: `url(${i === 3 || i === 8 ? cryingObsidianImg : obsidianImg})`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Obsidian Frame Bar */}
            <div className="mc-portal-frame-border mc-portal-frame-border--bottom">
              {[...Array(8)].map((_, i) => (
                <div
                  key={`bottom-${i}`}
                  className="mc-obsidian-block"
                  style={{
                    backgroundImage: `url(${i % 3 === 2 ? cryingObsidianImg : obsidianImg})`,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
