const fs = require('fs');
let content = fs.readFileSync('src/components/CompareHub.tsx', 'utf8');

// Replace the hardcoded table row with a conditional render
const row = `<tr className="hover:bg-zinc-900/50 transition-colors">
              <td className="p-4"><input type="checkbox" className="rounded border-zinc-700 bg-zinc-900" /></td>
              <td className="p-4">
                <div className="flex items-center gap-2 text-zinc-200 font-medium">
                  {compUrl ? getDomain(compUrl) : "No competitor added"}
                  <ExternalLink size={14} className="text-zinc-500 hover:text-zinc-300 cursor-pointer" />
                </div>
              </td>
              <td className="p-4 text-zinc-400">Retail</td>
              <td className="p-4 text-zinc-400">Dynamic</td>
              <td className="p-4">
                <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[65%]"></div>
                </div>
              </td>
              <td className="p-4">
                <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-xs font-medium">High</span>
              </td>
              <td className="p-4 text-zinc-500">2 hours ago</td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-3 text-zinc-500">
                  <RefreshCw size={16} className="hover:text-zinc-300 cursor-pointer transition-colors" />
                  <Trash2 size={16} className="hover:text-red-400 cursor-pointer transition-colors" />
                </div>
              </td>
            </tr>`;

const newRow = `{compUrl ? (
            <tr className="hover:bg-zinc-900/50 transition-colors">
              <td className="p-4"><input type="checkbox" className="rounded border-zinc-700 bg-zinc-900" /></td>
              <td className="p-4">
                <div className="flex items-center gap-2 text-zinc-200 font-medium">
                  {getDomain(compUrl)}
                  <a href={compUrl} target="_blank" rel="noreferrer"><ExternalLink size={14} className="text-zinc-500 hover:text-blue-400 cursor-pointer" /></a>
                </div>
              </td>
              <td className="p-4 text-zinc-500">--</td>
              <td className="p-4 text-zinc-500">--</td>
              <td className="p-4">
                <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-700 w-[0%]"></div>
                </div>
              </td>
              <td className="p-4">
                <span className="text-zinc-500 text-xs font-medium">--</span>
              </td>
              <td className="p-4 text-zinc-500">Not scanned</td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-3 text-zinc-500">
                  <RefreshCw size={16} className="hover:text-zinc-300 cursor-pointer transition-colors" />
                  <Trash2 size={16} className="hover:text-red-400 cursor-pointer transition-colors" />
                </div>
              </td>
            </tr>
            ) : (
            <tr>
              <td colSpan={8} className="p-8 text-center text-zinc-500">No competitors added yet.</td>
            </tr>
            )}`;

content = content.replace(row, newRow);
fs.writeFileSync('src/components/CompareHub.tsx', content);
