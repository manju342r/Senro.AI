const fs = require('fs');

const code = `import React, { useState } from 'react';
import { Target, Zap, TrendingUp, AlertTriangle, Activity, Mail } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

export const Overview = () => {
  const { supabase, ingestToHindsight } = useData();
  const [ownUrl] = useState(() => localStorage.getItem('ownUrl') || 'https://acme.com');
  const [compUrl] = useState(() => localStorage.getItem('compUrl') || '');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(() => {
    try {
      const stored = localStorage.getItem('overviewData');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const mockTimelineData = [
    { name: 'Mon', threat: 20, signals: 1 },
    { name: 'Tue', threat: 35, signals: 3 },
    { name: 'Wed', threat: 30, signals: 2, annotation: "Hindsight: Competitor updated checkout flow" },
    { name: 'Thu', threat: 50, signals: 5 },
    { name: 'Fri', threat: 45, signals: 4 },
    { name: 'Sat', threat: 60, signals: 7, annotation: "Hindsight: Enterprise pricing tier detected" },
    { name: 'Sun', threat: 75, signals: 8 },
  ];
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#12151C] border border-[#222631] px-3 py-2.5 rounded-md shadow-2xl"
        >
          <div className="flex justify-between items-center gap-6 mb-1">
            <span className="text-[#8A8F98] text-[11px] font-mono uppercase tracking-wider">{label}</span>
            <span className="text-[#F7F8F8] text-[13px] font-medium">{data.threat}</span>
          </div>
          {data.annotation && (
            <div className="mt-2 pt-2 border-t border-[#222631] max-w-[200px]">
              <p className="text-[11px] text-[#8A8F98] font-mono flex items-center gap-1.5 uppercase tracking-wider mb-1"><Zap size={10} className="text-[#5E6AD2]"/> Memory</p>
              <p className="text-[12px] text-[#E2E4E9] leading-snug">{data.annotation}</p>
            </div>
          )}
        </motion.div>
      );
    }
    return null;
  };

  const [emailing, setEmailing] = useState(false);
  
  const handleEmailReport = async () => {
    if (!compUrl) return alert("Please set a competitor URL first.");
    let email = localStorage.getItem('userEmail');
    if (!email || email === 'demo@senro.ai' || email === 'demo@senro.ai (Guest)') {
      const promptEmail = window.prompt("Enter the email address you want to receive the report:", "yourname@example.com");
      if (!promptEmail || promptEmail === "yourname@example.com") return;
      email = promptEmail;
    } else {
      if (!window.confirm(\`Ready to send report to \${email}?\`)) return;
    }
    setEmailing(true);
    try {
      const response = await fetch('/api/send-hindsight-report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, competitorUrl: compUrl }) });
      const res = await response.json();
      if (res.error) alert("Error: " + res.error);
      else alert("Hindsight Report sent!");
    } catch (e) { alert("Failed to send email."); } finally { setEmailing(false); }
  };

  const handleScan = async () => {
    if (!compUrl) return alert("Please set a competitor URL in settings first.");
    setLoading(true);
    try {
      const response = await fetch('/api/analyze-competitor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ownUrl, competitorUrls: [compUrl] }) });
      const result = await response.json();
      if (response.ok) {
        setData(result);
        localStorage.setItem('overviewData', JSON.stringify(result));
        if (result.analysis_summary) await ingestToHindsight(compUrl, result.analysis_summary);
      } else { alert("Error: " + result.error); }
    } catch (error) { alert("Failed to run analysis."); } finally { setLoading(false); }
  };

  const getDomain = (url: string) => { try { return new URL(url).hostname.replace('www.', ''); } catch { return url || 'competitor'; } };

  // Linear Animation configuration
  const linearTransition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] };
  const viewportConfig = { once: true, margin: "-40px" };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: linearTransition }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={viewportConfig}
      className="max-w-6xl mx-auto space-y-6 pb-12"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h2 className="text-[20px] font-semibold text-[#F7F8F8] tracking-tight">
            Dashboard
          </h2>
          <p className="text-[#8A8F98] text-[13px] mt-0.5">
            Monitoring <span className="text-[#E2E4E9]">{compUrl ? getDomain(compUrl) : 'competitors'}</span> against <span className="text-[#E2E4E9]">{getDomain(ownUrl)}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <motion.button 
            whileHover={{ y: -1, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEmailReport}
            disabled={emailing || loading}
            className="flex items-center gap-2 bg-[#12151C] border border-[#222631] text-[#E2E4E9] hover:bg-[#1A1D24] px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors shadow-sm shadow-black/20"
          >
            {emailing ? <Activity size={14} className="animate-spin text-[#8A8F98]" /> : <Mail size={14} className="text-[#8A8F98]" />}
            {emailing ? 'Sending...' : 'Email Report'}
          </motion.button>
          <motion.button 
            whileHover={{ y: -1, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.98 }}
            onClick={handleScan}
            disabled={loading}
            className="flex items-center gap-2 bg-[#5E6AD2] hover:bg-[#4f5bbf] text-white px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors border border-[#5E6AD2] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            {loading ? <Activity size={14} className="animate-spin" /> : <Zap size={14} />}
            {loading ? 'Analyzing...' : 'Trigger Scan'}
          </motion.button>
        </div>
      </motion.div>

      {/* Modular Grid Metrics */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#222631] border border-[#222631] rounded-lg overflow-hidden shadow-sm">
        <motion.div variants={itemVariants} className="bg-[#08090A] p-5 flex flex-col justify-between group relative">
          <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="text-[11px] font-mono text-[#8A8F98] uppercase tracking-widest flex items-center gap-2">Strategic Gap Index</div>
          <div className="mt-4 flex items-end justify-between">
            <div className="text-[28px] font-semibold text-[#F7F8F8] tracking-tight">{loading ? '--' : (data ? data.strategic_gap_index : '--')}</div>
            <TrendingUp size={16} strokeWidth={2} className="text-[#8A8F98] mb-1.5" />
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-[#08090A] p-5 flex flex-col justify-between group relative">
          <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="text-[11px] font-mono text-[#8A8F98] uppercase tracking-widest flex items-center gap-2">Traffic Impact</div>
          <div className="mt-4 flex items-end justify-between">
            <div className="text-[24px] font-semibold text-[#F7F8F8] tracking-tight">{loading ? '--' : (data ? data.net_traffic_impact : '--')}</div>
            <Activity size={16} strokeWidth={2} className="text-[#8A8F98] mb-1" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-[#08090A] p-5 flex flex-col justify-between group relative">
          <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="text-[11px] font-mono text-[#8A8F98] uppercase tracking-widest flex items-center gap-2">Threat Level</div>
          <div className="mt-4 flex items-end justify-between">
            <div className="text-[24px] font-semibold text-[#F7F8F8] capitalize tracking-tight">{loading ? '--' : (data ? data.risk_level : '--')}</div>
            <AlertTriangle size={16} strokeWidth={2} className={data?.risk_level === 'High' ? 'text-[#e85c5c] mb-1' : 'text-[#f5a623] mb-1'} />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-[#08090A] p-5 flex flex-col justify-between group relative">
          <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="text-[11px] font-mono text-[#8A8F98] uppercase tracking-widest flex items-center gap-2">Recent Signals</div>
          <div className="mt-4 flex items-end justify-between">
            <div className="text-[28px] font-semibold text-[#F7F8F8] tracking-tight">{loading ? '--' : (data ? data.signals_24h : '--')}</div>
            <div className="text-[12px] font-medium text-[#8A8F98] mb-1.5">{loading ? '--' : (data ? data.signals_total : '--')} total</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Chart Pane */}
      <motion.div variants={itemVariants} whileHover={{ y: -2, transition: { duration: 0.15 } }} className="bg-[#12151C] border border-[#222631] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[11px] font-mono text-[#8A8F98] uppercase tracking-widest">Threat Score Timeline (7 Days)</h3>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockTimelineData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222631" vertical={false} />
              <XAxis dataKey="name" stroke="#8A8F98" fontSize={11} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#8A8F98" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#222631', strokeWidth: 1 }} />
              <Line 
                type="stepAfter" 
                dataKey="threat" 
                stroke="#5E6AD2" 
                strokeWidth={1.5} 
                dot={false}
                activeDot={{ r: 4, fill: "#5E6AD2", stroke: "#12151C", strokeWidth: 2 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-3 space-y-6 flex flex-col">
          {data?.analysis_summary && (
            <motion.div variants={itemVariants} whileHover={{ y: -2, transition: { duration: 0.15 } }} className="bg-[#12151C] border border-[#222631] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] p-6 rounded-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[3px] h-full bg-[#5E6AD2]"></div>
              <h3 className="text-[11px] font-mono text-[#8A8F98] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Zap size={12} className="text-[#5E6AD2]"/> Executive Summary
              </h3>
              <p className="text-[#E2E4E9] text-[13px] leading-relaxed">
                {data.analysis_summary}
              </p>
            </motion.div>
          )}
          
          <motion.div variants={itemVariants} whileHover={{ y: -2, transition: { duration: 0.15 } }} className="bg-[#12151C] border border-[#222631] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] p-6 rounded-lg flex-1">
            <h3 className="text-[11px] font-mono text-[#8A8F98] uppercase tracking-widest mb-5">Raw Live Signals</h3>
            <div className="space-y-0 divide-y divide-[#222631]">
              {[
                { status: 'bg-[#27C93F]', text: 'Pricing page frequency increased (+12%)', time: '2h ago' },
                { status: 'bg-[#f5a623]', text: 'New "Enterprise" feature tier launched on homepage', time: '12h ago' },
                { status: 'bg-[#5E6AD2]', text: 'Checkout flow updated to require work email', time: '1d ago' }
              ].map((sig, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewportConfig}
                  transition={{ delay: i * 0.08, ...linearTransition }}
                  key={i} 
                  className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0 group"
                >
                  <div className="flex items-start gap-3">
                    <div className={\`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 \${sig.status}\`}></div>
                    <p className="text-[13px] text-[#E2E4E9] leading-snug font-medium group-hover:text-white transition-colors">{sig.text}</p>
                  </div>
                  <span className="text-[11px] text-[#8A8F98] font-mono tracking-wide flex-shrink-0 mt-0.5">{sig.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <motion.div variants={itemVariants} whileHover={{ y: -2, transition: { duration: 0.15 } }} className="lg:col-span-2 bg-[#12151C] border border-[#222631] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] p-6 rounded-lg flex flex-col">
          <h3 className="text-[11px] font-mono text-[#8A8F98] uppercase tracking-widest mb-5">Recommended Actions</h3>
          <div className="space-y-5 flex-1">
            <div className="group">
              <span className="text-[10px] font-semibold text-[#27C93F] bg-[#27C93F]/10 border border-[#27C93F]/20 px-2 py-0.5 rounded tracking-wide uppercase inline-block mb-2">Pricing Strategy</span>
              <p className="text-[13px] text-[#8A8F98] leading-relaxed group-hover:text-[#E2E4E9] transition-colors">Adjust standard tier messaging to highlight transparent pricing against competitor's new opaque enterprise model.</p>
            </div>
            <div className="group">
              <span className="text-[10px] font-semibold text-[#f5a623] bg-[#f5a623]/10 border border-[#f5a623]/20 px-2 py-0.5 rounded tracking-wide uppercase inline-block mb-2">Product Marketing</span>
              <p className="text-[13px] text-[#8A8F98] leading-relaxed group-hover:text-[#E2E4E9] transition-colors">Launch a comparison battlecard specifically targeting their missing SSO integration.</p>
            </div>
            <div className="group">
              <span className="text-[10px] font-semibold text-[#5E6AD2] bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 px-2 py-0.5 rounded tracking-wide uppercase inline-block mb-2">Sales Enablement</span>
              <p className="text-[13px] text-[#8A8F98] leading-relaxed group-hover:text-[#E2E4E9] transition-colors">Equip SDRs with objection handling for the competitor's new checkout flow changes.</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ y: -1, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 py-2 bg-[#1A1D24] border border-[#222631] hover:bg-[#222631] text-[#E2E4E9] rounded-md text-[13px] font-medium transition-colors"
          >
            Generate Counter-Moves
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
`
fs.writeFileSync('src/components/Overview.tsx', code);
console.log('Overview.tsx converted to Linear design system.');
