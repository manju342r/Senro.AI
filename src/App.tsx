import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { DataProvider, useData } from './contexts/DataContext';
import { 
  LayoutDashboard, Users, GitCompare, LineChart, Settings, 
  Search, Plus, Target, CheckCircle2, ArrowRight
} from 'lucide-react';
import React, { useState } from 'react';

// --- AUTHENTICATION VIEWS (Strictly Email/Password) ---
const AuthScreen = ({ isLogin }: { isLogin: boolean }) => {
  const navigate = useNavigate();
  const { supabase } = useData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // On successful signup, push them to the onboarding wizard
        navigate('/onboarding/step-1');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 flex">
      <div className="w-full flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 bg-[#121212] p-10 rounded-2xl border border-zinc-800 shadow-2xl">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Target size={28} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-zinc-100">Senro.AI</h1>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
          </div>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Email address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
              <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>
            
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors mt-6 shadow-lg shadow-blue-900/20">
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link to={isLogin ? "/signup" : "/login"} className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
              {isLogin ? "Sign up" : "Log in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- ONBOARDING FLOW ---
const OnboardingLayout = ({ children, step }: { children: React.ReactNode, step: number }) => (
  <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 flex flex-col items-center justify-center p-8">
    <div className="w-full max-w-xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <Target size={20} className="text-blue-500" /> Senro.AI Setup
        </h1>
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 w-12 rounded-full transition-colors ${i <= step ? 'bg-blue-500' : 'bg-zinc-800'}`} />
          ))}
        </div>
      </div>
      <div className="bg-[#121212] border border-zinc-800 p-8 rounded-2xl shadow-xl">
        {children}
      </div>
      <div className="mt-6 text-center">
        <Link to="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
          Skip this for now (Testing)
        </Link>
      </div>
    </div>
  </div>
);

const OnboardingStep1 = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  
  return (
    <OnboardingLayout step={1}>
      <h2 className="text-2xl font-bold text-zinc-100 mb-2">My Workspace</h2>
      <p className="text-zinc-500 mb-6 text-sm">Tell us about your company so we can monitor your own visibility baseline.</p>
      <form onSubmit={(e) => { 
        e.preventDefault(); 
        if(url) localStorage.setItem('ownUrl', url);
        navigate('/onboarding/step-2'); 
      }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Company Name</label>
          <input type="text" required placeholder="e.g. Acme Corp" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:border-blue-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Company Website Link</label>
          <input type="url" required value={url} onChange={e => setUrl(e.target.value)} placeholder="https://acme.com" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:border-blue-500 focus:outline-none" />
        </div>
        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors mt-6">
          Next Step <ArrowRight size={18} />
        </button>
      </form>
    </OnboardingLayout>
  );
};

const OnboardingStep2 = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [compUrl, setCompUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(compUrl) localStorage.setItem('compUrl', compUrl);
    setLoading(true);
    try {
      const res = await fetch('/api/config-status');
      const data = await res.json();
      if (data.configured) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding/step-3');
      }
    } catch (err) {
      console.error(err);
      navigate('/onboarding/step-3'); // fallback
    }
  };

  return (
    <OnboardingLayout step={2}>
      <h2 className="text-2xl font-bold text-zinc-100 mb-2">The Opponent</h2>
      <p className="text-zinc-500 mb-6 text-sm">Who is your primary competitor? We will track their changes against your baseline.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Opponent Company Name</label>
          <input type="text" required placeholder="e.g. Globex" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:border-blue-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Opponent Website Link</label>
          <input type="url" required value={compUrl} onChange={e => setCompUrl(e.target.value)} placeholder="https://globex.com" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:border-blue-500 focus:outline-none" />
        </div>
        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors mt-6">
          {loading ? 'Checking configuration...' : <>Next Step <ArrowRight size={18} /></>}
        </button>
      </form>
    </OnboardingLayout>
  );
};

const OnboardingStep3 = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    fetch('/api/config-status')
      .then(res => res.json())
      .then(data => {
        if (data.configured) {
          navigate('/dashboard');
        }
      })
      .catch(console.error);
  }, [navigate]);

  return (
    <OnboardingLayout step={3}>
      <h2 className="text-2xl font-bold text-zinc-100 mb-2">API Configuration</h2>
      <p className="text-zinc-500 mb-6 text-sm">Connect the engines powering Senro.AI's memory, scraping, and email systems.</p>
      <form onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Jina API Key</label>
            <input type="password" placeholder="Optional" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-200 focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Vectorize Hindsight Key</label>
            <input type="password" placeholder="Optional" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-200 focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Resend Key</label>
            <input type="password" placeholder="Optional" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-200 focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">LLM Key</label>
            <input type="password" placeholder="Optional" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-200 focus:border-blue-500 focus:outline-none" />
          </div>
        </div>
        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition-colors mt-6 shadow-lg shadow-emerald-900/20">
          Complete Setup <CheckCircle2 size={18} />
        </button>
      </form>
    </OnboardingLayout>
  );
};


// --- DASHBOARD LAYOUT ---
const SidebarItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-md mb-1 transition-colors text-sm font-medium ${
        isActive ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
      }`}
    >
      <Icon size={18} className={isActive ? 'text-blue-500' : 'text-zinc-500'} />
      {label}
    </Link>
  );
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 flex font-sans">
    <aside className="w-64 bg-[#121212] border-r border-zinc-800 flex flex-col">
      <div className="p-5 flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg flex items-center justify-center">
          <Target size={18} className="text-white" />
        </div>
        <h1 className="text-lg font-bold text-zinc-100 tracking-wide">Senro.AI</h1>
      </div>
      
      <nav className="flex-1 px-3 mt-4 space-y-1">
        <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Overview" />
        <SidebarItem to="/dashboard/compare" icon={GitCompare} label="Competitors" />
        <SidebarItem to="/dashboard/battlecards" icon={Users} label="Battlecards" />
        <SidebarItem to="/dashboard/performance" icon={LineChart} label="Performance" />
        <SidebarItem to="/dashboard/settings" icon={Settings} label="Settings" />
      </nav>
    </aside>

    <main className="flex-1 flex flex-col h-screen overflow-hidden">
      <header className="h-16 border-b border-zinc-800 bg-[#0a0a0a] px-6 flex justify-between items-center shrink-0">
        <div className="relative w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" placeholder="Search memory or competitors..." 
            className="w-full bg-[#121212] border border-zinc-800 text-sm text-zinc-200 rounded-md pl-9 pr-4 py-1.5 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          A
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-8">
        {children}
      </div>
    </main>
  </div>
);

