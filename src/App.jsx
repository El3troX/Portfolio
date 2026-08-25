import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import Cursor from './components/Cursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import CyberDivider from './components/CyberDivider';

function App() {
  return (
    <>
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <CyberDivider />
        <About />
        <CyberDivider />
        <Skills />
        <CyberDivider />
        <Projects />
        <CyberDivider />
        <Experience />
        <CyberDivider />
        <Achievements />
        <CyberDivider />
        <Contact />
      </main>
      <Analytics />
    </>
  );
}

export default App;
