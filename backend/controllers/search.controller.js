import axios from 'axios';
import { YF_HEADERS, YF_TIMEOUT } from '../config/config.js';
import { getAxiosConfig } from '../utils/helpers.js';

async function tryFetch(url) {
  try {
    const res = await axios.get(url, { headers: YF_HEADERS, timeout: YF_TIMEOUT });
    if (res.data) return res.data;
  } catch (e) { }

  try {
    const res = await axios.get(url, getAxiosConfig({ headers: YF_HEADERS }));
    if (res.data) return res.data;
  } catch (e) { }

  return null;
}

function pickBestResult(quotes) {
  if (!quotes || quotes.length === 0) return null;

  const BLOCKED_TYPES = ['MUTUALFUND', 'ETF', 'MONEYMARKET', 'FUTURE', 'OPTION', 'CURRENCY', 'INDEX'];

  // Remove mutual funds, ETFs and other non-stock instruments
  const allowed = quotes.filter(q =>
    !BLOCKED_TYPES.includes(q.quoteType) &&
    !q.symbol?.startsWith('0P')
  );

  if (allowed.length === 0) return null;

  // Prefer proper EQUITY type, but accept other stock types too
  const equities = allowed.filter(q => q.quoteType === 'EQUITY');
  const pool = equities.length > 0 ? equities : allowed;

  return (
    pool.find(q => q.symbol?.endsWith('.NS')) ||
    pool.find(q => q.symbol?.endsWith('.BO')) ||
    pool.find(q => q.exchange === 'NSI') ||
    pool.find(q => q.exchange === 'BSE') ||
    pool[0]
  );
}


export async function searchCompany(query) {
  const encodedQuery = encodeURIComponent(query);

  const urls = [
    `https://query1.finance.yahoo.com/v1/finance/search?q=${encodedQuery}&quotesCount=15&newsCount=0`,
    `https://query2.finance.yahoo.com/v1/finance/search?q=${encodedQuery}&quotesCount=15&newsCount=0`,
    `https://finance.yahoo.com/v1/finance/search?q=${encodedQuery}&quotesCount=15&newsCount=0`,
  ];

  for (const url of urls) {
    const data = await tryFetch(url);
    if (data) {
      const result = pickBestResult(data.quotes);
      if (result) return result;
    }
  }

  return null;
}

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
