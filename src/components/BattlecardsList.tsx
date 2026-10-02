import React from 'react';
import { FileText, Download, ExternalLink, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const BattlecardsList = () => {

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-6xl space-y-8">
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-content tracking-tight">Battlecards</h2>
          <p className="text-muted text-sm mt-1 font-medium">AI-generated sales enablement materials to win competitive deals.</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -4 }} className="bg-surface/80 backdrop-blur-xl border border-line hover:border-brand-emerald/30 p-6 rounded-2xl flex flex-col justify-between shadow-lg transition-colors group">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center text-brand-mint group-hover:scale-110 transition-transform">
                <FileText size={20} />
              </div>
              <span className="text-xs font-bold text-muted tracking-widest uppercase">Pricing Objection</span>
            </div>
            <h3 className="text-lg font-bold text-content mb-2 group-hover:text-brand-mint transition-colors">Enterprise Tier Objection Handling</h3>
            <p className="text-muted text-sm leading-relaxed mb-6">Generated 2 days ago after competitor updated their standard pricing model to obscure enterprise limits.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex-1 bg-input hover:bg-surface-hover text-content py-2 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2">
              <Download size={16} /> Export PDF
            </button>
          </div>
        </motion.div>
        
        <motion.div whileHover={{ y: -4 }} className="bg-surface/80 backdrop-blur-xl border border-dashed border-line p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg transition-colors hover:border-line-hover hover:bg-surface/50">
          <div className="w-12 h-12 bg-input rounded-full flex items-center justify-center text-muted mb-3">
            <Zap size={20} />
          </div>
          <h3 className="text-content font-bold mb-1">Generate New</h3>
          <p className="text-muted text-sm max-w-[200px]">Select a competitor and topic to generate a new battlecard.</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
