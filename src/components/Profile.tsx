import React from 'react';
import { User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';

export const Profile = () => {
  const email = localStorage.getItem('userEmail') || 'F';
  const { supabase } = useData();

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-8 pb-12">
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Your Profile</h2>
      </motion.div>
      
      <motion.div variants={itemVariants} className="bg-[#121212]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-lg p-8 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-4xl mb-4 shadow-xl">
          {email.charAt(0).toUpperCase()}
        </div>
        <h3 className="text-xl font-bold text-zinc-100">{email}</h3>
        <p className="text-zinc-500 text-sm mt-1 mb-8">Senro.AI Administrator</p>
        
        <button onClick={async () => { await supabase.auth.signOut(); localStorage.removeItem('userEmail'); window.location.href = '/login'; }} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
          <LogOut size={16} /> Sign out of Senro.AI
        </button>
      </motion.div>
    </motion.div>
  );
};
