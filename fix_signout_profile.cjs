const fs = require('fs');
let content = fs.readFileSync('src/components/Profile.tsx', 'utf8');

// Add imports
content = content.replace(
  "import React, { useState } from 'react';",
  "import React, { useState } from 'react';\nimport { useNavigate } from 'react-router-dom';\nimport { useData } from '../contexts/DataContext';\nimport { LogOut } from 'lucide-react';"
);

// Add hooks
content = content.replace(
  "const [email] = useState(() => localStorage.getItem('userEmail') || 'demo@senro.ai (Guest)');",
  `const [email] = useState(() => localStorage.getItem('userEmail') || 'demo@senro.ai (Guest)');
  const navigate = useNavigate();
  const { supabase } = useData();
  
  const handleSignOut = async () => {
    try { await supabase.auth.signOut(); } catch (e) {}
    localStorage.removeItem('userEmail');
    navigate('/login');
  };`
);

// Add big button
const buttonHtml = `
          <div className="pt-6 border-t border-zinc-800/50">
            <button onClick={handleSignOut} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <LogOut size={16} /> Sign out of Senro.AI
            </button>
          </div>
        </div>
      </div>
`;

content = content.replace(
  `        </div>\n      </div>`,
  buttonHtml
);

fs.writeFileSync('src/components/Profile.tsx', content);
