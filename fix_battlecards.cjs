const fs = require('fs');
let code = fs.readFileSync('src/components/BattlecardsList.tsx', 'utf8');

const injection = `
  const [data] = React.useState<any>(() => {
    try {
      const stored = localStorage.getItem('overviewData');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
`;

code = code.replace(
  "const [isConfigured, setIsConfigured] = React.useState(false);",
  "const [isConfigured, setIsConfigured] = React.useState(false);\n" + injection
);

const generatedBlock = `
      {data && (
        <div className="space-y-4 mb-8">
          <h3 className="text-sm font-semibold text-zinc-400">Generated Battlecards</h3>
          <div className="bg-[#121212] border border-blue-500/30 p-5 rounded-xl max-w-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-bold text-zinc-100">{compUrl ? getDomain(compUrl) : "Competitor"}</h4>
                <div className="text-xs text-blue-400 mt-1 flex items-center gap-1"><Sparkles size={12} /> Auto-generated just now</div>
              </div>
              <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">Gap Index: {data.strategic_gap_index}</div>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">{data.analysis_summary}</p>
          </div>
        </div>
      )}
`;

code = code.replace(
  '<div className="space-y-4">',
  generatedBlock + '<div className="space-y-4">'
);

fs.writeFileSync('src/components/BattlecardsList.tsx', code);
console.log('Fixed Battlecards');
