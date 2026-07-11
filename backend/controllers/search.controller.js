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

  const equities = quotes.filter(q =>
    q.quoteType === 'EQUITY' &&
    !q.symbol?.startsWith('0P')
  );

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
