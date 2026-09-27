const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsUI.tsx', 'utf8');

// Replace Email input styling
content = content.replace(
  `className="w-2/3 bg-transparent border-b border-zinc-800 outline-none text-zinc-400 text-right pb-1 opacity-70 cursor-not-allowed"`,
  `className="w-2/3 bg-transparent outline-none text-zinc-400 text-right opacity-70 cursor-not-allowed"`
);

// Replace Industry input styling
content = content.replace(
  `className="w-2/3 bg-transparent border-b border-zinc-800 focus:border-blue-500 outline-none text-zinc-200 text-right pb-1"`,
  `className="w-2/3 bg-transparent hover:bg-zinc-800/50 focus:bg-zinc-800/50 focus:ring-1 focus:ring-blue-500 rounded px-2 py-1 outline-none text-zinc-200 text-right transition-all"`
);

// Replace Alert sensitivity select styling
content = content.replace(
  `className="w-2/3 bg-transparent border-b border-zinc-800 focus:border-blue-500 outline-none text-zinc-200 text-right pb-1 appearance-none cursor-pointer"`,
  `className="w-2/3 bg-transparent hover:bg-zinc-800/50 focus:bg-zinc-800/50 focus:ring-1 focus:ring-blue-500 rounded px-2 py-1 outline-none text-zinc-200 text-right transition-all cursor-pointer"`
);

// Remove the pb-1 from Workspace span to match
content = content.replace(
  `className="w-2/3 text-zinc-400 text-right pb-1"`,
  `className="w-2/3 text-zinc-400 text-right pr-2"`
);

fs.writeFileSync('src/components/SettingsUI.tsx', content);
