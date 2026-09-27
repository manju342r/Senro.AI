const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add LogOut icon
content = content.replace(
  'Activity, FileText\n} from \'lucide-react\';',
  'Activity, FileText, LogOut\n} from \'lucide-react\';'
);

const layoutLogic = `
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { supabase } = useData();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    localStorage.clear();
    navigate('/login');
  };

  const handleAddCompetitor = () => {`;

content = content.replace(
  `const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [showModal, setShowModal] = React.useState(false);`,
  `const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { supabase } = useData();

  const handleSignOut = async () => {
    try { await supabase.auth.signOut(); } catch (e) {}
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const [showModal, setShowModal] = React.useState(false);`
);

const logoutButton = `
        <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 mt-4 py-2 text-xs font-medium text-zinc-500 hover:text-red-400 transition-colors">
          <LogOut size={14} /> Sign out
        </button>
      </div>`;

content = content.replace(
  `          <span>Off</span>
        </div>
      </div>`,
  `          <span>Off</span>
        </div>
        <div className="pt-2">
          <button onClick={handleSignOut} className="w-full flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-red-400 transition-colors">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>`
);

fs.writeFileSync('src/App.tsx', content);
