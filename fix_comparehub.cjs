const fs = require('fs');
let content = fs.readFileSync('src/components/CompareHub.tsx', 'utf8');

// We need to inject the logic to read compUrl from localStorage
const injectLogic = `
export const CompareHub = () => {
  const [compUrl, setCompUrl] = React.useState(() => localStorage.getItem('compUrl') || '');
  
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url || 'No competitor';
    }
  };
`;

content = content.replace('export const CompareHub = () => {', injectLogic);

// Replace amazon.in
content = content.replace(
  'amazon.in',
  '{compUrl ? getDomain(compUrl) : "No competitor added"}'
);

fs.writeFileSync('src/components/CompareHub.tsx', content);
