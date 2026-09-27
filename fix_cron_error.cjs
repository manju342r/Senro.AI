const fs = require('fs');
let code = fs.readFileSync('api/cron/send-reports.js', 'utf8');

const oldCatch = `      } catch (llmError) {
        console.error("LLM Error:", llmError);
      }`;
const newCatch = `      } catch (llmError) {
        console.error("LLM Error:", llmError);
        return res.status(500).json({ error: 'LLM Generation Failed', details: llmError.message });
      }`;

code = code.replace(oldCatch, newCatch);
fs.writeFileSync('api/cron/send-reports.js', code);
console.log('Fixed cron error handling');
