import React from 'react';
import { Activity } from 'lucide-react';

export const LiveSignals = () => {
  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Live signals</h2>
          <p className="text-zinc-500 text-sm mt-1">Real-time alerts triggered by competitor changes.</p>
        </div>
        <div className="bg-amber-500/10 text-amber-500 border border-amber-500/30 px-3 py-1.5 rounded text-sm font-medium">
          Scraping not configured
        </div>
      </div>

      <div className="border border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center p-24 text-center">
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
          <Activity size={32} className="text-zinc-700" />
        </div>
        <h3 className="text-zinc-300 font-medium mb-1">No signals recorded yet</h3>
        <p className="text-zinc-500 text-sm max-w-sm">
          Run a scan or wait for scheduled monitoring to detect changes in competitor pricing, messaging, or features.
        </p>
      </div>
    </div>
  );
};
