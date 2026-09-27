const fs = require('fs');
let content = fs.readFileSync('src/components/Overview.tsx', 'utf8');

// Replace default '33' with '--'
content = content.replace(
  "(data ? data.strategic_gap_index : '33')",
  "(data ? data.strategic_gap_index : '--')"
);

// Replace default offset 160 with 251.2 (empty circle)
content = content.replace(
  "strokeDashoffset={loading ? 251.2 : (data ? 251.2 * (1 - (data.strategic_gap_index / 100)) : 160)}",
  "strokeDashoffset={loading ? 251.2 : (data ? 251.2 * (1 - (data.strategic_gap_index / 100)) : 251.2)}"
);

fs.writeFileSync('src/components/Overview.tsx', content);
