const fs = require('fs');
let code = fs.readFileSync('api/send-hindsight-report.js', 'utf8');

const oldResendCall = `    const result = await resend.emails.send({
      from: 'Senro.AI <onboarding@resend.dev>',
      to: email,
      subject: \`🚨 Hindsight Intelligence Report: \${competitorUrl}\`,
      html: emailHtml
    });

    return res.status(200).json({ success: true, result });`;

const newResendCall = `    const { data, error } = await resend.emails.send({
      from: 'Senro.AI <onboarding@resend.dev>',
      to: email,
      subject: \`🚨 Hindsight Intelligence Report: \${competitorUrl}\`,
      html: emailHtml
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });`;

code = code.replace(oldResendCall, newResendCall);
fs.writeFileSync('api/send-hindsight-report.js', code);
console.log('Fixed send-hindsight-report.js');
