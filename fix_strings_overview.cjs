const fs = require('fs');
let content = fs.readFileSync('src/components/Overview.tsx', 'utf8');

// Replace tracked competitors block
content = content.replace(
  `<div className="text-3xl font-bold text-zinc-100">{loading ? '--' : (data ? data.tracked_competitors : '1')}</div>\n            <div className="text-xs text-zinc-500 mt-2">0 with a baseline</div>`,
  `<div className="text-3xl font-bold text-zinc-100">{loading ? '--' : (data ? data.tracked_competitors : '--')}</div>\n            <div className="text-xs text-zinc-500 mt-2">{loading ? '--' : (data ? data.baseline_count : '--')} with a baseline</div>`
);

// Replace signals block
content = content.replace(
  `<div className="text-3xl font-bold text-zinc-100">0</div>\n            <div className="text-xs text-zinc-500 mt-2">0 total recorded</div>`,
  `<div className="text-3xl font-bold text-zinc-100">{loading ? '--' : (data ? data.signals_24h : '--')}</div>\n            <div className="text-xs text-zinc-500 mt-2">{loading ? '--' : (data ? data.signals_total : '--')} total recorded</div>`
);

// Replace battlecards block
content = content.replace(
  `<div className="text-3xl font-bold text-zinc-100">0</div>\n            <div className="text-xs text-zinc-500 mt-2">AI-generated</div>`,
  `<div className="text-3xl font-bold text-zinc-100">{loading ? '--' : (data ? data.battlecards_generated : '--')}</div>\n            <div className="text-xs text-zinc-500 mt-2">AI-generated</div>`
);

// Replace "Never scraped"
content = content.replace(
  `              <div className="text-xs text-zinc-500">Never scraped</div>`,
  `              <div className="text-xs text-zinc-500">{data ? "Scraped recently" : "Waiting for scan"}</div>`
);

// Update threat score Contained text
content = content.replace(
  `<span className="text-emerald-500 text-sm font-medium">Contained</span>`,
  `<span className="text-emerald-500 text-sm font-medium">{loading ? 'Scanning' : (data ? 'Contained' : 'Unknown')}</span>`
);

fs.writeFileSync('src/components/Overview.tsx', content);
