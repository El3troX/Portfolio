import './CyberDivider.css';

export default function CyberDivider() {
  return (
    <div className="cyber-divider" aria-hidden="true">
      <div className="cyber-divider__line" />
      <div className="cyber-divider__glitch-block monospace">
        <span className="cyber-divider__bracket">[</span>
        <span className="cyber-divider__data">///</span>
        <span className="cyber-divider__bracket">]</span>
      </div>
      <div className="cyber-divider__line" />
    </div>
  );
}
