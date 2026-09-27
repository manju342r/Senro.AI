// services/scraper.ts

export interface ScrapePayload {
  ownWebsiteUrl: string;
  competitorUrl: string;
  jinaKey: string;
}

export interface ParsedSnapshot {
  title: string;
  headings: string[];
  pricingDetected: boolean;
  rawTextLength: number;
}

/**
 * Parses raw Markdown into a structured JSON snapshot
 */
function parseMarkdown(md: string): ParsedSnapshot {
  // Simple markdown parsing
  const titleMatch = md.match(/^# (.*$)/m);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const h2Match = md.match(/^## (.*$)/gm) || [];
  const h3Match = md.match(/^### (.*$)/gm) || [];
  
  const headings = [...h2Match, ...h3Match].map(h => h.replace(/^#+\s/, '').trim());
  
  const pricingDetected = md.toLowerCase().includes('pricing') || md.includes('$');
  
  return {
    title,
    headings,
    pricingDetected,
    rawTextLength: md.length
  };
}

/**
 * Dispatches a request to the Jina Reader API via our backend
 */
async function fetchViaJina(url: string, jinaKey: string): Promise<string> {
  const response = await fetch('/api/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jinaKey}`
    },
    body: JSON.stringify({ targetUrl: url })
  });

  if (!response.ok) {
    throw new Error(`Jina fetch failed for ${url}: ${response.statusText}`);
  }

  return await response.text();
}

/**
 * Concurrent Dual-Scraper Engine
 */
export async function executeDualScrape({ ownWebsiteUrl, competitorUrl, jinaKey }: ScrapePayload) {
  try {
    console.log(`[Scraper] Initiating concurrent scrape for ${ownWebsiteUrl} and ${competitorUrl}`);
    
    // Concurrent fetch via Jina Reader
    const [ownMd, compMd] = await Promise.all([
      fetchViaJina(ownWebsiteUrl, jinaKey),
      fetchViaJina(competitorUrl, jinaKey)
    ]);

    // Parse both Markdowns
    const ownSnapshot = parseMarkdown(ownMd);
    const competitorSnapshot = parseMarkdown(compMd);

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
