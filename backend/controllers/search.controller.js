import axios from 'axios';
import { YF_HEADERS, YF_TIMEOUT } from '../config/config.js';
import { getAxiosConfig } from '../utils/helpers.js';

/**
 * Try to call a URL with multiple strategies:
 *   1. Direct (no proxy)
 *   2. With proxy
 * Returns the parsed response data or null.
 */
async function tryFetch(url) {
  // Strategy 1: Direct request
  try {
    const res = await axios.get(url, { headers: YF_HEADERS, timeout: YF_TIMEOUT });
    if (res.data) return res.data;
  } catch (e) {
    console.warn('[Search] Direct failed:', e.message);
  }

  // Strategy 2: With proxy
  try {
    const res = await axios.get(url, getAxiosConfig({ headers: YF_HEADERS }));
    if (res.data) return res.data;
  } catch (e) {
    console.warn('[Search] Proxy failed:', e.message);
  }

  return null;
}

/**
 * Pick the best stock result from Yahoo Finance quotes array.
 * Prefers Indian stocks (.NS, .BO), filters out mutual funds and ETFs.
 */
function pickBestResult(quotes) {
  if (!quotes || quotes.length === 0) return null;

  // Only look at equity type stocks
  const equities = quotes.filter(q =>
    q.quoteType === 'EQUITY' &&
    !q.symbol?.startsWith('0P')
  );

  // Priority: NSE first, then BSE, then any equity, then any result
  return (
    equities.find(q => q.symbol?.endsWith('.NS')) ||
    equities.find(q => q.symbol?.endsWith('.BO')) ||
    equities.find(q => q.exchange === 'NSI') ||
    equities.find(q => q.exchange === 'BSE') ||
    equities[0] ||
    quotes.find(q => !q.symbol?.startsWith('0P')) ||
    quotes[0] ||
    null
  );
}

/**
 * Search Yahoo Finance for a company by name or ticker.
 * Tries multiple API hosts to avoid being blocked.
 *
 * @param {string} query  Company name or ticker
 * @returns {object|null} Best matching quote object, or null if not found
 */
export async function searchCompany(query) {
  const encodedQuery = encodeURIComponent(query);

  // Try 3 different Yahoo Finance hosts - one of them usually works
  const urls = [
    `https://query1.finance.yahoo.com/v1/finance/search?q=${encodedQuery}&quotesCount=15&newsCount=0`,
    `https://query2.finance.yahoo.com/v1/finance/search?q=${encodedQuery}&quotesCount=15&newsCount=0`,
    `https://finance.yahoo.com/v1/finance/search?q=${encodedQuery}&quotesCount=15&newsCount=0`,
  ];

  for (const url of urls) {
    const data = await tryFetch(url);
    if (data) {
      const result = pickBestResult(data.quotes);
      if (result) {
        console.log(`[Search] Found "${query}" → ${result.symbol} via ${url.split('/')[2]}`);
        return result;
      }
    }
  }

  console.error(`[Search] Could not find company for query: "${query}"`);
  return null;
}

/**
 * GET /api/search?q=... — optional search endpoint
 */
export async function searchController(req, res, next) {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    const result = await searchCompany(q);
    if (!result) {
      return res.status(404).json({ error: 'Company not found' });
    }
    return res.json(result);
  } catch (error) {
    next(error);
  }
}
