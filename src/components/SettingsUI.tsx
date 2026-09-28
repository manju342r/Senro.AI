import React from 'react';
import { Save, Key } from 'lucide-react';
import { motion } from 'framer-motion';

export const SettingsUI = () => {

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-8 pb-12">
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Settings</h2>
        <p className="text-zinc-500 text-sm mt-1 font-medium">Manage your workspace configuration and integrations.</p>
      </motion.div>
      
      <motion.div variants={itemVariants} className="bg-[#121212]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2"><Key size={18} className="text-violet-500" /> API Keys</h3>
          <p className="text-zinc-400 text-sm mt-1">Configure your LLM and scraping integrations.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Vectorize Key (Hindsight)</label>
              <input type="password" placeholder="sk-..." className="w-full bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Jina AI Key</label>
              <input type="password" placeholder="jina-..." className="w-full bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button onClick={() => alert("Settings saved.")} className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-violet-900/20 hover:shadow-violet-900/40 flex items-center gap-2 transform hover:-translate-y-0.5">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
