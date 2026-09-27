const fs = require('fs');
let content = fs.readFileSync('src/components/Overview.tsx', 'utf8');

content = content.replace(
  '<button className="flex items-center gap-2 bg-transparent border border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors">',
  '<button onClick={() => alert("Scan initiated. Senro.AI is checking for new competitor signals in the background.")} className="flex items-center gap-2 bg-transparent border border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors">'
);

content = content.replace(
  '<button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">',
  '<button onClick={() => window.print()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">'
);

fs.writeFileSync('src/components/Overview.tsx', content);
