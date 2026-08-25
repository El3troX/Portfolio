import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, GitBranch, Code, ShieldCheck, Terminal, FileCode, Check, Copy } from 'lucide-react';
import NetherPortal from './NetherPortal';
import './ProjectModal.css';

export default function ProjectModal({ project, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('readme');
  const [copiedClone, setCopiedClone] = useState(false);

  if (!isOpen || !project) return null;

  const cloneCmd = project.cloneUrl ? `git clone ${project.cloneUrl}` : `git clone https://github.com/El3troX/${project.repoName || project.name}.git`;

  const handleCopyClone = () => {
    navigator.clipboard.writeText(cloneCmd);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="portal-modal-backdrop" onClick={onClose}>
        <motion.div
          className="portal-modal-container"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{ '--modal-accent': project.color }}
        >
          {/* Nether Portal Animated Shader Backdrop */}
          <div className="modal-nether-portal-layer">
            <NetherPortal />
          </div>

          {/* Top Bar */}
          <div className="portal-modal-header">
            <div className="portal-modal-controls">
              <span className="p-dot p-dot--red" onClick={onClose} />
              <span className="p-dot p-dot--yellow" />
              <span className="p-dot p-dot--green" />
            </div>

            <div className="portal-repo-path monospace">
              <span className="repo-owner">El3troX</span> / <span className="repo-name">{project.name}</span>
            </div>

            <button className="portal-close-btn" onClick={onClose} aria-label="Close portal">
              <X size={18} />
            </button>
          </div>

          {/* Repo Telemetry Ribbon */}
          <div className="portal-telemetry-bar">
            <div className="telemetry-item">
              <GitBranch size={13} />
              <span>main</span>
            </div>
            <div className="telemetry-item">
              <Code size={13} />
              <span>{project.tech[0]}</span>
            </div>
            <div className="telemetry-item">
              <ShieldCheck size={13} />
              <span>Production Ready</span>
            </div>
            <div className="telemetry-item badge-item">
              <span>{project.subtitle}</span>
            </div>
          </div>

          {/* Quick Clone Bar */}
          <div className="portal-clone-bar monospace">
            <Terminal size={14} className="clone-icon" />
            <span className="clone-text">{cloneCmd}</span>
            <button className="clone-copy-btn" onClick={handleCopyClone}>
              {copiedClone ? <Check size={14} color="var(--neon-lime)" /> : <Copy size={14} />}
              <span>{copiedClone ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="portal-tabs monospace">
            {[
              { id: 'readme', label: 'README.md', icon: FileCode },
              { id: 'tech', label: 'Architecture & Tech', icon: Terminal },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`portal-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Modal Body Content */}
          <div className="portal-modal-body">
            {activeTab === 'readme' && (
              <div className="portal-readme-view">
                <h2 className="readme-title">{project.name}</h2>
                <p className="readme-subtitle monospace">{project.subtitle}</p>

                <div className="readme-impact-box">
                  <span className="impact-tag">KEY RESULT</span>
                  <p>{project.impact}</p>
                </div>

                <h4 className="readme-section-heading">Overview</h4>
                <p className="readme-body-text">{project.details}</p>

                <h4 className="readme-section-heading">Tech Stack & Tools</h4>
                <div className="readme-tech-tags">
                  {project.tech.map((t) => (
                    <span key={t} className="readme-tag monospace">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tech' && (
              <div className="portal-tech-view monospace">
                <div className="code-block">
                  <div className="code-header">// System Architecture Pipeline</div>
                  <pre>
                    {`1. Input Ingestion -> Historical Data / Statutory Documents
2. Pipeline Engine  -> ${project.tech.slice(0, 3).join(' + ')}
3. Optimization     -> Vector Indexing & Cross-Validation
4. Metric Output    -> ${project.impact}
5. Deployment       -> Production Service / Cloud Architecture`}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="portal-modal-footer">
            <span className="footer-date monospace">Built: {project.date}</span>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="portal-external-btn monospace"
            >
              <span>Launch on GitHub</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
