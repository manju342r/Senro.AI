const fs = require('fs');
let content = fs.readFileSync('src/components/Overview.tsx', 'utf8');

content = content.replace(
  '<div className="text-sm font-medium text-zinc-200">amazon.in</div>',
  '<div className="text-sm font-medium text-zinc-200">{compUrl ? getWorkspaceName(compUrl) : "No competitor"}</div>'
);
content = content.replace(
  '<div className="text-sm text-blue-400 hover:underline cursor-pointer">\n            amazon.in ↗\n          </div>',
  '<div className="text-sm text-blue-400 hover:underline cursor-pointer">\n            {compUrl ? getWorkspaceName(compUrl) : ""} {compUrl && "↗"}\n          </div>'
);

fs.writeFileSync('src/components/Overview.tsx', content);
