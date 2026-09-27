// services/scraper.ts

interface ScrapePayload {
  ownWebsiteUrl: string;
  competitorUrl: string;
  brightDataKey: string;
}

interface ParsedSnapshot {
  title: string;
  metaDescription: string;
  headings: string[];
  pricingDetected: boolean;
  ctaText: string[];
  rawTextLength: number;
}

/**
 * Parses raw HTML into a structured JSON snapshot
 */
function parseHTML(html: string): ParsedSnapshot {
  // In a real browser/Node environment, you would use DOMParser or Cheerio.
  // This is a simplified regex-based mockup for illustration.
  
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : '';

  const metaDescMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i) 
                     || html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"[^>]*>/i);
  const metaDescription = metaDescMatch ? metaDescMatch[1] : '';

  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/gi) || [];
  const h2Match = html.match(/<h2[^>]*>([^<]+)<\/h2>/gi) || [];
  
  const headings = [...h1Match, ...h2Match].map(h => h.replace(/<[^>]*>?/gm, '').trim());
  
  const pricingDetected = html.toLowerCase().includes('pricing') || html.includes('$');
  
  const ctaMatch = html.match(/<button[^>]*>([^<]+)<\/button>/gi) || html.match(/<a[^>]*class="[^"]*btn[^"]*"[^>]*>([^<]+)<\/a>/gi) || [];
  const ctaText = ctaMatch.map(b => b.replace(/<[^>]*>?/gm, '').trim()).filter(Boolean);

  return {
    title,
    metaDescription,
    headings,
    pricingDetected,
    ctaText,
    rawTextLength: html.length
  };
}

/**
 * Dispatches a request to the Bright Data proxy
 */
async function fetchViaProxy(url: string, brightDataKey: string): Promise<string> {
  const response = await fetch('/api/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${brightDataKey}`
    },
    body: JSON.stringify({ targetUrl: url })
  });

  if (!response.ok) {
    throw new Error(`Proxy fetch failed for ${url}: ${response.statusText}`);
  }

  return await response.text();
}

/**
 * Concurrent Dual-Scraper Engine
 */
export async function executeDualScrape({ ownWebsiteUrl, competitorUrl, brightDataKey }: ScrapePayload) {
  try {
    console.log(`[Scraper] Initiating concurrent scrape for ${ownWebsiteUrl} and ${competitorUrl}`);
    
    // Concurrent fetch via Bright Data Web Unlocker proxy
    const [ownHtml, compHtml] = await Promise.all([
      fetchViaProxy(ownWebsiteUrl, brightDataKey),
      fetchViaProxy(competitorUrl, brightDataKey)
    ]);

    // Parse both DOMs
    const ownSnapshot = parseHTML(ownHtml);
    const competitorSnapshot = parseHTML(compHtml);

    return {
      success: true,
      ownSnapshot,
      competitorSnapshot
    };
  } catch (error: any) {
    console.error('[Scraper Error]', error);
    return {
      success: false,
      error: error.message
    };
  }
}
