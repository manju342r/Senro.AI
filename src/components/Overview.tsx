import React, { useState, useEffect } from 'react';
import { Target, Zap, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
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
    { name: 'Wed', threat: 30, signals: 2 },
    { name: 'Thu', threat: 50, signals: 5 },
    { name: 'Fri', threat: 45, signals: 4 },
    { name: 'Sat', threat: 60, signals: 7 },
    { name: 'Sun', threat: 75, signals: 8 },
  ];

  

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
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#e4e4e7' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Area type="monotone" dataKey="threat" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorThreat)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        
      </div>

      {/* Analysis Block */}
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
    </div>
  );
};
