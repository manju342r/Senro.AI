import React from 'react';
import { FileText, Sparkles } from 'lucide-react';

export const BattlecardsList = () => {
  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Battlecards</h2>
        <p className="text-zinc-500 text-sm mt-1">Generated live from the signals Senro.AI has observed for each competitor.</p>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 text-amber-500 p-4 rounded-lg text-sm font-medium">
        No LLM API key configured. Add one in Settings to generate battlecards.
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-zinc-400">Not yet analyzed</h3>
        <div className="bg-[#121212] border border-zinc-800 p-4 rounded-xl flex justify-between items-center max-w-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
              <FileText size={18} className="text-zinc-400" />
            </div>
            <div>
              <div className="text-zinc-200 font-medium text-sm">amazon.in</div>
              <div className="text-zinc-500 text-xs">0 signals available</div>
            </div>
          </div>
          <button className="flex items-center gap-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border border-blue-500/20">
            <Sparkles size={14} /> Generate
          </button>
        </div>
      </div>
    </div>
  );
};
