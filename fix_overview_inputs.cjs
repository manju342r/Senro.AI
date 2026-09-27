const fs = require('fs');
let content = fs.readFileSync('src/components/Overview.tsx', 'utf8');

// Replace the Trigger Scan button with the analyze function trigger
content = content.replace(
  '<button onClick={() => alert("Scan initiated. Senro.AI is checking for new competitor signals in the background.")} className="flex items-center gap-2 bg-transparent border border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors">\n            <span className="opacity-50">⚡</span> Trigger scan\n          </button>',
  `<button onClick={analyze} disabled={loading} className="flex items-center gap-2 bg-transparent border border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
            <span className="opacity-50">⚡</span> {loading ? 'Scanning...' : 'Trigger scan'}
          </button>`
);

// Remove the entire form
const formStart = '<form onSubmit={analyze}';
const formEnd = '</form>';
const formStartIndex = content.indexOf(formStart);
const formEndIndex = content.indexOf(formEnd) + formEnd.length;

if (formStartIndex !== -1 && formEndIndex !== -1) {
  content = content.substring(0, formStartIndex) + content.substring(formEndIndex);
}

fs.writeFileSync('src/components/Overview.tsx', content);
