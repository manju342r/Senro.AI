const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const modalCode = `
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [showModal, setShowModal] = React.useState(false);
  const [urlInput, setUrlInput] = React.useState('');

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput) {
      localStorage.setItem('compUrl', urlInput);
      setShowModal(false);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 flex font-sans">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-[#0a0a0a]">
              <h3 className="font-semibold text-zinc-100">Add Tracked Competitor</h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-zinc-300">✕</button>
            </div>
            <form onSubmit={handleAddCompetitor} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Competitor Website URL</label>
                <input 
                  autoFocus
                  type="url" 
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  placeholder="https://amazon.in" 
                  required
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-200 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200">Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Add Competitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
`;

content = content.replace(
  `const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const handleAddCompetitor = () => {
    const url = window.prompt("Enter competitor website URL (e.g., https://amazon.in):");
    if (url) {
      localStorage.setItem('compUrl', url);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 flex font-sans">`,
  modalCode
);

content = content.replace(
  '<button onClick={handleAddCompetitor}',
  '<button onClick={() => setShowModal(true)}'
);

fs.writeFileSync('src/App.tsx', content);
