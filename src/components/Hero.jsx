import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import ParticleBackground from './ParticleBackground';
import './Hero.css';

const Hero = () => {
  const targetName = 'DIVYAM PANDEY';
  const [revealed, setRevealed] = useState(Array(targetName.length).fill(false));
  const [gibberish, setGibberish] = useState(targetName.split(''));
  const [phase, setPhase] = useState('scramble'); // 'scramble', 'falling', 'complete'
  const [cyberTime, setCyberTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCyberTime(
        now.toLocaleTimeString('en-US', { hour12: false }) +
        ':' +
        String(now.getMilliseconds()).padStart(3, '0')
      );
    };
    tick();
    const id = setInterval(tick, 47); // ~21fps for that flickery data-feed feel
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let scrambleInterval;
    const chars = '!<>-_\\\\/[]{}—=+*^?#';
    
    // Scramble the unrevealed letters rapidly
    if (phase !== 'complete') {
      scrambleInterval = setInterval(() => {
        setGibberish(prev => prev.map(() => chars[Math.floor(Math.random() * chars.length)]));
      }, 50);
    }

    return () => clearInterval(scrambleInterval);
  }, [phase]);

  useEffect(() => {
    // 1. Scramble wildly for 1 second (Spider-Verse style)
    const startFalling = setTimeout(() => {
      setPhase('falling');
      
      // 2. Drop letters one by one
      targetName.split('').forEach((char, i) => {
        // Skip spaces instantly
        if (char === ' ') {
           setRevealed(prev => { const next = [...prev]; next[i] = true; return next; });
           return;
        }

        setTimeout(() => {
          setRevealed(prev => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
          
          // If this is the last character, transition to complete
          if (i === targetName.length - 1) {
            setTimeout(() => setPhase('complete'), 500); // Wait for last drop animation
          }
        }, i * 150); // 150ms delay between each letter falling
      });
      
    }, 1000);

    return () => clearTimeout(startFalling);
  }, []);

  const taglineItems = [
    'RAG Systems', 'LangChain', 'Multi-Agent AI', 'Full-Stack Dev',
    'Cloud Architecture', 'Time-Series ML', 'LangGraph', 'Vector Embeddings'
  ];

  return (
    <section id="hero" className="hero-section">
      <ParticleBackground />

      <div className="hero-background">
        <div className="gradient-blob violet-blob"></div>
        <div className="gradient-blob blue-blob"></div>
        <div className="gradient-blob cyan-blob"></div>
      </div>

      {/* ── Cyberpunk HUD Overlay ── */}
      <div className="cyber-hud" aria-hidden="true">
        <div className="cyber-hud__corner cyber-hud__tl monospace">
          <span className="cyber-hud__label">SYS</span>
          <span className="cyber-hud__value cyber-hud__blink">ONLINE</span>
        </div>
        <div className="cyber-hud__corner cyber-hud__tr monospace">
          <span className="cyber-hud__label">UTC.CLK</span>
          <span className="cyber-hud__value">{cyberTime}</span>
        </div>
        <div className="cyber-hud__corner cyber-hud__bl monospace">
          <span className="cyber-hud__label">LOC</span>
          <span className="cyber-hud__value">12.9716°N 79.1588°E</span>
        </div>
        <div className="cyber-hud__corner cyber-hud__br monospace">
          <span className="cyber-hud__label">NODE</span>
          <span className="cyber-hud__value">DIVYAM.EXE</span>
        </div>
      </div>

      <div className="hero-content">
        <h1 className={`hero-title-container ${phase === 'complete' ? 'glitch-name' : ''}`} data-text={targetName}>
          {phase === 'complete' ? targetName : targetName.split('').map((char, i) => {
            if (char === ' ') return <span key={i} style={{ display: 'inline-block', width: '0.4em' }}> </span>;
            
            if (revealed[i]) {
              return (
                <span key={i} className={`char-real ${phase === 'falling' ? 'falling' : ''}`}>
                  {char}
                </span>
              );
            } else {
              return (
                <span key={i} className="char-scramble">
                  {gibberish[i]}
                </span>
              );
            }
          })}
        </h1>
        
        <motion.p 
          className="hero-subtitle monospace"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="neon-highlight">AI/ML Engineer</span> &amp; <span className="neon-highlight">Full-Stack Developer</span>
        </motion.p>

        <div className="marquee-container">
          <div className="marquee-content">
            {/* Duplicate content for seamless loop */}
            {[...Array(2)].map((_, i) => (
              <div key={i} className="marquee-group">
                {taglineItems.map((item, j) => (
                  <React.Fragment key={`${i}-${j}`}>
                    <span className="marquee-item monospace">{item}</span>
                    <span className="marquee-separator">•</span>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>

        <motion.div 
          className="hero-cta-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6, type: 'spring' }}
        >
          <motion.a 
            href="#contact" 
            className="cta-button monospace"
            whileHover={{ scale: 1.06, x: -2, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            Let&apos;s Build Something Insane →
          </motion.a>
          <div className="cta-doodle"></div>
        </motion.div>
      </div>

      <motion.div 
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <div className="scroll-arrow"></div>
        <span className="monospace">scroll down</span>
      </motion.div>
    </section>
  );
};

export default Hero;

