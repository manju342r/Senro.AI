const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsUI.tsx', 'utf8');

const accountBlock = `
      <div className="bg-[#121212] border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-[#0a0a0a]">
          <h3 className="text-sm font-semibold text-zinc-300">Account</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500 w-1/3">Email</span>
            <input 
              type="email" 
              value={email}
              onChange={(e) => { setEmail(e.target.value); localStorage.setItem('userEmail', e.target.value); }}
              className="w-2/3 bg-transparent border-b border-zinc-800 focus:border-blue-500 outline-none text-zinc-200 text-right pb-1"
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500 w-1/3">Workspace</span>
            <span className="w-2/3 text-zinc-400 text-right pb-1">{getWorkspaceName(ownUrl)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500 w-1/3">Industry</span>
            <input 
              type="text" 
              value={industry}
              onChange={(e) => { setIndustry(e.target.value); localStorage.setItem('userIndustry', e.target.value); }}
              className="w-2/3 bg-transparent border-b border-zinc-800 focus:border-blue-500 outline-none text-zinc-200 text-right pb-1"
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500 w-1/3">Alert sensitivity</span>
            <select 
              value={alertSens}
              onChange={(e) => { setAlertSens(e.target.value); localStorage.setItem('alertSens', e.target.value); }}
              className="w-2/3 bg-transparent border-b border-zinc-800 focus:border-blue-500 outline-none text-zinc-200 text-right pb-1 appearance-none cursor-pointer"
            >
              <option value="Low">Low</option>
              <option value="Balanced">Balanced</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
      </div>
`;

// Extract state definition
const stateInject = `
  const [ownUrl, setOwnUrl] = useState(() => localStorage.getItem('ownUrl') || 'https://acme.com');
  const [compUrl, setCompUrl] = useState(() => localStorage.getItem('compUrl') || '');
  const [email, setEmail] = useState(() => localStorage.getItem('userEmail') || 'founder@startup.com');
  const [industry, setIndustry] = useState(() => localStorage.getItem('userIndustry') || 'SaaS');
  const [alertSens, setAlertSens] = useState(() => localStorage.getItem('alertSens') || 'Balanced');

  const getWorkspaceName = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'workspace';
    }
  };
`;

content = content.replace(
  `  const [ownUrl, setOwnUrl] = useState(() => localStorage.getItem('ownUrl') || 'https://acme.com');\n  const [compUrl, setCompUrl] = useState(() => localStorage.getItem('compUrl') || '');`,
  stateInject
);

const accountOldStart = `<div className="bg-[#121212] border border-zinc-800 rounded-xl overflow-hidden">\n        <div className="p-4 border-b border-zinc-800 bg-[#0a0a0a]">`;
const accountOldEnd = `      <div className="bg-[#121212] border border-zinc-800 rounded-xl overflow-hidden">\n        <div className="p-4 border-b border-zinc-800 bg-[#0a0a0a] flex items-center gap-2">`;
const startIndex = content.indexOf(accountOldStart);
const endIndex = content.indexOf(accountOldEnd);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + accountBlock + '\n' + content.substring(endIndex);
}

fs.writeFileSync('src/components/SettingsUI.tsx', content);
