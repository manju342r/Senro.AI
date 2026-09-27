const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsUI.tsx', 'utf8');

const effectBlock = `
  useEffect(() => {
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
  }, [supabase]);
`;

content = content.replace(
  `  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email || '');
      }
    });
  }, [supabase]);`,
  effectBlock
);

fs.writeFileSync('src/components/SettingsUI.tsx', content);
