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
          <h2 className="text-2xl font-bold text-[#F7F8F8]">Competitor matrix</h2>
        </div>
      </div>

      <div className="bg-[#12151C] border border-[#222631] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#222631] flex justify-between items-center bg-[#08090A]">
          <div className="flex gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8F98]" />
              <input type="text" placeholder="Search..." className="bg-[#12151C] border border-[#222631] rounded-md pl-9 pr-3 py-1.5 text-sm text-[#E2E4E9] focus:outline-none focus:border-blue-500" />
            </div>
            <button className="flex items-center gap-2 bg-[#12151C] border border-[#222631] px-3 py-1.5 rounded-md text-sm text-[#E2E4E9] hover:bg-zinc-800 transition-colors">
              All risk levels <ChevronDown size={14} />
            </button>
            <button className="flex items-center gap-2 bg-[#12151C] border border-[#222631] px-3 py-1.5 rounded-md text-sm text-[#E2E4E9] hover:bg-zinc-800 transition-colors">
              All categories <ChevronDown size={14} />
            </button>
          </div>
          <button onClick={() => alert("Initiating deep comparison matrix using Hindsight Context...")} className="bg-zinc-800 hover:bg-zinc-700 text-[#E2E4E9] text-sm font-medium px-4 py-1.5 rounded-md transition-colors">
            Compare
          </button>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-[#08090A] border-b border-[#222631] text-[#8A8F98] font-medium">
            <tr>
              <th className="p-4 w-12"><input type="checkbox" className="rounded border-zinc-700 bg-[#12151C]" /></th>
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
            <tr className="hover:bg-[#12151C]/50 transition-colors">
              <td className="p-4"><input type="checkbox" className="rounded border-zinc-700 bg-[#12151C]" /></td>
              <td className="p-4">
                <div className="flex items-center gap-2 text-[#E2E4E9] font-medium">
                  {getDomain(compUrl)}
                  <a href={compUrl} target="_blank" rel="noreferrer"><ExternalLink size={14} className="text-[#8A8F98] hover:text-blue-400 cursor-pointer" /></a>
                </div>
              </td>
              <td className="p-4 text-[#E2E4E9]">Technology</td>
              <td className="p-4 text-[#E2E4E9] capitalize">{data?.risk_level === "High" ? "Enterprise" : "Standard"}</td>
              <td className="p-4">
                <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[75%]"></div>
                </div>
              </td>
              <td className="p-4">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${data?.risk_level === "High" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"}`}>{data?.risk_level || "Medium"}</span>
              </td>
              <td className="p-4 text-[#8A8F98]">Just now</td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-3 text-[#8A8F98]">
                  <RefreshCw size={16} className="hover:text-[#E2E4E9] cursor-pointer transition-colors" />
                  <Trash2 size={16} onClick={() => { if(window.confirm("Remove this competitor?")) { localStorage.removeItem("compUrl"); window.location.reload(); } }} className="hover:text-red-400 cursor-pointer transition-colors" />
                </div>
              </td>
            </tr>
            ) : (
            <tr>
              <td colSpan={8} className="p-8 text-center text-[#8A8F98]">No competitors added yet.</td>
            </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
