const fs = require('fs');

const code = `import React, { useState } from 'react';
import { Calendar, Clock, Mail, CheckCircle2, Send, Activity } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

export const ScheduledReports = () => {
  const { supabase } = useData();
  const [email] = useState(() => localStorage.getItem('userEmail') || 'demo@senro.ai');
  const [compUrl] = useState(() => localStorage.getItem('compUrl') || '');
  const [reportFreq, setReportFreq] = useState(() => localStorage.getItem('reportFreq') || 'never');
  const [customTime, setCustomTime] = useState(() => localStorage.getItem('reportTime') || '08:00');
  const [saved, setSaved] = useState(false);
  const [sendingNow, setSendingNow] = useState(false);

  const handleSaveFreq = async (val: string) => {
    setReportFreq(val);
    localStorage.setItem('reportFreq', val);
    showSavedToast();
    try { await supabase.from('user_settings').update({ email_report_frequency: val }).eq('email', email); } catch(e) {}
  };

  const handleSaveTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomTime(val);
    localStorage.setItem('reportTime', val);
    showSavedToast();
  };

  const showSavedToast = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSendNow = async () => {
    if (!compUrl) return alert("Please set a competitor URL in Settings first.");
    let targetEmail = email;
    if (email === 'demo@senro.ai') {
      const promptEmail = window.prompt("You are using a guest account. What email address should we send the report to?", "yourname@example.com");
      if (!promptEmail || promptEmail === "yourname@example.com") return;
      targetEmail = promptEmail;
    } else {
      if (!window.confirm(\`Ready to send the report to \${targetEmail}?\`)) return;
    }
    setSendingNow(true);
    try {
      const response = await fetch('/api/send-hindsight-report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: targetEmail, competitorUrl: compUrl }) });
      const res = await response.json();
      if (res.error) alert("Error: " + res.error);
      else alert("Report sent successfully!");
    } catch (e) { alert("Failed to send email."); } finally { setSendingNow(false); }
  };

  const linearTransition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] };
  const viewportConfig = { once: true, margin: "-40px" };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: linearTransition }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={viewportConfig}
      className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 pb-12"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h2 className="text-[20px] font-semibold text-[#F7F8F8] flex items-center gap-2 tracking-tight">
             Automated Reports
          </h2>
          <p className="text-[#8A8F98] text-[13px] mt-0.5">Configure your email intelligence summaries sent via Resend & Vercel Cron.</p>
        </div>
        <motion.button 
          whileHover={{ y: -1, transition: { duration: 0.15 } }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSendNow}
          disabled={sendingNow}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#5E6AD2] hover:bg-[#4f5bbf] disabled:opacity-50 text-white px-4 py-1.5 rounded-md text-[13px] font-medium transition-colors border border-[#5E6AD2] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
        >
          {sendingNow ? <Activity size={14} className="animate-spin" /> : <Send size={14} />}
          {sendingNow ? 'Sending...' : 'Send Email Now'}
        </motion.button>
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          onClick={() => handleSaveFreq('daily')}
          className={\`cursor-pointer border rounded-lg p-5 transition-colors group \${reportFreq === 'daily' ? 'bg-[#1A1D24] border-[#5E6AD2] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]' : 'bg-[#12151C] border-[#222631] hover:border-[#383E4E] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]'}\`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className={\`w-8 h-8 rounded flex items-center justify-center transition-colors \${reportFreq === 'daily' ? 'bg-[#5E6AD2]' : 'bg-[#222631] group-hover:bg-[#383E4E]'}\`}>
              <Mail size={14} className="text-white" />
            </div>
            {reportFreq === 'daily' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 size={16} className="text-[#5E6AD2]" /></motion.div>}
          </div>
          <h3 className="text-[#F7F8F8] font-medium text-[14px] mb-1">Daily Brief</h3>
          <p className="text-[#8A8F98] text-[13px] leading-relaxed">A quick daily pulse of competitor changes.</p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          onClick={() => handleSaveFreq('twice_a_day')}
          className={\`cursor-pointer border rounded-lg p-5 transition-colors group \${reportFreq === 'twice_a_day' ? 'bg-[#1A1D24] border-[#27C93F] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]' : 'bg-[#12151C] border-[#222631] hover:border-[#383E4E] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]'}\`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className={\`w-8 h-8 rounded flex items-center justify-center transition-colors \${reportFreq === 'twice_a_day' ? 'bg-[#27C93F]' : 'bg-[#222631] group-hover:bg-[#383E4E]'}\`}>
              <Clock size={14} className="text-white" />
            </div>
            {reportFreq === 'twice_a_day' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 size={16} className="text-[#27C93F]" /></motion.div>}
          </div>
          <h3 className="text-[#F7F8F8] font-medium text-[14px] mb-1">Twice a Day</h3>
          <p className="text-[#8A8F98] text-[13px] leading-relaxed">Sent morning and evening for rapid updates.</p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          onClick={() => handleSaveFreq('weekly')}
          className={\`cursor-pointer border rounded-lg p-5 transition-colors group \${reportFreq === 'weekly' ? 'bg-[#1A1D24] border-[#9333EA] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]' : 'bg-[#12151C] border-[#222631] hover:border-[#383E4E] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]'}\`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className={\`w-8 h-8 rounded flex items-center justify-center transition-colors \${reportFreq === 'weekly' ? 'bg-[#9333EA]' : 'bg-[#222631] group-hover:bg-[#383E4E]'}\`}>
              <Calendar size={14} className="text-white" />
            </div>
            {reportFreq === 'weekly' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 size={16} className="text-[#9333EA]" /></motion.div>}
          </div>
          <h3 className="text-[#F7F8F8] font-medium text-[14px] mb-1">Weekly Digest</h3>
          <p className="text-[#8A8F98] text-[13px] leading-relaxed">A high-level overview sent every Monday.</p>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} whileHover={{ y: -2, transition: { duration: 0.15 } }} className="bg-[#12151C] border border-[#222631] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h3 className="text-[#F7F8F8] font-medium text-[14px] mb-0.5">Preferred Delivery Time</h3>
          <p className="text-[#8A8F98] text-[13px]">Choose exactly when you want your scheduled reports to arrive.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Clock size={16} className="text-[#8A8F98] hidden sm:block" />
          <input 
            type="time" 
            value={customTime}
            onChange={handleSaveTime}
            className="w-full sm:w-auto bg-[#08090A] border border-[#222631] text-[#E2E4E9] text-[13px] rounded-md px-3 py-1.5 focus:outline-none focus:border-[#5E6AD2] transition-colors"
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} whileHover={{ y: -2, transition: { duration: 0.15 } }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#12151C] border border-[#222631] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] rounded-lg p-5 gap-6">
        <div>
          <h4 className="text-[#F7F8F8] font-medium text-[14px] mb-0.5">Pause automated reports</h4>
          <p className="text-[#8A8F98] text-[13px]">Temporarily stop receiving email summaries.</p>
        </div>
        <motion.button 
          whileHover={reportFreq !== 'never' ? { y: -1, transition: { duration: 0.15 } } : {}}
          whileTap={reportFreq !== 'never' ? { scale: 0.98 } : {}}
          onClick={() => handleSaveFreq('never')}
          className={\`w-full sm:w-auto px-4 py-1.5 rounded-md text-[13px] font-medium transition-colors \${reportFreq === 'never' ? 'bg-[#08090A] text-[#8A8F98] cursor-default border border-[#222631]' : 'bg-[#e85c5c]/10 text-[#e85c5c] hover:bg-[#e85c5c] hover:text-white border border-[#e85c5c]/20'}\`}
        >
          {reportFreq === 'never' ? 'Currently Paused' : 'Pause Emails'}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {saved && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={linearTransition}
            className="fixed bottom-6 right-6 bg-[#27C93F] text-white px-4 py-2.5 rounded-md shadow-xl flex items-center gap-2 text-[13px] font-medium"
          >
            <CheckCircle2 size={16} /> Preferences updated
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
`
fs.writeFileSync('src/components/ScheduledReports.tsx', code);
console.log('ScheduledReports.tsx converted to Linear design system.');
