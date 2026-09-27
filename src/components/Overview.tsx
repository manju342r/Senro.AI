import React, { useState, useEffect } from 'react';
import { Target, Zap, TrendingUp, AlertTriangle, Activity, Mail } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  
} from 'recharts';

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
        <div className="bg-[#18181b] border border-zinc-800 p-3 rounded-lg shadow-xl">
          <p className="text-zinc-300 font-medium mb-1">{label}</p>
          <p className="text-blue-400 text-sm">Threat Score: {data.threat}</p>
          {data.annotation && (
            <div className="mt-2 pt-2 border-t border-zinc-800 max-w-[200px]">
              <p className="text-xs text-amber-500 font-medium flex items-center gap-1"><Zap size={10} /> Memory Annotation</p>
              <p className="text-xs text-zinc-400 mt-1">{data.annotation}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  

  
  const [emailing, setEmailing] = useState(false);
  
  const handleEmailReport = async () => {
    if (!compUrl) return alert("Please set a competitor URL first.");
    const email = localStorage.getItem('userEmail');
    if (!email) return alert("You must be logged in to receive emails.");
    
    setEmailing(true);
    try {
      const response = await fetch('/api/send-hindsight-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, competitorUrl: compUrl })
      });
      const res = await response.json();
      if (res.error) alert("Error: " + res.error);
      else alert("Hindsight Report emailed successfully!");
    } catch (e) {
      alert("Failed to send email.");
    } finally {
      setEmailing(false);
    }
  };

  const handleScan = async () => {
    if (!compUrl) return alert("Please set a competitor URL in settings first.");
    setLoading(true);
    
    try {
      const response = await fetch('/api/analyze-competitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownUrl: ownUrl,
          competitorUrls: [compUrl]
        })
      });

      const result = await response.json();
      if (response.ok) {
        setData(result);
        localStorage.setItem('overviewData', JSON.stringify(result));
        if (result.analysis_summary) {
          await ingestToHindsight(compUrl, result.analysis_summary);
        }
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      alert("Failed to run analysis.");
    } finally {
      setLoading(false);
    }
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url || 'competitor';
    }
  };

  return (
    <div className="max-w-7xl space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-zinc-100 flex items-center gap-2">
            Dashboard
          </h2>
          <p className="text-zinc-500 text-sm mt-1">
            Monitoring <span className="font-medium text-zinc-300">{compUrl ? getDomain(compUrl) : 'competitors'}</span> against <span className="font-medium text-zinc-300">{getDomain(ownUrl)}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleEmailReport}
            disabled={emailing || loading}
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {emailing ? <Activity size={16} className="animate-spin text-zinc-400" /> : <Mail size={16} className="text-zinc-400" />}
            {emailing ? 'Sending...' : 'Email Hindsight Report'}
          </button>
          <button 
            onClick={handleScan}
            disabled={loading}
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <Activity size={16} className="animate-spin text-blue-500" /> : <Zap size={16} className="text-amber-500" />}
            {loading ? 'Analyzing...' : 'Trigger Scan'}
          </button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#121212] border border-zinc-800 p-5 rounded-xl flex flex-col justify-between">
          <div className="text-xs font-semibold text-zinc-500 tracking-wider">STRATEGIC GAP INDEX</div>
          <div className="mt-4 flex items-end justify-between">
            <div className="text-4xl font-bold text-zinc-100">{loading ? '--' : (data ? data.strategic_gap_index : '--')}</div>
            <TrendingUp size={20} className="text-emerald-500 mb-1" />
          </div>
        </div>
        
        <div className="bg-[#121212] border border-zinc-800 p-5 rounded-xl flex flex-col justify-between">
          <div className="text-xs font-semibold text-zinc-500 tracking-wider">TRAFFIC IMPACT</div>
          <div className="mt-4 flex items-end justify-between">
            <div className="text-2xl font-bold text-zinc-100">{loading ? '--' : (data ? data.net_traffic_impact : '--')}</div>
            <Activity size={20} className="text-blue-500 mb-1" />
          </div>
        </div>

        <div className="bg-[#121212] border border-zinc-800 p-5 rounded-xl flex flex-col justify-between">
          <div className="text-xs font-semibold text-zinc-500 tracking-wider">THREAT LEVEL</div>
          <div className="mt-4 flex items-end justify-between">
            <div className="text-2xl font-bold text-zinc-100 capitalize">{loading ? '--' : (data ? data.risk_level : '--')}</div>
            <AlertTriangle size={20} className={data?.risk_level === 'High' ? 'text-red-500 mb-1' : 'text-amber-500 mb-1'} />
          </div>
        </div>

        <div className="bg-[#121212] border border-zinc-800 p-5 rounded-xl flex flex-col justify-between">
          <div className="text-xs font-semibold text-zinc-500 tracking-wider">RECENT SIGNALS</div>
          <div className="mt-4 flex items-end justify-between">
            <div className="text-4xl font-bold text-zinc-100">{loading ? '--' : (data ? data.signals_24h : '--')}</div>
            <div className="text-xs text-zinc-500 mb-1">{loading ? '--' : (data ? data.signals_total : '--')} total</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-3 bg-[#121212] border border-zinc-800 p-6 rounded-xl">
          <h3 className="text-sm font-semibold text-zinc-300 mb-6">Threat Score Timeline (7 Days)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTimelineData}>
                <defs>
                  <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="threat" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorThreat)" activeDot={{ r: 6, fill: "#3b82f6", stroke: "#121212", strokeWidth: 2 }} dot={(props: any) => { const { cx, cy, payload } = props; if (payload.annotation) { return <circle cx={cx} cy={cy} r={4} fill="#f59e0b" stroke="#121212" strokeWidth={2} key={payload.name} />; } return <circle cx={cx} cy={cy} r={0} key={payload.name} />; }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        
      </div>

      {/* Analysis Block */}
      
      {/* 2-Column Split: 60% / 40% */}
      <div className="grid grid-cols-5 gap-6">
        {/* LEFT COLUMN (60%) */}
        <div className="col-span-3 space-y-6">
          {data?.analysis_summary && (
            <div className="bg-[#121212] border border-blue-500/30 p-6 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                <Zap size={16} /> AI Executive Summary
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed">
                {data.analysis_summary}
              </p>
            </div>
          )}
          
          <div className="bg-[#121212] border border-zinc-800 p-6 rounded-xl">
            <h3 className="text-sm font-semibold text-zinc-300 mb-4">Raw Live Signals</h3>
            <div className="space-y-4">
              {[
                { status: 'bg-emerald-500', text: 'Pricing page frequency increased (+12%)' },
                { status: 'bg-amber-500', text: 'New "Enterprise" feature tier launched on homepage' },
                { status: 'bg-blue-500', text: 'Checkout flow updated to require work email' }
              ].map((sig, i) => (
                <div key={i} className="flex items-start gap-3 border-b border-zinc-800/50 pb-3 last:border-0 last:pb-0">
                  <div className={"w-2 h-2 rounded-full mt-1.5 flex-shrink-0 " + sig.status}></div>
                  <p className="text-sm text-zinc-400">{sig.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (40%) */}
        <div className="col-span-2 bg-[#121212] border border-zinc-800 p-6 rounded-xl flex flex-col">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Recommended Actions</h3>
          <div className="space-y-5 flex-1">
            <div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded tracking-wide">[Pricing Strategy]</span>
              <p className="text-sm text-zinc-300 mt-2">Adjust standard tier messaging to highlight transparent pricing against competitor's new opaque enterprise model.</p>
            </div>
            <div>
              <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded tracking-wide">[Product Marketing]</span>
              <p className="text-sm text-zinc-300 mt-2">Launch a comparison battlecard specifically targeting their missing SSO integration.</p>
            </div>
            <div>
              <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded tracking-wide">[Sales Enablement]</span>
              <p className="text-sm text-zinc-300 mt-2">Equip SDRs with objection handling for the competitor's new checkout flow changes.</p>
            </div>
          </div>
          <button className="w-full mt-6 py-2.5 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-lg text-sm font-medium transition-colors">
            Generate Counter-Moves
          </button>
        </div>
      </div>

    </div>
  );
};
