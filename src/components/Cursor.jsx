import { useEffect, useState, useRef, useCallback } from 'react';
import diamondPickaxeImg from '../assets/diamond_pickaxe.png';
import diamondSwordImg from '../assets/diamond_sword.png';
import destroyStageImg from '../assets/destroy_stage_7.png';
import sweepSlashImg from '../assets/sweep_4.png';
import enchantedHitImg from '../assets/enchanted_hit.png';
import './Cursor.css';

const INTERACTIVE_SELECTORS = [
  'a',
  'button',
  '[role="button"]',
  'input',
  'select',
  'textarea',
  '.interactive',
  '.projects__card-wrapper--portal',
  '.projects__github-link',
  '.kokonut-chip',
  '.metrics-tab-btn',
  '.p-dot',
  '.about__sticker',
  '.nav__link',
  '.stat-block',
  '.clone-copy-btn',
  '.portal-external-btn',
  '.portal-close-btn',
  '.portal-tab-btn',
  '.btn',
].join(', ');

const Cursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [breakParticles, setBreakParticles] = useState([]);

  const cursorContainerRef = useRef(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const isHoveringRef = useRef(false);

  const spawnBreakParticles = useCallback((x, y, isSword) => {
    const newParticles = [];
    const count = isSword ? 16 : 12;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 35 + 20;
      newParticles.push({
        id: Date.now() + i + Math.random(),
        x,
        y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed + 15,
        size: Math.random() * 6 + 3,
        color: isSword
          ? ['#ba68c8', '#e91e63', '#55ffff', '#ffffff', '#7ffdfd'][Math.floor(Math.random() * 5)]
          : ['#33ebcb', '#7ffdfd', '#238989', '#ffffff', '#866043', '#573d26'][Math.floor(Math.random() * 6)],
        isEnchantedHit: isSword && Math.random() > 0.4,
      });
    }
    setBreakParticles((prev) => [...prev.slice(-28), ...newParticles]);
    setTimeout(() => {
      setBreakParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 500);
  }, []);

  const updateHoverState = useCallback((element) => {
    const hovering = Boolean(element && element.closest(INTERACTIVE_SELECTORS));
    if (hovering !== isHoveringRef.current) {
      isHoveringRef.current = hovering;
      setIsHovering(hovering);

      // Direct synchronous DOM update for 0ms latency
      if (cursorContainerRef.current) {
        if (hovering) {
          cursorContainerRef.current.classList.add('mc-cursor--sword', 'mc-cursor--enchanted');
          cursorContainerRef.current.classList.remove('mc-cursor--pickaxe');
        } else {
          cursorContainerRef.current.classList.add('mc-cursor--pickaxe');
          cursorContainerRef.current.classList.remove('mc-cursor--sword', 'mc-cursor--enchanted');
        }
      }
    }
  }, []);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    document.body.style.cursor = 'none';

    const onMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (cursorContainerRef.current) {
        cursorContainerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Fast synchronous evaluation
      updateHoverState(e.target);
    };

    const handleMouseDown = (e) => {
      setIsClicked(true);
      if (cursorContainerRef.current) {
        cursorContainerRef.current.classList.add('mc-cursor--swinging');
      }
      spawnBreakParticles(e.clientX, e.clientY, isHoveringRef.current);
    };

    const handleMouseUp = () => {
      setIsClicked(false);
      if (cursorContainerRef.current) {
        cursorContainerRef.current.classList.remove('mc-cursor--swinging');
      }
    };

    const handleMouseOver = (e) => {
      updateHoverState(e.target);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
    };
  }, [spawnBreakParticles, updateHoverState]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Minecraft Tool Container */}
      <div
        ref={cursorContainerRef}
        className={`mc-cursor-container ${isHovering ? 'mc-cursor--sword mc-cursor--enchanted' : 'mc-cursor--pickaxe'} ${isClicked ? 'mc-cursor--swinging' : ''}`}
        aria-hidden="true"
        style={{
          '--sword-img': `url(${diamondSwordImg})`,
        }}
      >
        {/* Dynamic Tool Wrapper */}
        <div className="mc-tool-wrapper">
          {/* Preloaded Pickaxe Layer */}
          <img
            src={diamondPickaxeImg}
            alt="Diamond Pickaxe"
            className="mc-tool-img mc-tool-img--pickaxe"
            draggable="false"
          />

          {/* Preloaded Sword Layer */}
          <img
            src={diamondSwordImg}
            alt="Enchanted Diamond Sword"
            className="mc-tool-img mc-tool-img--sword"
            draggable="false"
          />

          {/* Minecraft Enchantment Foil Sheen */}
          <div className="mc-enchant-glint" />
        </div>

        {/* Official Minecraft Slash / Crack Effect on Click */}
        {isClicked && (
          <div className="mc-strike-effect">
            {isHovering ? (
              /* Official Minecraft Sweep Attack Slash Particle */
              <img
                src={sweepSlashImg}
                alt="Minecraft Sweep Attack"
                className="mc-sweep-slash-img"
                draggable="false"
              />
            ) : (
              /* Official Minecraft Block Break Crack Texture */
              <img
                src={destroyStageImg}
                alt="Minecraft Block Crack"
                className="mc-crack-img"
                draggable="false"
              />
            )}
          </div>
        )}
      </div>

      {/* Floating Minecraft Particles (Debris & Enchanted Critical Hits) */}
      {breakParticles.map((p) => (
        <div
          key={p.id}
          className="mc-break-particle"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.isEnchantedHit ? 'transparent' : p.color,
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
          }}
        >
          {p.isEnchantedHit && (
            <img
              src={enchantedHitImg}
              alt=""
              style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default Cursor;
