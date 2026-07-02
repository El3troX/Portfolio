import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Glassmorphism effect trigger
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide/Show navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // scrolling down
      } else {
        setIsVisible(true); // scrolling up
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    // Intersection Observer for active link
    const sections = document.querySelectorAll('section[id]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));
    
    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    // Slight delay to allow menu to close before scrolling
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const navLinks = [
    { name: 'About', id: 'about' },
    { name: 'Skills', id: 'skills' },
    { name: 'Projects', id: 'projects' },
    { name: 'Experience', id: 'experience' },
    { name: 'Achievements', id: 'achievements' },
    { name: 'Contact', id: 'contact' }
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="navbar-container">
        <a href="#" className="nav-logo monospace" onClick={(e) => scrollToSection(e, 'root')}>
          DP
        </a>
        
        <div className="nav-links">
          {navLinks.map(link => (
            <a 
              key={link.id} 
              href={`#${link.id}`} 
              className={`nav-link monospace ${activeSection === link.id ? 'active' : ''}`}
              onClick={(e) => scrollToSection(e, link.id)}
            >
              {link.name}
            </a>
          ))}
        </div>

        <button 
          className="hamburger" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`line ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-links">
          {navLinks.map((link, index) => (
            <a 
              key={link.id} 
              href={`#${link.id}`} 
              className="mobile-nav-link monospace"
              style={{ transitionDelay: `${index * 0.1}s` }}
              onClick={(e) => scrollToSection(e, link.id)}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
