import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Send, Bot, CheckCircle2, Terminal } from 'lucide-react';
import './AIPromptCard.css';

const PRESET_QUERIES = [
  {
    id: 'rag',
    chip: '⚡ RAG & LLM Stack',
    query: 'What is Divyam’s RAG and AI orchestration stack?',
    answer:
      'Divyam specializes in LangChain, LangGraph, and Graph RAG architectures. He has built production-grade systems indexing 200+ statutory legal documents with 87% retrieval precision, as well as multi-agent financial pipelines cutting research time from 5 hours to under 4 minutes using Firecrawl & Serper.',
  },
  {
    id: 'internships',
    chip: '💼 Industry Experience',
    query: 'Where has Divyam interned and what did he build?',
    answer:
      'He interned at Ernst & Young (EY GDS) focusing on enterprise AI, Advanced RAG, and distributed systems. Previously at Mahindra & Mahindra, he engineered a stateful RAG chatbot with LangGraph, built multimodal speech-to-text processing, and integrated Model Context Protocol (MCP) for secure tool execution.',
  },
  {
    id: 'stats',
    chip: '🎓 Background & Academics',
    query: 'What is his academic standing and key stats?',
    answer:
      'Divyam is a Computer Science undergraduate (Data Science) at VIT Vellore with a 9.09/10 CGPA. He has built 7+ production projects, won top 10% national ranking in Goldman Sachs Hackathon (10k+ participants), and was invited to IIT Bombay finals for YogNexus.',
  },
];

export default function AIPromptCard() {
  const [selectedQuery, setSelectedQuery] = useState(PRESET_QUERIES[0]);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!selectedQuery) return;
    setIsTyping(true);
    setDisplayedText('');

    let index = 0;
    const text = selectedQuery.answer;
    
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      index++;
      setDisplayedText(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(intervalRef.current);
        setIsTyping(false);
      }
    }, 12);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedQuery]);

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const lower = customInput.toLowerCase();
    let matchedAnswer =
      'Divyam is an AI/ML Engineer with deep expertise in LangChain, LangGraph, RAG, full-stack React/Node, and AWS Cloud architectures. Check out his Projects and Experience tabs for full deep dives!';

    if (lower.includes('project') || lower.includes('build')) {
      matchedAnswer =
        'Top projects include MarketPulse (NIFTY-50 Time-Series ML, ~12% MAPE), Vidhan AI (Legal RAG with 87% benchmark precision), and AI Agent Framework (financial research automation).';
    } else if (lower.includes('contact') || lower.includes('email') || lower.includes('hire')) {
      matchedAnswer =
        'You can reach Divyam directly at divyampandey845@gmail.com or via LinkedIn/GitHub in the Contact section!';
    }

    setSelectedQuery({
      id: 'custom',
      chip: 'Custom Query',
      query: customInput,
      answer: matchedAnswer,
    });
    setCustomInput('');
  };

  return (
    <div className="kokonut-bento-card">
      <div className="kokonut-card-glow" />

      {/* Top Banner */}
      <div className="kokonut-header">
        <div className="kokonut-badge">
          <Sparkles size={14} className="kokonut-sparkle-icon" />
          <span>Interactive AI Profile Agent</span>
        </div>
        <span className="kokonut-model-tag monospace">agent-v2.5 • live</span>
      </div>

      {/* Query Chips */}
      <div className="kokonut-chips">
        {PRESET_QUERIES.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setSelectedQuery(preset)}
            className={`kokonut-chip ${selectedQuery.id === preset.id ? 'active' : ''}`}
          >
            {preset.chip}
          </button>
        ))}
      </div>

      {/* Query & Answer Terminal Box */}
      <div className="kokonut-terminal-view">
        <div className="kokonut-query-row">
          <Terminal size={16} className="kokonut-term-icon" />
          <span className="kokonut-query-text">{selectedQuery.query}</span>
        </div>

        <div className="kokonut-answer-row">
          <Bot size={18} className="kokonut-bot-icon" />
          <div className="kokonut-answer-content">
            <p className="kokonut-answer-text">
              {displayedText}
              {isTyping && <span className="kokonut-cursor">▋</span>}
            </p>
            {!isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="kokonut-verified-badge"
              >
                <CheckCircle2 size={13} />
                <span>Verified from engineering resume</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Input Prompt Box */}
      <form onSubmit={handleCustomSubmit} className="kokonut-input-bar">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Ask a question about Divyam's skills or projects..."
          className="kokonut-input"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="kokonut-send-btn"
          aria-label="Ask agent"
        >
          <Send size={15} />
        </motion.button>
      </form>
    </div>
  );
}
