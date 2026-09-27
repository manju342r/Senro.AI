const fs = require('fs');
let content = fs.readFileSync('src/components/BattlecardsList.tsx', 'utf8');

const injectLogic = `
export const BattlecardsList = () => {
  const [compUrl, setCompUrl] = React.useState(() => localStorage.getItem('compUrl') || '');
  
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url || 'No competitor';
    }
  };
`;

content = content.replace('export const BattlecardsList = () => {', injectLogic);

// Replace amazon.in
content = content.replace(
  'amazon.in',
  '{compUrl ? getDomain(compUrl) : "No competitor added"}'
);

fs.writeFileSync('src/components/BattlecardsList.tsx', content);
