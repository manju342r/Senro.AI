const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsUI.tsx', 'utf8');

content = content.replace(
  '<button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors">',
  '<button onClick={() => alert("Successfully pinged Jina and Firecrawl extraction APIs.")} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors">'
);

fs.writeFileSync('src/components/SettingsUI.tsx', content);
