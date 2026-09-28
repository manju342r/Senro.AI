import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { LogOut } from 'lucide-react';

export const Profile = () => {
  const [email] = useState(() => localStorage.getItem('userEmail') || 'demo@senro.ai (Guest)');
  const navigate = useNavigate();
  const { supabase } = useData();
  

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      alert('Password reset link has been sent to your email address!');
    } catch (e: any) {
      alert('Error sending password reset: ' + e.message);
    }
  };

  const handleSignOut = async () => {
    try { await supabase.auth.signOut(); } catch (e) {}
    localStorage.removeItem('userEmail');
    navigate('/login');
  };
  const [ownUrl] = useState(() => localStorage.getItem('ownUrl') || 'https://acme.com');
  
  const getWorkspaceName = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '').split('.')[0];
    } catch {
      return 'workspace';
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#F7F8F8]">User Profile</h2>
        <p className="text-[#8A8F98] text-sm mt-1">View your account details and associated company workspace.</p>
      </div>

      <div className="bg-[#12151C] border border-[#222631] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#222631] bg-[#08090A]">
          <h3 className="text-sm font-semibold text-[#E2E4E9]">Account Details</h3>
        </div>
        <div className="p-6 space-y-6">
          
          <div className="flex items-center gap-4 border-b border-[#222631]/50 pb-6">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl">
              {email.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-lg font-medium text-[#E2E4E9]">{email}</div>
              <div className="text-sm text-[#8A8F98]">Administrator</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-medium text-[#8A8F98] uppercase tracking-wider mb-2">Company Name</label>
              <div className="text-[#E2E4E9] capitalize font-medium text-lg">{getWorkspaceName(ownUrl)}</div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8A8F98] uppercase tracking-wider mb-2">Company URL</label>
              <div className="text-blue-400 hover:underline font-medium text-lg">
                <a href={ownUrl} target="_blank" rel="noreferrer">{ownUrl}</a>
              </div>
            </div>
          </div>



          <div className="pt-6 border-t border-[#222631]/50 flex flex-col gap-3">
            <button onClick={handlePasswordReset} className="flex items-center justify-center gap-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 border border-blue-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto">
              Change password via Email
            </button>
            <button onClick={handleSignOut} className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto">
              <LogOut size={16} /> Sign out of Senro.AI
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
