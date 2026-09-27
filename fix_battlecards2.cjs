const fs = require('fs');
let content = fs.readFileSync('src/components/BattlecardsList.tsx', 'utf8');

const logic = `
export const BattlecardsList = () => {
  const [compUrl, setCompUrl] = React.useState(() => localStorage.getItem('compUrl') || '');
  const [isConfigured, setIsConfigured] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/config-status')
      .then(res => res.json())
      .then(data => {
        setIsConfigured(data.configured);
      })
      .catch(console.error);
  }, []);
  
  const getDomain = (url: string) => {
`;

content = content.replace(`export const BattlecardsList = () => {
  const [compUrl, setCompUrl] = React.useState(() => localStorage.getItem('compUrl') || '');
  
  const getDomain = (url: string) => {`, logic);

content = content.replace(
  `<div className="bg-amber-500/10 border border-amber-500/30 text-amber-500 p-4 rounded-lg text-sm font-medium">\n        No LLM API key configured. Add one in Settings to generate battlecards.\n      </div>`,
  `{!isConfigured && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-500 p-4 rounded-lg text-sm font-medium">
          No LLM API key configured. Add one in Settings to generate battlecards.
        </div>
      )}`
);

fs.writeFileSync('src/components/BattlecardsList.tsx', content);
