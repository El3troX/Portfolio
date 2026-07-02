import { useEffect, useRef } from 'react';
import './About.css';

const STICKERS = [
  { label: 'AI/ML Engineer', variant: 'pink', rotate: '-4deg' },
  { label: 'Full-Stack Dev', variant: 'blue', rotate: '3deg' },
  { label: 'Cloud Architect', variant: 'lime', rotate: '-2deg' },
  { label: 'Data Scientist', variant: 'cyan', rotate: '5deg' },
];

export default function About() {
  const sectionRef = useRef(null);
  const stickersRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000, isHovering: false });

  // Intersection Observer for visibility
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Physics Loop
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const section = sectionRef.current;

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.isHovering = true;
    };
    const handleMouseLeave = () => {
      mouseRef.current.isHovering = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    if (section) {
      section.addEventListener('mouseleave', handleMouseLeave);
    }

    // Initialize physics state
    const particles = STICKERS.map(() => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      originX: 0,
      originY: 0,
    }));

    let animationFrameId;

    const loop = () => {
      const mouse = mouseRef.current;

      // 1. Calculate Forces
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const el = stickersRef.current[i];
        if (!el) continue;

        // Spring force towards origin anchor
        const springStrength = 0.03;
        p.vx += (p.originX - p.x) * springStrength;
        p.vy += (p.originY - p.y) * springStrength;

        // Mouse repelling
        if (mouse.isHovering) {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          const dx = centerX - mouse.x;
          const dy = centerY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const repelRadius = 160;
          if (dist < repelRadius && dist > 0) {
            const force = (repelRadius - dist) / repelRadius;
            p.vx += (dx / dist) * force * 3; // Push strength
            p.vy += (dy / dist) * force * 3;
          }
        }
      }

      // 2. Inter-sticker Collision
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const el1 = stickersRef.current[i];
          const el2 = stickersRef.current[j];
          if (!el1 || !el2) continue;

          const rect1 = el1.getBoundingClientRect();
          const rect2 = el2.getBoundingClientRect();
          
          const c1x = rect1.left + rect1.width / 2;
          const c1y = rect1.top + rect1.height / 2;
          const c2x = rect2.left + rect2.width / 2;
          const c2y = rect2.top + rect2.height / 2;

          const dx = c1x - c2x;
          const dy = c1y - c2y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Collision radius (rough approximation for rectangular stickers)
          const minDist = 110; 
          if (dist < minDist && dist > 0) {
             const overlap = minDist - dist;
             const force = overlap * 0.1; // Spring collision response
             const nx = dx / dist;
             const ny = dy / dist;
             
             p1.vx += nx * force;
             p1.vy += ny * force;
             p2.vx -= nx * force;
             p2.vy -= ny * force;
          }
        }
      }

      // 3. Update Positions & Friction
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // Friction / Drag
        p.vx *= 0.88; 
        p.vy *= 0.88;
        
        p.x += p.vx;
        p.y += p.vy;

        const el = stickersRef.current[i];
        if (el) {
          const rot = STICKERS[i].rotate;
          el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${rot})`;
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (section) {
        section.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="about" className="about" ref={sectionRef}>
      <h2 className="about__title">
        ABOUT <span className="about__title-accent">ME</span>
      </h2>

      <div className="about__grid">
        {/* -------- Avatar Column -------- */}
        <div className="about__avatar-wrap">
          <div className="about__avatar">
            <div className="about__avatar-inner">
              <img src="/profile.jpg" alt="Divyam Pandey" className="about__avatar-img" />
            </div>
          </div>
        </div>

        {/* -------- Decorative Arrow -------- */}
        <svg
          className="about__arrow"
          viewBox="0 0 80 80"
          aria-hidden="true"
          focusable="false"
        >
          <path
            className="about__arrow-path"
            d="M 10 40 Q 35 10 60 35 M 50 35 L 60 35 L 60 25"
          />
        </svg>

        {/* -------- Bio Column -------- */}
        <div className="about__bio-wrap">
          <p className="about__bio-text">
            Computer Science undergraduate (Data Science) at VIT Vellore with
            hands-on experience building production-grade AI systems across{' '}
            <span className="about__highlight">RAG pipelines</span>,{' '}
            LLM orchestration, and{' '}
            <span className="about__highlight">multi-agent frameworks</span>.
            Proficient in{' '}
            <span className="about__highlight">LangChain</span>,{' '}
            <span className="about__highlight">LangGraph</span>, and vector
            embedding architectures; experienced with multimodal systems,
            MCP-based tool orchestration, and retrieval-augmented generation
            at scale.
          </p>

          {/* Education terminal */}
          <div className="about__education">
            <p className="about__edu-command">$ cat education.txt</p>
            <pre className="about__edu-output">
              <span className="edu-label">degree  </span>
              <span className="edu-value">B.Tech CSE (Data Science)</span>
              {'\n'}
              <span className="edu-label">school  </span>
              <span className="edu-value">VIT Vellore</span>
              {'\n'}
              <span className="edu-label">cgpa    </span>
              <span className="edu-cgpa">9.09 / 10</span>
            </pre>
          </div>

          {/* Floating sticker labels */}
          <div className="about__stickers" aria-label="Role labels">
            {STICKERS.map((s, index) => (
              <span
                key={s.label}
                ref={(el) => (stickersRef.current[index] = el)}
                className={`about__sticker about__sticker--${s.variant}`}
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
