const fs = require('fs');
let code = fs.readFileSync('src/components/Overview.tsx', 'utf8');

const oldEmailLogic = `  const handleEmailReport = async () => {
    if (!compUrl) return alert("Please set a competitor URL first.");
    const email = localStorage.getItem('userEmail');
    if (!email) return alert("You must be logged in to receive emails.");
    
    setEmailing(true);
    try {
      const response = await fetch('/api/send-hindsight-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, competitorUrl: compUrl })
      });
      const res = await response.json();
      if (res.error) alert("Error: " + res.error);
      else alert("Hindsight Report emailed successfully!");
    } catch (e) {
      alert("Failed to send email.");
    } finally {
      setEmailing(false);
    }
  };`;

const newEmailLogic = `  const handleEmailReport = async () => {
    if (!compUrl) return alert("Please set a competitor URL first.");
    let email = localStorage.getItem('userEmail');
    
    if (!email || email === 'demo@senro.ai' || email === 'demo@senro.ai (Guest)') {
      const promptEmail = window.prompt("Enter the email address you want to receive the report:", "yourname@example.com");
      if (!promptEmail || promptEmail === "yourname@example.com") return;
      email = promptEmail;
    } else {
      if (!window.confirm(\`Ready to send report to \${email}?\`)) return;
    }
    
    setEmailing(true);
    try {
      const response = await fetch('/api/send-hindsight-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, competitorUrl: compUrl })
      });
      const res = await response.json();
      if (res.error) alert("Error: " + res.error);
      else if (res.simulated) alert("Simulated Send (No Resend API Key). HTML is in console.");
      else alert("Hindsight Report emailed to " + email + " successfully!");
    } catch (e) {
      alert("Failed to send email.");
    } finally {
      setEmailing(false);
    }
  };`;

code = code.replace(oldEmailLogic, newEmailLogic);
fs.writeFileSync('src/components/Overview.tsx', code);
console.log('Fixed Overview email logic');
