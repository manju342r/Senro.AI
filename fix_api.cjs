const fs = require('fs');
let code = fs.readFileSync('api/analyze-competitor.js', 'utf8');

const oldPrompt = `const systemPrompt = \`You are an expert competitive intelligence AI. Analyze the provided competitor websites vs the user's website.
Return a strict JSON object with EXACTLY these four keys:
- "tracked_competitors": (integer) number of competitors analyzed
- "strategic_gap_index": (integer 0-100) How well the user's site competes (higher is better)
- "impact_metric": (string) Estimated traffic/conversion impact, e.g., "+5.4%" or "-2.1%"
- "reasoning": (string) A short 1-sentence explanation of the score.
DO NOT return any other text outside the JSON.\`;`;

const newPrompt = `const systemPrompt = \`You are an expert competitive intelligence AI. Analyze the provided competitor websites vs the user's website.
Return a strict JSON object with EXACTLY these keys:
- "strategic_gap_index": (integer 0-100) How well the user's site competes (higher is better).
- "net_traffic_impact": (string) Estimated traffic/conversion impact, e.g., "+5.4%" or "-2.1%".
- "risk_level": (string) "High", "Medium", or "Low" based on the threat level.
- "signals_24h": (integer) Number of competitor changes detected in last 24h.
- "signals_total": (integer) Total number of competitor changes detected overall.
- "analysis_summary": (string) A detailed 2-3 sentence executive summary explaining the score and the competitor's main advantages.
DO NOT return any other text outside the JSON.\`;`;

if (code.includes('strategic_gap_index": (integer 0-100) How well the user\'s site competes (higher is better)')) {
  // It's a bit tricky to replace exact string with backticks if not matching perfectly, let's use regex
  code = code.replace(/const systemPrompt = \`[^\`]*\`\;/, newPrompt);
  fs.writeFileSync('api/analyze-competitor.js', code);
  console.log('Fixed API Prompt');
} else {
  console.log('Could not find prompt');
}
