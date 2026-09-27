import React, { useState } from 'react';
import { Calendar, Clock, Mail, CheckCircle2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export const ScheduledReports = () => {
  const { supabase } = useData();
  const [email] = useState(() => localStorage.getItem('userEmail') || 'demo@senro.ai');
  const [reportFreq, setReportFreq] = useState(() => localStorage.getItem('reportFreq') || 'never');
  const [saved, setSaved] = useState(false);

  const handleSave = async (val: string) => {
    setReportFreq(val);
    localStorage.setItem('reportFreq', val);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    try {
      await supabase.from('user_settings').update({ email_report_frequency: val }).eq('email', email);
    } catch(e) {}
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
          <Calendar className="text-blue-500" /> Automated Reports
        </h2>
        <p className="text-zinc-500 text-sm mt-1">Configure your email intelligence summaries sent via Resend & Vercel Cron.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div 
          onClick={() => handleSave('daily')}
          className={`cursor-pointer border rounded-xl p-6 transition-all ${reportFreq === 'daily' ? 'bg-blue-500/10 border-blue-500' : 'bg-[#121212] border-zinc-800 hover:border-zinc-700'}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${reportFreq === 'daily' ? 'bg-blue-600' : 'bg-zinc-800'}`}>
              <Mail size={18} className="text-white" />
            </div>
            {reportFreq === 'daily' && <CheckCircle2 size={20} className="text-blue-500" />}
          </div>
          <h3 className="text-zinc-200 font-bold text-lg mb-1">Daily Brief</h3>
          <p className="text-zinc-500 text-sm">Sent every morning at 8:00 AM. Perfect for a quick daily pulse.</p>
        </div>

        <div 
          onClick={() => handleSave('twice_a_day')}
          className={`cursor-pointer border rounded-xl p-6 transition-all ${reportFreq === 'twice_a_day' ? 'bg-emerald-500/10 border-emerald-500' : 'bg-[#121212] border-zinc-800 hover:border-zinc-700'}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${reportFreq === 'twice_a_day' ? 'bg-emerald-600' : 'bg-zinc-800'}`}>
              <Clock size={18} className="text-white" />
            </div>
            {reportFreq === 'twice_a_day' && <CheckCircle2 size={20} className="text-emerald-500" />}
          </div>
          <h3 className="text-zinc-200 font-bold text-lg mb-1">Twice a Day</h3>
          <p className="text-zinc-500 text-sm">Sent at 8:00 AM and 5:00 PM. Stay on top of rapid changes.</p>
        </div>

        <div 
          onClick={() => handleSave('weekly')}
          className={`cursor-pointer border rounded-xl p-6 transition-all ${reportFreq === 'weekly' ? 'bg-purple-500/10 border-purple-500' : 'bg-[#121212] border-zinc-800 hover:border-zinc-700'}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${reportFreq === 'weekly' ? 'bg-purple-600' : 'bg-zinc-800'}`}>
              <Calendar size={18} className="text-white" />
            </div>
            {reportFreq === 'weekly' && <CheckCircle2 size={20} className="text-purple-500" />}
          </div>
          <h3 className="text-zinc-200 font-bold text-lg mb-1">Weekly Digest</h3>
          <p className="text-zinc-500 text-sm">Sent every Monday. A high-level overview of the week's shifts.</p>
        </div>
      </div>

      <div className="flex items-center justify-between bg-[#121212] border border-zinc-800 rounded-xl p-5">
        <div>
          <h4 className="text-zinc-300 font-medium text-sm">Pause automated reports</h4>
          <p className="text-zinc-500 text-xs mt-1">Temporarily stop receiving email summaries.</p>
        </div>
        <button 
          onClick={() => handleSave('never')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${reportFreq === 'never' ? 'bg-zinc-800 text-zinc-400 cursor-default' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20'}`}
        >
          {reportFreq === 'never' ? 'Currently Paused' : 'Pause Emails'}
        </button>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-up">
          <CheckCircle2 size={16} /> Schedule updated successfully
        </div>
      )}
    </div>
  );
};
