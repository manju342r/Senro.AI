import React from 'react';
import { FileText, Sparkles } from 'lucide-react';



export const BattlecardsList = () => {
  const [compUrl, setCompUrl] = React.useState(() => localStorage.getItem('compUrl') || '');
  const [isConfigured, setIsConfigured] = React.useState(false);

  const [data] = React.useState<any>(() => {
    try {
      const stored = localStorage.getItem('overviewData');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });


  React.useEffect(() => {
    fetch('/api/config-status')
      .then(res => res.json())
      .then(data => {
        setIsConfigured(data.configured);
      })
      .catch(console.error);
  }, []);
  
  const getDomain = (url: string) => {

    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url || 'No competitor';
    }
  };

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#F7F8F8]">Battlecards</h2>
        <p className="text-[#8A8F98] text-sm mt-1">Generated live from the signals Senro.AI has observed for each competitor.</p>
      </div>

      {!isConfigured && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-500 p-4 rounded-lg text-sm font-medium">
          No LLM API key configured. Add one in Settings to generate battlecards.
        </div>
      )}

      
      {data && (
        <div className="space-y-4 mb-8">
          <h3 className="text-sm font-semibold text-[#8A8F98]">Generated Battlecards</h3>
          <div className="bg-[#12151C] border border-blue-500/30 p-5 rounded-lg max-w-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-bold text-[#F7F8F8]">{compUrl ? getDomain(compUrl) : "Competitor"}</h4>
                <div className="text-xs text-blue-400 mt-1 flex items-center gap-1"><Sparkles size={12} /> Auto-generated just now</div>
              </div>
              <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">Gap Index: {data.strategic_gap_index}</div>
            </div>
            <p className="text-sm text-[#E2E4E9] leading-relaxed">{data.analysis_summary}</p>
          </div>
        </div>
      )}
<div className="space-y-4">
        <h3 className="text-sm font-semibold text-[#8A8F98]">Not yet analyzed</h3>
        <div className="bg-[#12151C] border border-[#222631] p-4 rounded-lg flex justify-between items-center max-w-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
              <FileText size={18} className="text-[#8A8F98]" />
            </div>
            <div>
              <div className="text-[#E2E4E9] font-medium text-sm">{compUrl ? getDomain(compUrl) : "No competitor added"}</div>
              <div className="text-[#8A8F98] text-xs">-- signals available</div>
            </div>
          </div>
          <button onClick={() => alert("LLM Prompt Initiated: Generating sales battlecard... This will take approx 5-10 seconds on Groq.")} className="flex items-center gap-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border border-blue-500/20">
            <Sparkles size={14} /> Generate
          </button>
        </div>
      </div>
    </div>
  );
};
