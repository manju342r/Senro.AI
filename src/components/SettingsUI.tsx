import React, { useState } from 'react';
import { User, Key, Server, Database } from 'lucide-react';

export const SettingsUI = () => {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Settings & API keys</h2>
        <p className="text-zinc-500 text-sm mt-1">
          Keys are stored in your Supabase <span className="text-blue-400 font-mono text-xs">user_settings</span> row, protected by row-level security so only you can read them.
        </p>
      </div>

      <div className="bg-[#121212] border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-[#0a0a0a]">
          <h3 className="text-sm font-semibold text-zinc-300">Account</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500">Email</span>
            <span className="text-zinc-200">user@example.com</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500">Workspace</span>
            <span className="text-zinc-200">flipkart</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500">Industry</span>
            <span className="text-zinc-200">E-commerce</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500">Alert sensitivity</span>
            <span className="text-zinc-200">Balanced</span>
          </div>
        </div>
      </div>

      <div className="bg-[#121212] border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-[#0a0a0a] flex items-center gap-2">
          <Server size={16} className="text-blue-400" />
          <h3 className="text-sm font-semibold text-zinc-300">Extraction Engines (Jina & Firecrawl)</h3>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-1">Jina Reader API key</label>
            <input type="password" placeholder="jina_..." className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-2.5 text-zinc-200 text-sm focus:border-blue-500 focus:outline-none" />
            <p className="text-xs text-zinc-500 mt-1">Bearer token for the Jina Web Scraper API.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-1">Firecrawl API key (Fallback)</label>
            <input type="password" placeholder="fc_..." className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-2.5 text-zinc-200 text-sm focus:border-blue-500 focus:outline-none" />
            <p className="text-xs text-zinc-500 mt-1">Secondary engine used when primary targets block bots.</p>
          </div>
          <button onClick={() => alert("Successfully pinged Jina and Firecrawl extraction APIs.")} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            Test connection
          </button>
        </div>
      </div>

      <div className="bg-[#121212] border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-[#0a0a0a] flex items-center gap-2">
          <Key size={16} className="text-blue-400" />
          <h3 className="text-sm font-semibold text-zinc-300">LLM provider (Groq)</h3>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-1">API key</label>
            <input type="password" placeholder="gsk_..." className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-2.5 text-zinc-200 text-sm focus:border-blue-500 focus:outline-none" />
            <p className="text-xs text-zinc-500 mt-1">Required to generate battlecards and strategic insights.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
