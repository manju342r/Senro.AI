const fs = require('fs');
let code = fs.readFileSync('src/components/ScheduledReports.tsx', 'utf8');

const oldSendNow = `  const handleSendNow = async () => {
    if (!compUrl) return alert("Please set a competitor URL in Settings first.");
    setSendingNow(true);
    try {
      const response = await fetch('/api/send-hindsight-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, competitorUrl: compUrl })
      });`;

const newSendNow = `  const handleSendNow = async () => {
    if (!compUrl) return alert("Please set a competitor URL in Settings first.");
    
    // Check if it's the demo email and prompt if they want to override
    let targetEmail = email;
    if (email === 'demo@senro.ai') {
      const promptEmail = window.prompt("You are using a guest account. What email address should we send the report to?", "yourname@example.com");
      if (!promptEmail || promptEmail === "yourname@example.com") {
        return; // User cancelled
      }
      targetEmail = promptEmail;
    } else {
      if (!window.confirm(\`Ready to send the report to \${targetEmail}?\`)) return;
    }

    setSendingNow(true);
    try {
      const response = await fetch('/api/send-hindsight-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, competitorUrl: compUrl })
      });`;

code = code.replace(oldSendNow, newSendNow);
fs.writeFileSync('src/components/ScheduledReports.tsx', code);
console.log('Fixed email prompt');
