const fs = require('fs');
let content = fs.readFileSync('src/components/CompareHub.tsx', 'utf8');

content = content.replace(
  '<button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium px-4 py-1.5 rounded-md transition-colors">',
  '<button onClick={() => alert("Initiating deep comparison matrix using Hindsight Context...")} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium px-4 py-1.5 rounded-md transition-colors">'
);

// Delete functionality for trash icon
content = content.replace(
  '<Trash2 size={16} className="hover:text-red-400 cursor-pointer transition-colors" />',
  '<Trash2 size={16} onClick={() => { if(window.confirm("Remove this competitor?")) { localStorage.removeItem("compUrl"); window.location.reload(); } }} className="hover:text-red-400 cursor-pointer transition-colors" />'
);

fs.writeFileSync('src/components/CompareHub.tsx', content);
