export default async function handler(req, res) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') { return res.status(200).end(); }
  if (req.method !== 'POST') { return res.status(405).json({ error: 'Method Not Allowed' }); }

  const { targetUrl } = req.body;
  const authHeader = req.headers.authorization;

  if (!targetUrl) { return res.status(400).json({ error: 'targetUrl is required' }); }

  const jinaKey = authHeader ? authHeader.replace('Bearer ', '').trim() : '';

  try {
    const jinaUrl = `https://r.jina.ai/${targetUrl}`;
    const headers = {
      'Accept': 'text/plain' // Jina returns markdown
    };
    
    // Pass the Jina API key if it's provided and not a placeholder
    if (jinaKey && jinaKey !== 'skip') {
      headers['Authorization'] = `Bearer ${jinaKey}`;
    }

    const response = await fetch(jinaUrl, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: 'Jina Reader request failed', details: errorText });
    }

    const data = await response.text();
    return res.status(200).send(data);
  } catch (error) {
    console.error('Scraping error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
