import React, { useState, useEffect } from 'react';

export const Overview = () => {
  const [ownUrl, setOwnUrl] = useState(() => localStorage.getItem('ownUrl') || 'https://acme.com');
  const [compUrl, setCompUrl] = useState(() => localStorage.getItem('compUrl') || '');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  const analyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownUrl || !compUrl) return;
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/analyze-competitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownUrl, competitorUrls: [compUrl] })
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Analysis failed');
      } else {
        setData(json);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getWorkspaceName = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'workspace';
    }
  };

  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">{getWorkspaceName(ownUrl)} radar</h2>
          <p className="text-zinc-500 text-sm mt-1">Live competitive position across 1 tracked competitor.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => alert("Scan initiated. Senro.AI is checking for new competitor signals in the background.")} className="flex items-center gap-2 bg-transparent border border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <span className="opacity-50">⚡</span> Trigger scan
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <span className="opacity-50">↓</span> Export summary
          </button>
        </div>
      </div>

      <form onSubmit={analyze} className="bg-[#121212] p-4 rounded-xl border border-zinc-800 flex gap-4">
        <input 
          type="url" 
          value={ownUrl} 
          onChange={e => setOwnUrl(e.target.value)} 
          placeholder="Your Website" 
          className="flex-1 bg-[#0a0a0a] border border-zinc-800 rounded-lg p-2.5 text-zinc-200 text-sm focus:border-blue-500 focus:outline-none" 
        />
        <input 
          type="url" 
          value={compUrl} 
          onChange={e => setCompUrl(e.target.value)} 
          placeholder="Competitor Website" 
          className="flex-1 bg-[#0a0a0a] border border-zinc-800 rounded-lg p-2.5 text-zinc-200 text-sm focus:border-blue-500 focus:outline-none" 
        />
        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (Threat Score) */}
        <div className="col-span-1 bg-[#121212] border border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center text-center">
          <div className="relative w-40 h-40 mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="40" stroke="#1f2937" strokeWidth="8" fill="none" />
              <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset={loading ? 251.2 : (data ? 251.2 * (1 - (data.strategic_gap_index / 100)) : 251.2)} className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-zinc-100">{loading ? '--' : (data ? data.strategic_gap_index : '--')}</span>
              <span className="text-emerald-500 text-sm font-medium">Contained</span>
            </div>
          </div>
          <h3 className="text-zinc-100 font-semibold mb-2">Threat score</h3>
          <p className="text-zinc-500 text-xs">Weighted from competitor risk levels and high-impact signals in the last 7 days.</p>
        </div>

        {/* Right Column (2x2 Grid) */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-[#121212] border border-zinc-800 p-6 rounded-xl border-t-2 border-t-blue-500">
            <div className="text-xs font-semibold text-zinc-500 tracking-wider mb-4">TRACKED COMPETITORS</div>
            <div className="text-3xl font-bold text-zinc-100">{loading ? '--' : (data ? data.tracked_competitors : '1')}</div>
            <div className="text-xs text-zinc-500 mt-2">0 with a baseline</div>
          </div>
          
          <div className="bg-[#121212] border border-zinc-800 p-6 rounded-xl border-t-2 border-t-blue-500">
            <div className="text-xs font-semibold text-zinc-500 tracking-wider mb-4">NET TRAFFIC IMPACT</div>
            <div className="text-3xl font-bold text-blue-400">{loading ? '--' : (data ? data.impact_metric : '--')}</div>
            <div className="text-xs text-zinc-500 mt-2">Estimated by LLM</div>
          </div>

          <div className="bg-[#121212] border border-zinc-800 p-6 rounded-xl border-t-2 border-t-cyan-500">
            <div className="text-xs font-semibold text-zinc-500 tracking-wider mb-4">SIGNALS (24H)</div>
            <div className="text-3xl font-bold text-zinc-100">0</div>
            <div className="text-xs text-zinc-500 mt-2">0 total recorded</div>
          </div>

          <div className="bg-[#121212] border border-zinc-800 p-6 rounded-xl border-t-2 border-t-emerald-500">
            <div className="text-xs font-semibold text-zinc-500 tracking-wider mb-4">BATTLECARDS</div>
            <div className="text-3xl font-bold text-zinc-100">0</div>
            <div className="text-xs text-zinc-500 mt-2">AI-generated</div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="bg-[#121212] border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-[#0a0a0a]">
          <h3 className="text-sm font-semibold text-zinc-300">Recent web scrapes</h3>
          <span className="text-xs text-blue-400 cursor-pointer hover:text-blue-300">View all signals →</span>
        </div>
        <div className="p-4 flex items-center justify-between hover:bg-zinc-900/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <div>
              <div className="text-sm font-medium text-zinc-200">{compUrl ? getWorkspaceName(compUrl) : "No competitor"}</div>
              <div className="text-xs text-zinc-500">Never scraped</div>
            </div>
          </div>
          <div className="text-sm text-blue-400 hover:underline cursor-pointer">
            {compUrl ? getWorkspaceName(compUrl) : ""} {compUrl && "↗"}
          </div>
        </div>
      </div>

      <div className="bg-[#121212] border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-[#0a0a0a]">
          <h3 className="text-sm font-semibold text-zinc-300">Latest signals</h3>
        </div>
        <div className="p-16 flex items-center justify-center text-center">
          <span className="text-sm text-zinc-500">No changes detected yet. Run a scan after a competitor updates their site.</span>
        </div>
      </div>

    </div>
  );
};
