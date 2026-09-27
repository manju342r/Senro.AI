const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const layoutState = `
  const [isConfigured, setIsConfigured] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/config-status')
      .then(res => res.json())
      .then(data => setIsConfigured(data.configured))
      .catch(() => {});
  }, []);
`;

content = content.replace(
  `  const [showModal, setShowModal] = React.useState(false);`,
  `  const [showModal, setShowModal] = React.useState(false);\n${layoutState}`
);

const oldIndicators = `        <div className="flex justify-between items-center text-xs text-zinc-500">
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
        </div>`;

const newIndicators = `        <div className="flex justify-between items-center text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <div className={\`w-2 h-2 rounded-full \${isConfigured ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-700'}\`}></div> Scraping
          </div>
          <span className={isConfigured ? 'text-emerald-500 font-medium' : ''}>{isConfigured ? 'On' : 'Off'}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <div className={\`w-2 h-2 rounded-full \${isConfigured ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-700'}\`}></div> LLM
          </div>
          <span className={isConfigured ? 'text-emerald-500 font-medium' : ''}>{isConfigured ? 'On' : 'Off'}</span>
        </div>`;

content = content.replace(oldIndicators, newIndicators);

fs.writeFileSync('src/App.tsx', content);
