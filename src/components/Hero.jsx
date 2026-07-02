import React, { useState, useEffect } from 'react';
import './Hero.css';

const Hero = () => {
  const targetName = 'DIVYAM PANDEY';
  const [revealed, setRevealed] = useState(Array(targetName.length).fill(false));
  const [gibberish, setGibberish] = useState(targetName.split(''));
  const [phase, setPhase] = useState('scramble'); // 'scramble', 'falling', 'complete'

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
      <div className="hero-background">
        <div className="gradient-blob violet-blob"></div>
        <div className="gradient-blob blue-blob"></div>
        <div className="gradient-blob cyan-blob"></div>
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
        
        <p className="hero-subtitle monospace">
          <span className="neon-highlight">AI/ML Engineer</span> &amp; <span className="neon-highlight">Full-Stack Developer</span>
        </p>

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

        <div className="hero-cta-wrapper">
          <a href="#contact" className="cta-button monospace">
            Let's Build Something Insane →
          </a>
          <div className="cta-doodle"></div>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-arrow"></div>
        <span className="monospace">scroll down</span>
      </div>
    </section>
  );
};

export default Hero;
