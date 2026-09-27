const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace DashboardLayout
const newDashboardLayout = `const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 flex font-sans">
    <aside className="w-64 bg-[#121212] border-r border-zinc-800 flex flex-col justify-between">
      <div>
        <div className="p-5 flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg flex items-center justify-center">
            <Target size={18} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-zinc-100 tracking-wide">Senro.AI</h1>
        </div>
        
        <nav className="px-3 mt-4 space-y-1">
          <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Overview" />
          <SidebarItem to="/dashboard/compare" icon={GitCompare} label="Competitors" />
          <SidebarItem to="/dashboard/live-signals" icon={Activity} label="Live Signals" />
          <SidebarItem to="/dashboard/battlecards" icon={FileText} label="Battlecards" />
          <SidebarItem to="/dashboard/settings" icon={Settings} label="Settings" />
        </nav>
      </div>

      <div className="p-5 border-t border-zinc-800 space-y-2">
        <div className="flex justify-between items-center text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-zinc-700"></div> Scraping
          </div>
          <span>Off</span>
        </div>
        <div className="flex justify-between items-center text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-zinc-700"></div> LLM
          </div>
          <span>Off</span>
        </div>
      </div>
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
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
            <Plus size={16} /> Add Competitor
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            FL
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-8">
        {children}
      </div>
    </main>
  </div>
);`;

// Extract before DashboardLayout
const beforeDL = content.substring(0, content.indexOf('const DashboardLayout ='));

// Add lucide icons imports
let modifiedBeforeDL = beforeDL.replace(
  "import { \n  LayoutDashboard, Users, GitCompare, LineChart, Settings, \n  Search, Plus, Target, CheckCircle2, ArrowRight\n} from 'lucide-react';",
  "import { \n  LayoutDashboard, Users, GitCompare, LineChart, Settings, \n  Search, Plus, Target, CheckCircle2, ArrowRight, Activity, FileText\n} from 'lucide-react';"
);

// We need to remove the inline components and replace them with imports
let imports = `
import { Overview } from './components/Overview';
import { CompareHub } from './components/CompareHub';
import { BattlecardsList } from './components/BattlecardsList';
import { LiveSignals } from './components/LiveSignals';
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
          <Route path="/dashboard/live-signals" element={<DashboardLayout><LiveSignals /></DashboardLayout>} />
          <Route path="/dashboard/battlecards" element={<DashboardLayout><BattlecardsList /></DashboardLayout>} />
          <Route path="/dashboard/settings" element={<DashboardLayout><SettingsUI /></DashboardLayout>} />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
`;

fs.writeFileSync('src/App.tsx', modifiedBeforeDL + newDashboardLayout + imports);
