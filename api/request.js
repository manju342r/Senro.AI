import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';

export default async function handler(req, res) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { targetUrl } = req.body;
  // Auth header contains "Bearer brd-customer-<ID>-zone-<ZONE>:PASSWORD"
  const authHeader = req.headers.authorization;

  if (!targetUrl) {
    return res.status(400).json({ error: 'targetUrl is required' });
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header with Bearer token is required (Bright Data Key)' });
  }

  try {
    const proxyAuthString = authHeader.replace('Bearer ', '');
    // Bright Data Super Proxy format
    const proxyUrl = `http://${proxyAuthString}@brd.superproxy.io:22225`;
    const proxyAgent = new HttpsProxyAgent(proxyUrl);

    // Proxy request through Bright Data Web Unlocker
    const response = await fetch(targetUrl, {
      method: 'GET',
      agent: proxyAgent,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: 'Proxy request failed', details: errorText });
    }

    const data = await response.text();
    return res.status(200).send(data);
  } catch (error) {
    console.error('Scraping error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
