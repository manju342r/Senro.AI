const fs = require('fs');
let code = fs.readFileSync('src/components/CompareHub.tsx', 'utf8');

code = code.replace(
  "const [compUrl, setCompUrl] = React.useState(() => localStorage.getItem('compUrl') || '');",
  `const [compUrl, setCompUrl] = React.useState(() => localStorage.getItem('compUrl') || '');
  const [data] = React.useState<any>(() => {
    try {
      const stored = localStorage.getItem('overviewData');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });`
);

code = code.replace('<td className="p-4 text-zinc-500">--</td>', '<td className="p-4 text-zinc-300">Technology</td>');
code = code.replace('<td className="p-4 text-zinc-500">--</td>', '<td className="p-4 text-zinc-300 capitalize">{data?.risk_level === "High" ? "Enterprise" : "Standard"}</td>');
code = code.replace('<div className="h-full bg-zinc-700 w-[0%]"></div>', '<div className="h-full bg-emerald-500 w-[75%]"></div>');
code = code.replace('<span className="text-zinc-500 text-xs font-medium">--</span>', '<span className={`text-xs font-medium px-2 py-1 rounded-full ${data?.risk_level === "High" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"}`}>{data?.risk_level || "Medium"}</span>');
code = code.replace('<td className="p-4 text-zinc-500">--</td>', '<td className="p-4 text-zinc-400">Just now</td>');

fs.writeFileSync('src/components/CompareHub.tsx', code);
console.log('Fixed CompareHub');
