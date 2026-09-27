const fs = require('fs');
let content = fs.readFileSync('src/components/BattlecardsList.tsx', 'utf8');

content = content.replace(
  `<div className="text-zinc-500 text-xs">0 signals available</div>`,
  `<div className="text-zinc-500 text-xs">-- signals available</div>`
);

fs.writeFileSync('src/components/BattlecardsList.tsx', content);
