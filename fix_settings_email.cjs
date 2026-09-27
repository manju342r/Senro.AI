const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsUI.tsx', 'utf8');

// Add imports
content = content.replace(
  "import React, { useState } from 'react';",
  "import React, { useState, useEffect } from 'react';\nimport { useData } from '../contexts/DataContext';"
);

// Inject logic
const stateInject = `  const { supabase } = useData();
  const [ownUrl, setOwnUrl] = useState(() => localStorage.getItem('ownUrl') || 'https://acme.com');
  const [compUrl, setCompUrl] = useState(() => localStorage.getItem('compUrl') || '');
  const [email, setEmail] = useState('');
  const [industry, setIndustry] = useState(() => localStorage.getItem('userIndustry') || 'SaaS');
  const [alertSens, setAlertSens] = useState(() => localStorage.getItem('alertSens') || 'Balanced');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email || '');
      }
    });
  }, [supabase]);
`;

content = content.replace(
  `  const [ownUrl, setOwnUrl] = useState(() => localStorage.getItem('ownUrl') || 'https://acme.com');
  const [compUrl, setCompUrl] = useState(() => localStorage.getItem('compUrl') || '');
  const [email, setEmail] = useState(() => localStorage.getItem('userEmail') || 'founder@startup.com');
  const [industry, setIndustry] = useState(() => localStorage.getItem('userIndustry') || 'SaaS');
  const [alertSens, setAlertSens] = useState(() => localStorage.getItem('alertSens') || 'Balanced');`,
  stateInject
);

// Make the email input disabled since it's the login email
content = content.replace(
  `<input \n              type="email" \n              value={email}\n              onChange={(e) => { setEmail(e.target.value); localStorage.setItem('userEmail', e.target.value); }}\n              className="w-2/3 bg-transparent border-b border-zinc-800 focus:border-blue-500 outline-none text-zinc-200 text-right pb-1"\n            />`,
  `<input \n              type="email" \n              value={email}\n              disabled\n              className="w-2/3 bg-transparent border-b border-zinc-800 outline-none text-zinc-400 text-right pb-1 opacity-70 cursor-not-allowed"\n            />`
);

fs.writeFileSync('src/components/SettingsUI.tsx', content);
