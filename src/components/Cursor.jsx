import React, { useEffect, useState } from 'react';
import './Cursor.css';

const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if touch device
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true);
      return;
    }

    // Set cursor:none on body
    document.body.style.cursor = 'none';

    const onMouseMove = (e) => {
      // Use requestAnimationFrame for smoother following
      requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isClickable = 
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('interactive');
        
      if (isClickable) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      <div 
        className={`cursor-outer ${isHovering ? 'cursor-hover' : ''}`} 
        style={{ transform: `translate(calc(${position.x}px - 50%), calc(${position.y}px - 50%))` }}
      />
      <div 
        className="cursor-inner" 
        style={{ transform: `translate(calc(${position.x}px - 50%), calc(${position.y}px - 50%))` }}
      />
    </>
  );
};

export default Cursor;
