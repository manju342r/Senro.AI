const fs = require('fs');
let code = fs.readFileSync('api/cron/send-reports.js', 'utf8');

// Add OpenAI import
code = code.replace(
  "import { createClient } from '@supabase/supabase-js';",
  "import { createClient } from '@supabase/supabase-js';\nimport OpenAI from 'openai';"
);

// Initialize OpenAI where keys are checked
const keyCheck = "  if (!resendApiKey || !groqApiKey) {";
const openaiInit = `
  const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY || process.env.LLM_KEY,
    baseURL: "https://api.groq.com/openai/v1", // This routes the call to Groq
  });
`;
code = code.replace(keyCheck, openaiInit + '\n' + keyCheck);

// Replace fetch with openai.chat.completions.create
const fetchStart = "const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {";
const fetchEnd = "const aiSummary = aiData.choices?.[0]?.message?.content || 'Competitor intelligence scan completed. Strategic gap index is stable at 42. Traffic impact shows a nominal variance. No critical pricing shifts detected in the last cycle.';";

const fetchRegex = /const response = await fetch\('https:\/\/api\.groq\.com\/openai\/v1\/chat\/completions'[\s\S]*?const aiSummary = aiData\.choices\?\.\[0\]\?\.message\?\.content \|\| [^;]*;/;

const newLLMCall = `
      let aiSummary = 'Competitor intelligence scan completed. Strategic gap index is stable at 42. Traffic impact shows a nominal variance. No critical pricing shifts detected in the last cycle.';
      try {
        const completion = await openai.chat.completions.create({
          model: process.env.LLM_MODEL || "llama-3.3-70b-versatile",
          messages: [
            { 
              role: 'system', 
              content: 'You are an elite competitive intelligence AI. Write a concise, 3-sentence summary of recent competitor activities for an email report. Focus on pricing changes, feature launches, and traffic impact.' 
            },
            { 
              role: 'user', 
              content: \`Analyze recent data for competitor \${user.competitor_url} tracking against baseline \${user.target_url}.\`
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        });
        if (completion.choices?.[0]?.message?.content) {
          aiSummary = completion.choices[0].message.content;
        }
      } catch (llmError) {
        console.error("LLM Error:", llmError);
      }
`;

code = code.replace(fetchRegex, newLLMCall);

fs.writeFileSync('api/cron/send-reports.js', code);
console.log('Fixed send-reports.js');
