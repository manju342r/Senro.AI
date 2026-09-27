const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsUI.tsx', 'utf8');

content = content.replace(
  `className="w-2/3 bg-transparent outline-none text-zinc-400 text-right opacity-70 cursor-not-allowed"`,
  `className="w-2/3 bg-transparent outline-none text-zinc-400 text-right pr-2 opacity-70 cursor-not-allowed"`
);

fs.writeFileSync('src/components/SettingsUI.tsx', content);
