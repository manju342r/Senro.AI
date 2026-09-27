const fs = require('fs');
let code = fs.readFileSync('api/send-hindsight-report.js', 'utf8');

// replace dynamic import with top level import
code = 'import OpenAI from "openai";\n' + code;
code = code.replace(/const { OpenAI } = await import\("openai"\);\n/, '');

// update the LLM_KEY mapping to match user instructions precisely
code = code.replace(/process.env.GROQ_API_KEY \|\| process.env.LLM_API_KEY/g, 'process.env.GROQ_API_KEY || process.env.LLM_KEY');

// make sure baseURL is strictly present (it already is, but this makes sure it matches)
code = code.replace(/apiKey: groqKey,/g, 'apiKey: groqKey || process.env.LLM_KEY,');

fs.writeFileSync('api/send-hindsight-report.js', code);
console.log('Fixed send-hindsight-report.js');
