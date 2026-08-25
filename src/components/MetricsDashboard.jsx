import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Activity, Cpu, Layers, Zap } from 'lucide-react';
import './MetricsDashboard.css';

const forecastData = [
  { day: 'Day 5', ARIMA: 15.2, SARIMA: 13.8, ETS: 14.6, GARCH: 12.1 },
  { day: 'Day 10', ARIMA: 14.8, SARIMA: 13.1, ETS: 14.0, GARCH: 11.9 },
  { day: 'Day 15', ARIMA: 14.1, SARIMA: 12.6, ETS: 13.5, GARCH: 11.4 },
  { day: 'Day 20', ARIMA: 13.9, SARIMA: 12.2, ETS: 13.1, GARCH: 11.2 },
  { day: 'Day 25', ARIMA: 13.5, SARIMA: 11.9, ETS: 12.8, GARCH: 10.9 },
  { day: 'Day 30', ARIMA: 13.1, SARIMA: 11.4, ETS: 12.4, GARCH: 10.7 },
];

const ragLatencyData = [
  { queries: '10 Docs', baseline: 4.8, vidhanaAI: 1.8 },
  { queries: '50 Docs', baseline: 6.5, vidhanaAI: 2.1 },
  { queries: '100 Docs', baseline: 8.9, vidhanaAI: 2.4 },
  { queries: '150 Docs', baseline: 11.2, vidhanaAI: 2.7 },
  { queries: '200 Docs', baseline: 14.5, vidhanaAI: 2.9 },
];

const domainRadarData = [
  { subject: 'RAG & LLMs', A: 95, fullMark: 100 },
  { subject: 'LangGraph / Agents', A: 90, fullMark: 100 },
  { subject: 'Time-Series ML', A: 85, fullMark: 100 },
  { subject: 'Full-Stack (React/Node)', A: 88, fullMark: 100 },
  { subject: 'Cloud (AWS / Serverless)', A: 84, fullMark: 100 },
  { subject: 'Distributed Systems', A: 82, fullMark: 100 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bklit-tooltip">
        <p className="bklit-tooltip-label">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, fontSize: '0.8rem', margin: '2px 0' }}>
            {entry.name}: {entry.value} {entry.unit || ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function MetricsDashboard() {
  const [activeChart, setActiveChart] = useState('forecast');

  const chartTabs = [
    { id: 'forecast', label: 'Stock Model Error (MAPE %)', icon: Activity },
    { id: 'rag', label: 'RAG Latency Benchmark (s)', icon: Zap },
    { id: 'radar', label: 'Domain Proficiency Matrix', icon: Layers },
  ];

  return (
    <div className="metrics-dashboard-card">
      <div className="metrics-header">
        <div className="metrics-title-group">
          <div className="metrics-badge">
            <Cpu size={14} />
            <span>AI Benchmark Analytics</span>
          </div>
          <h3 className="metrics-title">Engineering Performance Metrics</h3>
        </div>

        {/* Tab Controls */}
        <div className="metrics-tabs">
          {chartTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeChart === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveChart(tab.id)}
                className={`metrics-tab-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="metrics-chart-container">
        <AnimatePresence mode="wait">
          {activeChart === 'forecast' && (
            <motion.div
              key="forecast"
              className="chart-wrapper"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="chart-legend-top">
                <span className="legend-item" style={{ color: '#00e5ff' }}>● GARCH (10.7% MAPE)</span>
                <span className="legend-item" style={{ color: '#b8ff00' }}>● SARIMA</span>
                <span className="legend-item" style={{ color: '#ff2d6b' }}>● ARIMA</span>
                <span className="legend-item" style={{ color: '#8b5cf6' }}>● ETS</span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="garchGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00e5ff" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="sarimaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#b8ff00" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#b8ff00" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#666" fontSize={12} tickLine={false} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="GARCH" stroke="#00e5ff" strokeWidth={2.5} fill="url(#garchGrad)" />
                  <Area type="monotone" dataKey="SARIMA" stroke="#b8ff00" strokeWidth={2} fill="url(#sarimaGrad)" />
                  <Area type="monotone" dataKey="ARIMA" stroke="#ff2d6b" strokeWidth={1.5} fill="none" strokeDasharray="3 3" />
                  <Area type="monotone" dataKey="ETS" stroke="#8b5cf6" strokeWidth={1.5} fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {activeChart === 'rag' && (
            <motion.div
              key="rag"
              className="chart-wrapper"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="chart-legend-top">
                <span className="legend-item" style={{ color: '#00e5ff' }}>■ Vidhan AI (LangChain + Vector DB: &lt;2.9s)</span>
                <span className="legend-item" style={{ color: '#555' }}>■ Standard Naive RAG Baseline</span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={ragLatencyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <XAxis dataKey="queries" stroke="#666" fontSize={12} tickLine={false} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} unit="s" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="vidhanaAI" fill="#00e5ff" radius={[4, 4, 0, 0]} name="Vidhan AI (s)" />
                  <Bar dataKey="baseline" fill="#333" radius={[4, 4, 0, 0]} name="Naive RAG Baseline (s)" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {activeChart === 'radar' && (
            <motion.div
              key="radar"
              className="chart-wrapper"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={domainRadarData}>
                  <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                  <PolarAngleAxis dataKey="subject" stroke="#aaa" fontSize={11} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#444" />
                  <Radar name="Proficiency %" dataKey="A" stroke="#b8ff00" fill="#b8ff00" fillOpacity={0.25} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
