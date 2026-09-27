const fs = require('fs');
let content = fs.readFileSync('src/components/CompareHub.tsx', 'utf8');

content = content.replace(
  `<td className="p-4 text-zinc-500">Not scanned</td>`,
  `<td className="p-4 text-zinc-500">--</td>`
);

fs.writeFileSync('src/components/CompareHub.tsx', content);
