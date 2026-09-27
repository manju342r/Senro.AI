const fs = require('fs');

// 1. Update App.tsx AuthScreen to save email to localStorage
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  'setError(null);\n    setLoading(true);\n\n    try {\n      if (isLogin) {',
  `setError(null);\n    setLoading(true);\n\n    try {\n      localStorage.setItem('userEmail', email);\n      if (isLogin) {`
);
fs.writeFileSync('src/App.tsx', appContent);

// 2. Update SettingsUI.tsx to just read from localStorage
let settingsContent = fs.readFileSync('src/components/SettingsUI.tsx', 'utf8');
const effectBlock = `  useEffect(() => {
    // Attempt to get session synchronously first
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setEmail(session.user.email);
      } else {
        // Fallback to getUser if session is stale
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user?.email) {
            setEmail(user.email);
          } else {
            setEmail('demo@senro.ai (Guest)');
          }
        }).catch(() => {
          setEmail('demo@senro.ai (Guest)');
        });
      }
    });
  }, [supabase]);`;

// Remove the useEffect entirely, rely on localStorage state init
if (settingsContent.includes(effectBlock)) {
  settingsContent = settingsContent.replace(effectBlock, '');
}

settingsContent = settingsContent.replace(
  `const [email, setEmail] = useState('');`,
  `const [email, setEmail] = useState(() => localStorage.getItem('userEmail') || 'demo@senro.ai (Guest)');`
);

fs.writeFileSync('src/components/SettingsUI.tsx', settingsContent);
