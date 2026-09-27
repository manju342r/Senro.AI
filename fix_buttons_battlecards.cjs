const fs = require('fs');
let content = fs.readFileSync('src/components/BattlecardsList.tsx', 'utf8');

content = content.replace(
  '<button className="flex items-center gap-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border border-blue-500/20">',
  '<button onClick={() => alert("LLM Prompt Initiated: Generating sales battlecard... This will take approx 5-10 seconds on Groq.")} className="flex items-center gap-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border border-blue-500/20">'
);

fs.writeFileSync('src/components/BattlecardsList.tsx', content);
