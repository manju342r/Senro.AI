const fs = require('fs');
let code = fs.readFileSync('src/components/ScheduledReports.tsx', 'utf8');

const oldAlert = `      if (res.error) alert("Error: " + res.error);
      else alert("Report sent to your email successfully!");`;
const newAlert = `      if (res.error) alert("Error: " + res.error);
      else if (res.simulated) alert("Simulated Send (No Resend API Key configured). Check console for HTML.");
      else alert("Report sent to your email successfully!");`;

code = code.replace(oldAlert, newAlert);
fs.writeFileSync('src/components/ScheduledReports.tsx', code);
console.log('Fixed ScheduledReports.tsx');
