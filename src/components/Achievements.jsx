import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import MetricsDashboard from './MetricsDashboard';
import './Achievements.css';

/* ---- Stats Data ---- */
const stats = [
  { value: 9.09, suffix: '', label: 'CGPA at VIT Vellore', decimals: 2 },
  { value: 2, suffix: '', label: 'Industry Internships', decimals: 0 },
  { value: 7, suffix: '+', label: 'Production Projects Built', decimals: 0 },
  { value: 3, suffix: '+', label: 'Hackathons Competed', decimals: 0 },
  { value: 200, suffix: '+', label: 'Statutory Documents Indexed', decimals: 0 },
  { value: null, suffix: '', label: 'Research Time Reduction', decimals: 0, special: '5hrs→4min' },
];

/* ---- Hackathon Data ---- */
const hackathons = [
  {
    name: 'IIT Bombay Eureka \'25',
    year: '2025',
    description: 'Developed "YogNexus", a centralized AI-powered healthcare network. Pitched the solution and got invited to IIT Bombay for the finals.',
  },
  {
    name: 'Deloitte Hacksplosion',
    year: '2026',
    description: 'Rapid prototyping under constraints',
  },
  {
    name: 'Goldman Sachs National Hackathon',
    year: '2026',
    description: 'Achieved a Top 10% national ranking out of 10,000+ participants.',
  },
  {
    name: 'HackWithInfy (Infosys)',
    year: '2025',
    description: 'Competed in advanced algorithmic problem-solving.',
  },
];

/* ---- Leadership Data ---- */
const leadership = [
  {
    name: 'Technology and Gaming Club — Senior Core Member',
    year: '2023–Present',
    description:
      'VIT University. Coordinated events during Riviera and Gravitas, engaging 300+ participants.',
  },
];

/* ---- Animated Counter Hook ---- */
function useCountUp(targetValue, decimals, shouldAnimate, duration = 1800) {
  const [displayValue, setDisplayValue] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  const animate = useCallback(() => {
    if (targetValue === null) return;

    const step = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * targetValue;

      setDisplayValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValue);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [targetValue, duration]);

  useEffect(() => {
    if (shouldAnimate) {
      startTimeRef.current = null;
      animate();
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [shouldAnimate, animate]);

  if (targetValue === null) return null;
  return decimals > 0 ? displayValue.toFixed(decimals) : Math.floor(displayValue);
}

/* ---- Stat Block Component ---- */
function StatBlock({ stat, index, isVisible }) {
  const countedValue = useCountUp(stat.value, stat.decimals, isVisible);
  const [specialRevealed, setSpecialRevealed] = useState(false);
  const [specialText, setSpecialText] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (stat.special && isVisible && !specialRevealed) {
      const fullText = stat.special;
      let charIndex = 0;

      intervalRef.current = setInterval(() => {
        charIndex++;
        setSpecialText(fullText.slice(0, charIndex));
        if (charIndex >= fullText.length) {
          clearInterval(intervalRef.current);
          setSpecialRevealed(true);
        }
      }, 100);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isVisible, stat.special, specialRevealed]);

  return (
    <motion.article
      className={`stat-block ${isVisible ? 'stat-block--visible' : ''}`}
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
    >
      <div className={`stat-number stat-color-${index} ${stat.special ? 'stat-number--special' : ''}`}>
        {stat.special ? (
          <>{specialText}</>
        ) : (
          <>
            {countedValue}
            {stat.suffix && <span className="stat-suffix">{stat.suffix}</span>}
          </>
        )}
      </div>
      <div className="stat-label">{stat.label}</div>
    </motion.article>
  );
}

/* ---- Main Achievements Component ---- */
export default function Achievements() {
  const [activeTab, setActiveTab] = useState('all');
  const [statsVisible, setStatsVisible] = useState(false);

  return (
    <motion.section
      id="achievements"
      className="achievements-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      onViewportEnter={() => setStatsVisible(true)}
      transition={{ duration: 0.7 }}
    >
      <h2 className="achievements-title">
        <span className="achievements-title-accent">ACHIEVE</span>MENTS
      </h2>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <StatBlock
            key={i}
            stat={stat}
            index={i}
            isVisible={statsVisible}
          />
        ))}
      </div>

      {/* Tab Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', margin: '3.5rem 0 2rem' }}>
        {[
          { id: 'all', label: 'All Highlights' },
          { id: 'hackathons', label: 'Hackathons' },
          { id: 'leadership', label: 'Leadership' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="monospace"
            style={{
              background: activeTab === tab.id ? 'var(--neon-pink)' : 'rgba(255, 255, 255, 0.04)',
              color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
              border: '1px solid ' + (activeTab === tab.id ? 'var(--neon-pink)' : 'rgba(255, 255, 255, 0.1)'),
              padding: '0.45rem 1.2rem',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards Section */}
      <div className="cards-section">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {/* Hackathons */}
            {(activeTab === 'all' || activeTab === 'hackathons') && (
              <div style={{ marginBottom: activeTab === 'all' ? '3rem' : '0' }}>
                <h3 className="cards-section-title cards-section-title--hackathons">
                  Hackathons
                </h3>
                <div className="cards-grid">
                  {hackathons.map((hack, i) => (
                    <motion.article
                      key={i}
                      className="achievement-card achievement-card--hackathon achievement-card--visible"
                      whileHover={{ scale: 1.03, y: -4, boxShadow: '0 0 25px rgba(255, 45, 107, 0.25)' }}
                      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                    >
                      <h4 className="card-name">{hack.name}</h4>
                      <span className="card-year">{hack.year}</span>
                      <p className="card-description">{hack.description}</p>
                    </motion.article>
                  ))}
                </div>
              </div>
            )}

            {/* Leadership */}
            {(activeTab === 'all' || activeTab === 'leadership') && (
              <div>
                <h3 className="cards-section-title cards-section-title--leadership">
                  Leadership
                </h3>
                <div className="cards-grid cards-grid--leadership">
                  {leadership.map((lead, i) => (
                    <motion.article
                      key={i}
                      className="achievement-card achievement-card--leadership achievement-card--visible"
                      whileHover={{ scale: 1.03, y: -4, boxShadow: '0 0 25px rgba(61, 90, 254, 0.25)' }}
                      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                    >
                      <h4 className="card-name">{lead.name}</h4>
                      <span className="card-year">{lead.year}</span>
                      <p className="card-description">{lead.description}</p>
                    </motion.article>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bklit-style Composable Analytics & Benchmarks */}
      <MetricsDashboard />
    </motion.section>
  );
}
