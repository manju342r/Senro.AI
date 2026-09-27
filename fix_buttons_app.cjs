const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const logic = `
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const handleAddCompetitor = () => {
    const url = window.prompt("Enter competitor website URL (e.g., https://amazon.in):");
    if (url) {
      localStorage.setItem('compUrl', url);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 flex font-sans">
`;

content = content.replace(
  'const DashboardLayout = ({ children }: { children: React.ReactNode }) => (\n  <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 flex font-sans">',
  logic
);

content = content.replace(
  '<button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">',
  '<button onClick={handleAddCompetitor} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">'
);

// We need to add the closing brace to DashboardLayout since it's now a block body
content = content.replace(
  '    </main>\n  </div>\n);',
  '    </main>\n  </div>\n  );\n};'
);

fs.writeFileSync('src/App.tsx', content);
