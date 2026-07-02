import { useEffect, useRef, useState, useCallback } from 'react';
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
    year: '2025',
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
function useCountUp(targetValue, decimals, shouldAnimate, duration = 2000) {
  const [displayValue, setDisplayValue] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  const animate = useCallback(() => {
    if (targetValue === null) return;

    const step = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for smooth deceleration
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
    <article
      className={`stat-block ${isVisible ? 'stat-block--visible' : ''}`}
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
    </article>
  );
}

/* ---- Main Achievements Component ---- */
export default function Achievements() {
  const statsRef = useRef(null);
  const cardsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    const observers = [];

    /* Observe stats grid */
    if (statsRef.current) {
      const statsObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setStatsVisible(true);
            statsObserver.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      statsObserver.observe(statsRef.current);
      observers.push(statsObserver);
    }

    /* Observe cards section */
    if (cardsRef.current) {
      const cardsObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setCardsVisible(true);
            cardsObserver.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      cardsObserver.observe(cardsRef.current);
      observers.push(cardsObserver);
    }

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  return (
    <section id="achievements" className="achievements-section">
      <h2 className="achievements-title">
        <span className="achievements-title-accent">ACHIEVE</span>MENTS
      </h2>

      {/* Stats Grid */}
      <div className="stats-grid" ref={statsRef}>
        {stats.map((stat, i) => (
          <StatBlock
            key={i}
            stat={stat}
            index={i}
            isVisible={statsVisible}
          />
        ))}
      </div>

      {/* Cards (Hackathons + Leadership) */}
      <div className="cards-section" ref={cardsRef}>
        {/* Hackathons */}
        <h3 className="cards-section-title cards-section-title--hackathons">
          Hackathons
        </h3>
        <div className="cards-grid">
          {hackathons.map((hack, i) => (
            <article
              key={i}
              className={`achievement-card achievement-card--hackathon ${
                cardsVisible ? 'achievement-card--visible' : ''
              }`}
            >
              <h4 className="card-name">{hack.name}</h4>
              <span className="card-year">{hack.year}</span>
              <p className="card-description">{hack.description}</p>
            </article>
          ))}
        </div>

        {/* Leadership */}
        <h3 className="cards-section-title cards-section-title--leadership">
          Leadership
        </h3>
        <div className="cards-grid cards-grid--leadership">
          {leadership.map((lead, i) => (
            <article
              key={i}
              className={`achievement-card achievement-card--leadership ${
                cardsVisible ? 'achievement-card--visible' : ''
              }`}
            >
              <h4 className="card-name">{lead.name}</h4>
              <span className="card-year">{lead.year}</span>
              <p className="card-description">{lead.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