// --- DASHBOARD VIEWS ---
const Overview = () => {
  const [ownUrl, setOwnUrl] = React.useState(() => localStorage.getItem('ownUrl') || 'https://acme.com');
  const [compUrl, setCompUrl] = React.useState(() => localStorage.getItem('compUrl') || '');
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<any>(null);
  const [error, setError] = React.useState('');

  const analyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownUrl || !compUrl) return;
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/analyze-competitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownUrl, competitorUrls: [compUrl] })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Analysis failed');
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Global Threat & Visibility</h2>
        <p className="text-zinc-500 text-sm mt-1">High-level threat score and visibility comparison.</p>
      </div>

      <form onSubmit={analyze} className="bg-[#121212] border border-zinc-800 p-5 rounded-xl flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1 w-full">
          <label className="block text-xs font-medium text-zinc-400 mb-1">Your Website</label>
          <input type="url" value={ownUrl} onChange={e => setOwnUrl(e.target.value)} required className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-200 focus:border-blue-500 focus:outline-none" />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-xs font-medium text-zinc-400 mb-1">Competitor Website</label>
          <input type="url" value={compUrl} onChange={e => setCompUrl(e.target.value)} required placeholder="https://..." className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-200 focus:border-blue-500 focus:outline-none" />
        </div>
        <button type="submit" disabled={loading} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#121212] border border-zinc-800 p-6 rounded-xl border-t-2 border-t-blue-500">
          <div className="text-xs font-semibold text-zinc-500 tracking-wider mb-2">TRACKED COMPETITORS</div>
          {loading ? <div className="h-10 bg-zinc-800 animate-pulse rounded w-16"></div> : (
            <div className="text-4xl font-bold text-zinc-100">{data ? data.tracked_competitors : '--'}</div>
          )}
        </div>
        <div className="bg-[#121212] border border-zinc-800 p-6 rounded-xl border-t-2 border-t-emerald-500">
          <div className="text-xs font-semibold text-zinc-500 tracking-wider mb-2">STRATEGIC GAP INDEX</div>
          {loading ? <div className="h-10 bg-zinc-800 animate-pulse rounded w-32"></div> : (
            <>
              <div className="text-4xl font-bold text-emerald-400">{data ? `${data.strategic_gap_index}/100` : '--'}</div>
              <div className="text-sm text-zinc-500 mt-1">{data ? data.reasoning : 'Awaiting analysis'}</div>
            </>
          )}
        </div>
        <div className="bg-[#121212] border border-zinc-800 p-6 rounded-xl border-t-2 border-t-blue-500">
          <div className="text-xs font-semibold text-zinc-500 tracking-wider mb-2">NET TRAFFIC IMPACT</div>
          {loading ? <div className="h-10 bg-zinc-800 animate-pulse rounded w-24"></div> : (
            <>
              <div className="text-4xl font-bold text-blue-400">{data ? data.impact_metric : '--'}</div>
              <div className="text-sm text-zinc-500 mt-1">Estimated by LLM</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const CompareHub = () => (
  <div className="max-w-6xl mx-auto space-y-6">
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Head-to-Head Breakdown</h2>
        <p className="text-zinc-500 text-sm mt-1">Side-by-side analysis against specific competitors.</p>
      </div>
    </div>
    <div className="bg-[#121212] border border-zinc-800 rounded-xl p-6">
      <h3 className="font-semibold text-zinc-100 mb-4">Actionable Recommendations (Hindsight Conditioned)</h3>
      <div className="space-y-4">
        <div className="p-4 border border-zinc-800 rounded-lg flex justify-between items-center bg-[#0a0a0a]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs font-semibold">Pricing Structure</span>
              <span className="text-zinc-100 font-medium text-sm">Add transparent tiers</span>
            </div>
            <p className="text-xs text-zinc-400">Competitor X added a free tier. Hindsight indicates transparent tables drive +12% engagement.</p>
          </div>
          <button className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1.5 rounded-md text-xs font-medium border border-emerald-500/20 transition">
            <CheckCircle2 size={14} /> Mark as Implemented
          </button>
        </div>
      </div>
    </div>
  </div>
);

const PerformanceLoop = () => (
  <div className="max-w-6xl mx-auto space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-zinc-100">Closed-Loop Analytics</h2>
      <p className="text-zinc-500 text-sm mt-1">Tracking the real-world traffic impact of implemented recommendations.</p>
    </div>

    <div className="bg-[#121212] border border-zinc-800 rounded-xl p-6">
      <h3 className="font-semibold text-zinc-100 mb-4">Hindsight Opinion Network Insights</h3>
      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg text-sm text-purple-200 italic">
        "Learned Heuristic: For Workspace AcmeCorp, competitive changes matching 'social proof' consistently outperform 'aggressive price slashing'. Feature matrices yield +12% engagement; removal of free trial decreased traffic by 5%."
      </div>
    </div>
  </div>
);

import { BattlecardsList } from './components/BattlecardsList';
import { SettingsUI } from './components/SettingsUI';

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthScreen isLogin={true} />} />
          <Route path="/signup" element={<AuthScreen isLogin={false} />} />
          
          <Route path="/onboarding/step-1" element={<OnboardingStep1 />} />
          <Route path="/onboarding/step-2" element={<OnboardingStep2 />} />
          <Route path="/onboarding/step-3" element={<OnboardingStep3 />} />
          
          <Route path="/dashboard" element={<DashboardLayout><Overview /></DashboardLayout>} />
          <Route path="/dashboard/compare" element={<DashboardLayout><CompareHub /></DashboardLayout>} />
          <Route path="/dashboard/battlecards" element={<DashboardLayout><BattlecardsList /></DashboardLayout>} />
          <Route path="/dashboard/performance" element={<DashboardLayout><PerformanceLoop /></DashboardLayout>} />
          <Route path="/dashboard/settings" element={<DashboardLayout><SettingsUI /></DashboardLayout>} />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
