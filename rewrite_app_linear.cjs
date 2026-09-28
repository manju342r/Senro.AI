const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace DashboardLayout container
code = code.replace(
  /className="min-h-screen bg-transparent text-zinc-200 flex font-sans selection:bg-blue-500\/30"/g,
  'className="min-h-screen bg-[#08090A] text-[#F7F8F8] flex font-sans"'
);

// Replace Sidebar
code = code.replace(
  /<aside className="w-64 bg-black\/40 backdrop-blur-2xl border-r border-white\/5 flex flex-col justify-between relative z-20 shadow-2xl">/g,
  '<aside className="w-56 bg-[#08090A] border-r border-[#222631] flex flex-col justify-between relative z-20 shrink-0">'
);

// Replace Sidebar Item
code = code.replace(
  /className=\{`flex items-center gap-3 px-3 py-2\.5 rounded-xl text-sm font-medium transition-all duration-300 \$\{isActive \? 'bg-blue-500\/10 text-blue-400 shadow-\[inset_0_0_12px_rgba\(59,130,246,0\.1\)\]' : 'text-zinc-400 hover:bg-white\/5 hover:text-zinc-200'\}`\}/g,
  `className={\`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors \${isActive ? 'bg-[#1A1D24] text-[#F7F8F8]' : 'text-[#8A8F98] hover:bg-[#12151C] hover:text-[#E2E4E9]'}\`}`
);
code = code.replace(
  /<Icon size=\{18\} className=\{isActive \? 'text-blue-500' : 'text-zinc-500'\} \/>/g,
  '<Icon size={16} strokeWidth={1.5} className={isActive ? "text-[#E2E4E9]" : "text-[#8A8F98]"} />'
);

// Logo area
code = code.replace(
  /<Link to="\/dashboard" className="p-5 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">[\s\S]*?<div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1\.5 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900\/40">[\s\S]*?<Target size=\{18\} className="text-white" \/>[\s\S]*?<\/div>[\s\S]*?<h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400 tracking-tight">Senro\.AI<\/h1>[\s\S]*?<\/Link>/g,
  `<Link to="/dashboard" className="px-5 py-4 flex items-center gap-2.5 cursor-pointer group">
          <div className="w-5 h-5 rounded flex items-center justify-center bg-[#5E6AD2]">
            <Target size={12} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-[14px] font-semibold text-[#F7F8F8] tracking-tight">Senro</h1>
        </Link>`
);

// Replace header
code = code.replace(
  /<header className="h-16 border-b border-white\/5 bg-black\/40 backdrop-blur-xl px-6 flex justify-between items-center shrink-0 sticky top-0 z-10">/g,
  '<header className="h-14 border-b border-[#222631] bg-[#08090A] px-6 flex justify-between items-center shrink-0 sticky top-0 z-10">'
);

// Replace search input
code = code.replace(
  /<div className="relative w-64">[\s\S]*?<Search size=\{16\} className="absolute left-3 top-1\/2 -translate-y-1\/2 text-zinc-500" \/>[\s\S]*?<input [\s\S]*?className="w-full bg-white\/5 border border-white\/10 text-sm text-zinc-200 rounded-xl pl-9 pr-4 py-2 focus:border-blue-500\/50 focus:bg-white\/10 focus:outline-none focus:ring-4 focus:ring-blue-500\/10 transition-all backdrop-blur-md"[\s\S]*?\/>[\s\S]*?<\/div>/g,
  `<div className="relative w-72 flex items-center">
          <Search size={14} className="absolute left-3 text-[#8A8F98]" strokeWidth={2} />
          <input 
            type="text" placeholder="Search..." 
            className="w-full bg-[#12151C] border border-[#222631] text-[13px] text-[#F7F8F8] rounded-md pl-9 pr-12 py-1.5 focus:border-[#5E6AD2] focus:outline-none transition-colors placeholder-[#8A8F98]"
          />
          <div className="absolute right-3 text-[10px] text-[#8A8F98] bg-[#1A1D24] border border-[#222631] px-1.5 py-0.5 rounded shadow-sm font-sans tracking-widest">⌘K</div>
        </div>`
);

// Buttons in header
code = code.replace(
  /<button onClick=\{.*?\} className="flex items-center gap-1\.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-900\/20 hover:shadow-blue-900\/40 transform hover:-translate-y-0\.5">/g,
  '<button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 bg-[#5E6AD2] hover:bg-[#4f5bbf] text-white px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors border border-[#5E6AD2] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">'
);
code = code.replace(
  /<Plus size=\{16\} \/> Add Competitor/g,
  '<Plus size={14} strokeWidth={2} /> Add Competitor'
);

// Profile circle
code = code.replace(
  /<Link to="\/dashboard\/profile" className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:ring-4 hover:ring-blue-500\/30 transition-all shadow-lg">/g,
  '<Link to="/dashboard/profile" className="w-7 h-7 rounded-full bg-[#1A1D24] border border-[#222631] flex items-center justify-center text-[#E2E4E9] font-medium text-[11px] cursor-pointer hover:bg-[#222631] transition-colors">'
);

// Bottom sidebar stats
code = code.replace(
  /bg-emerald-500 shadow-\[0_0_8px_rgba\(16,185,129,0\.5\)\]/g,
  'bg-[#27C93F]'
);
code = code.replace(/text-emerald-500/g, 'text-[#27C93F]');
code = code.replace(/bg-zinc-700/g, 'bg-[#222631]');
code = code.replace(/text-zinc-500/g, 'text-[#8A8F98]');

// Sign out button
code = code.replace(
  /<button onClick=\{handleSignOut\} className="w-full flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-red-400 transition-colors">/g,
  '<button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-medium text-[#8A8F98] hover:bg-[#12151C] hover:text-[#F7F8F8] transition-colors -ml-3">'
);

// Modal styling
code = code.replace(
  /<div className="bg-\[#0f0f13\]\/90 backdrop-blur-2xl border border-white\/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden ring-1 ring-white\/5">/g,
  '<div className="bg-[#0E1015] border border-[#222631] rounded-lg w-full max-w-md shadow-2xl overflow-hidden">'
);
code = code.replace(
  /<div className="p-5 border-b border-white\/10 flex justify-between items-center bg-black\/40">/g,
  '<div className="p-4 border-b border-[#222631] flex justify-between items-center bg-[#08090A]">'
);
code = code.replace(
  /<h3 className="font-semibold text-zinc-100">/g,
  '<h3 className="font-medium text-[#F7F8F8] text-[14px]">'
);
code = code.replace(
  /<input [\s\S]*?className="w-full bg-black\/50 border border-white\/10 rounded-xl p-3 text-sm text-zinc-200 focus:border-blue-500\/50 focus:ring-4 focus:ring-blue-500\/10 focus:outline-none transition-all shadow-inner"[\s\S]*?\/>/g,
  `<input 
                  autoFocus
                  type="url" 
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  placeholder="https://example.com" 
                  required
                  className="w-full bg-[#12151C] border border-[#222631] rounded-md p-2 text-[13px] text-[#F7F8F8] focus:border-[#5E6AD2] focus:outline-none transition-colors placeholder-[#8A8F98] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
                />`
);
code = code.replace(
  /<button type="button" onClick=\{.*?\} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200">Cancel<\/button>/g,
  '<button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 text-[13px] font-medium text-[#8A8F98] hover:text-[#E2E4E9]">Cancel</button>'
);
code = code.replace(
  /<button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">/g,
  '<button type="submit" className="bg-[#E2E4E9] hover:bg-[#F7F8F8] text-[#08090A] px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors">'
);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx converted to Linear design system.');
