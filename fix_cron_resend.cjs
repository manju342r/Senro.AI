const fs = require('fs');
let code = fs.readFileSync('api/cron/send-reports.js', 'utf8');

const oldResendCall = `      const { error: emailError } = await resend.emails.send({
        from: 'Senro.AI Reports <onboarding@resend.dev>', 
        to: [user.email],
        subject: \`Senro.AI Intelligence Report: \${user.competitor_url || 'Update'}\`,
        html: htmlContent,
      });

      if (!emailError) {
        successCount++;
      }`;

const newResendCall = `      const { error: emailError } = await resend.emails.send({
        from: 'Senro.AI Reports <onboarding@resend.dev>', 
        to: [user.email],
        subject: \`Senro.AI Intelligence Report: \${user.competitor_url || 'Update'}\`,
        html: htmlContent,
      });

      if (emailError) {
        console.error('Resend email error:', emailError);
      } else {
        successCount++;
      }`;

code = code.replace(oldResendCall, newResendCall);
fs.writeFileSync('api/cron/send-reports.js', code);
console.log('Fixed cron send-reports.js');
