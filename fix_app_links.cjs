const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add Profile import
content = content.replace(
  "import { SettingsUI } from './components/SettingsUI';",
  "import { SettingsUI } from './components/SettingsUI';\nimport { Profile } from './components/Profile';"
);

// 2. Wrap Logo in Link
content = content.replace(
  `<div className="p-5 flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg flex items-center justify-center">
            <Target size={18} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-zinc-100 tracking-wide">Senro.AI</h1>
        </div>`,
  `<Link to="/dashboard" className="p-5 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="bg-blue-600 p-1.5 rounded-lg flex items-center justify-center">
            <Target size={18} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-zinc-100 tracking-wide">Senro.AI</h1>
        </Link>`
);

// 3. Update Avatar in Header
const headerAvatarHTML = `<div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            FL
          </div>`;
const newHeaderAvatarHTML = `<Link to="/dashboard/profile" className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all">
            {(localStorage.getItem('userEmail') || 'F').charAt(0).toUpperCase()}
          </Link>`;

content = content.replace(headerAvatarHTML, newHeaderAvatarHTML);

// 4. Add Route for Profile
content = content.replace(
  `<Route path="/dashboard/settings" element={<DashboardLayout><SettingsUI /></DashboardLayout>} />`,
  `<Route path="/dashboard/settings" element={<DashboardLayout><SettingsUI /></DashboardLayout>} />\n          <Route path="/dashboard/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />`
);

fs.writeFileSync('src/App.tsx', content);
