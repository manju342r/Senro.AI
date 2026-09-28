import React from 'react';
import { Search, ChevronDown, RefreshCw, Trash2, ExternalLink } from 'lucide-react';


export const CompareHub = () => {
  const [compUrl, setCompUrl] = React.useState(() => localStorage.getItem('compUrl') || '');
  const [data] = React.useState<any>(() => {
    try {
      const stored = localStorage.getItem('overviewData');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url || 'No competitor';
    }
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Competitor matrix</h2>
        </div>
      </div>

      <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a]">
          <div className="flex gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="text" placeholder="Search..." className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-md pl-9 pr-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-blue-500" />
            </div>
            <button className="flex items-center gap-2 bg-zinc-900/60 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-md text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
              All risk levels <ChevronDown size={14} />
            </button>
            <button className="flex items-center gap-2 bg-zinc-900/60 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-md text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
              All categories <ChevronDown size={14} />
            </button>
          </div>
          <button onClick={() => alert("Initiating deep comparison matrix using Hindsight Context...")} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium px-4 py-1.5 rounded-md transition-colors">
            Compare
          </button>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-[#0a0a0a] border-b border-white/5 text-zinc-500 font-medium">
            <tr>
              <th className="p-4 w-12"><input type="checkbox" className="rounded border-zinc-700 bg-zinc-900/60 backdrop-blur-md" /></th>
              <th className="p-4">COMPETITOR</th>
              <th className="p-4">CATEGORY</th>
              <th className="p-4">PRICING</th>
              <th className="p-4">SENTIMENT</th>
              <th className="p-4">RISK</th>
              <th className="p-4">LAST SCAN</th>
              <th className="p-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {compUrl ? (
            <tr className="hover:bg-zinc-900/60 backdrop-blur-md/50 transition-colors">
              <td className="p-4"><input type="checkbox" className="rounded border-zinc-700 bg-zinc-900/60 backdrop-blur-md" /></td>
              <td className="p-4">
                <div className="flex items-center gap-2 text-zinc-200 font-medium">
                  {getDomain(compUrl)}
                  <a href={compUrl} target="_blank" rel="noreferrer"><ExternalLink size={14} className="text-zinc-500 hover:text-blue-400 cursor-pointer" /></a>
                </div>
              </td>
              <td className="p-4 text-zinc-300">Technology</td>
              <td className="p-4 text-zinc-300 capitalize">{data?.risk_level === "High" ? "Enterprise" : "Standard"}</td>
              <td className="p-4">
                <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[75%]"></div>
                </div>
              </td>
              <td className="p-4">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${data?.risk_level === "High" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"}`}>{data?.risk_level || "Medium"}</span>
              </td>
              <td className="p-4 text-zinc-400">Just now</td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-3 text-zinc-500">
                  <RefreshCw size={16} className="hover:text-zinc-300 cursor-pointer transition-colors" />
                  <Trash2 size={16} onClick={() => { if(window.confirm("Remove this competitor?")) { localStorage.removeItem("compUrl"); window.location.reload(); } }} className="hover:text-red-400 cursor-pointer transition-colors" />
                </div>
              </td>
            </tr>
            ) : (
            <tr>
              <td colSpan={8} className="p-8 text-center text-zinc-500">No competitors added yet.</td>
            </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
