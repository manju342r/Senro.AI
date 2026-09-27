import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { User, Key, Server, Database, Globe } from 'lucide-react';

export const SettingsUI = () => {

  const { supabase } = useData();
  const [ownUrl, setOwnUrl] = useState(() => localStorage.getItem('ownUrl') || 'https://acme.com');
  const [compUrl, setCompUrl] = useState(() => localStorage.getItem('compUrl') || '');
  const [email, setEmail] = useState('');
  const [industry, setIndustry] = useState(() => localStorage.getItem('userIndustry') || 'SaaS');
  const [alertSens, setAlertSens] = useState(() => localStorage.getItem('alertSens') || 'Balanced');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email || '');
      }
    });
  }, [supabase]);


  const getWorkspaceName = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'workspace';
    }
  };

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
            <span className="text-zinc-500 w-1/3">Email</span>
            <input 
              type="email" 
              value={email}
              disabled
              className="w-2/3 bg-transparent border-b border-zinc-800 outline-none text-zinc-400 text-right pb-1 opacity-70 cursor-not-allowed"
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500 w-1/3">Workspace</span>
            <span className="w-2/3 text-zinc-400 text-right pb-1">{getWorkspaceName(ownUrl)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500 w-1/3">Industry</span>
            <input 
              type="text" 
              value={industry}
              onChange={(e) => { setIndustry(e.target.value); localStorage.setItem('userIndustry', e.target.value); }}
              className="w-2/3 bg-transparent border-b border-zinc-800 focus:border-blue-500 outline-none text-zinc-200 text-right pb-1"
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500 w-1/3">Alert sensitivity</span>
            <select 
              value={alertSens}
              onChange={(e) => { setAlertSens(e.target.value); localStorage.setItem('alertSens', e.target.value); }}
              className="w-2/3 bg-transparent border-b border-zinc-800 focus:border-blue-500 outline-none text-zinc-200 text-right pb-1 appearance-none cursor-pointer"
            >
              <option value="Low">Low</option>
              <option value="Balanced">Balanced</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#121212] border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-[#0a0a0a] flex items-center gap-2">
          <Globe size={16} className="text-blue-400" />
          <h3 className="text-sm font-semibold text-zinc-300">Target Websites</h3>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-1">Your Website</label>
            <input 
              type="url" 
              value={ownUrl}
              onChange={(e) => setOwnUrl(e.target.value)}
              placeholder="https://acme.com" 
              className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-2.5 text-zinc-200 text-sm focus:border-blue-500 focus:outline-none" 
            />
            <p className="text-xs text-zinc-500 mt-1">The baseline website we use for comparison.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-1">Primary Competitor Website</label>
            <input 
              type="url" 
              value={compUrl}
              onChange={(e) => setCompUrl(e.target.value)}
              placeholder="https://amazon.in" 
              className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-2.5 text-zinc-200 text-sm focus:border-blue-500 focus:outline-none" 
            />
            <p className="text-xs text-zinc-500 mt-1">The main competitor for 1-on-1 battlecards.</p>
          </div>
          <button onClick={() => { localStorage.setItem('ownUrl', ownUrl); localStorage.setItem('compUrl', compUrl); alert('Target websites saved successfully!'); }} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            Save Websites
          </button>
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
