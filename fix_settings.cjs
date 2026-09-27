const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsUI.tsx', 'utf8');

const targetWebsitesBlock = `
      <div className="bg-[#121212] border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-[#0a0a0a] flex items-center gap-2">
          <Globe size={16} className="text-blue-400" />
          <h3 className="text-sm font-semibold text-zinc-300">Target Websites</h3>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-1">Your Website</label>
            <input 
              type="url" 
              value={ownUrl}
              onChange={(e) => setOwnUrl(e.target.value)}
              placeholder="https://acme.com" 
              className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-2.5 text-zinc-200 text-sm focus:border-blue-500 focus:outline-none" 
            />
            <p className="text-xs text-zinc-500 mt-1">The baseline website we use for comparison.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-1">Primary Competitor Website</label>
            <input 
              type="url" 
              value={compUrl}
              onChange={(e) => setCompUrl(e.target.value)}
              placeholder="https://amazon.in" 
              className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-2.5 text-zinc-200 text-sm focus:border-blue-500 focus:outline-none" 
            />
            <p className="text-xs text-zinc-500 mt-1">The main competitor for 1-on-1 battlecards.</p>
          </div>
          <button onClick={() => { localStorage.setItem('ownUrl', ownUrl); localStorage.setItem('compUrl', compUrl); alert('Target websites saved successfully!'); }} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            Save Websites
          </button>
        </div>
      </div>
`;

// Insert the new block after the Account block
const accountEndStr = '</div>\n      </div>';
const accountEndIndex = content.indexOf(accountEndStr) + accountEndStr.length;

content = content.slice(0, accountEndIndex) + '\n' + targetWebsitesBlock + content.slice(accountEndIndex);

// Add imports
content = content.replace(
  "import { User, Key, Server, Database } from 'lucide-react';",
  "import { User, Key, Server, Database, Globe } from 'lucide-react';"
);

// Add state
content = content.replace(
  'export const SettingsUI = () => {',
  `export const SettingsUI = () => {
  const [ownUrl, setOwnUrl] = useState(() => localStorage.getItem('ownUrl') || 'https://acme.com');
  const [compUrl, setCompUrl] = useState(() => localStorage.getItem('compUrl') || '');`
);

fs.writeFileSync('src/components/SettingsUI.tsx', content);
