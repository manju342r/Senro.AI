const fs = require('fs');
let content = fs.readFileSync('src/components/LiveSignals.tsx', 'utf8');

const liveState = `
export const LiveSignals = () => {
  const [isConfigured, setIsConfigured] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/config-status')
      .then(res => res.json())
      .then(data => setIsConfigured(data.configured))
      .catch(() => {});
  }, []);
`;

content = content.replace(
  `export const LiveSignals = () => {`,
  liveState
);

content = content.replace(
  `<div className="bg-amber-500/10 text-amber-500 border border-amber-500/30 px-3 py-1.5 rounded text-sm font-medium">
          Scraping not configured
        </div>`,
  `{isConfigured ? (
          <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 px-3 py-1.5 rounded text-sm font-medium">
            Scraping Active
          </div>
        ) : (
          <div className="bg-amber-500/10 text-amber-500 border border-amber-500/30 px-3 py-1.5 rounded text-sm font-medium">
            Scraping offline
          </div>
        )}`
);

fs.writeFileSync('src/components/LiveSignals.tsx', content);
