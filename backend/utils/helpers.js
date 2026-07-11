// ─── utils/helpers.js ─────────────────────────────────────────────────────────
// Reusable helper utilities: proxy agent builder, axios config factory,
// and the estimated-metrics fallback generator.
// ─────────────────────────────────────────────────────────────────────────────

import { HttpsProxyAgent } from 'https-proxy-agent';
import {
  PROXY_IP, PROXY_PORT, PROXY_USER, PROXY_PASS, HAS_PROXY, YF_TIMEOUT,
} from '../config/config.js';

/**
 * Build an HttpsProxyAgent from Webshare env vars.
 * Returns null when no proxy is configured.
 */
export function buildProxyAgent() {
  if (!HAS_PROXY) return null;
  const auth = PROXY_USER && PROXY_PASS ? `${PROXY_USER}:${PROXY_PASS}@` : '';
  const url  = `http://${auth}${PROXY_IP}:${PROXY_PORT}`;
  return new HttpsProxyAgent(url);
}

/**
 * Build an axios config object that:
 *   - Sets a default timeout
 *   - Injects the proxy agent when configured
 * @param {object} extra  Any additional axios config to merge
 */
export function getAxiosConfig(extra = {}) {
  const cfg   = { timeout: YF_TIMEOUT, ...extra };
  const agent = buildProxyAgent();
  if (agent) {
    cfg.httpsAgent = agent;
    cfg.proxy = false; // let httpsAgent handle routing
  }
  return cfg;
}

/**
 * fail to return real revenue data.  Metrics are proportional to market cap.
 *
 * @param {number} marketCap    Company market capitalisation
 * @param {number} currentPrice Current share price
 * @returns {object}            Estimated metrics object (source: 'estimated')
 */
export function buildEstimatedMetrics(marketCap, currentPrice) {
  const baseVal           = marketCap > 0 ? marketCap : 50_000_000_000;
  const revenue           = baseVal * 0.25;
  const netIncome         = revenue * 0.12;
  const grossProfit       = revenue * 0.40;
  const operatingCashflow = netIncome * 1.2;
  const currentYear       = new Date().getFullYear();

  return {
    revenue,
    grossProfit,
    netIncome,
    operatingCashflow,
    grossMargin:      '40.0',
    operatingMargin:  '15.0',
    profitMargin:     '12.0',
    roe:              '18.5',
    roa:              '8.2',
    roce:             '22.0',
    debtToEquity:     '0.50',
    currentRatio:     '1.50',
    quickRatio:       '1.20',
    peRatio:          currentPrice > 0 ? '25.4' : 'N/A',
    forwardPE:        currentPrice > 0 ? '22.0' : 'N/A',
    pbRatio:          '4.50',
    eps:              currentPrice > 0 ? (currentPrice / 25.4).toFixed(2) : 'N/A',
    beta:             '1.10',
    dividendYield:    '1.2',
    revenueGrowth:    '8.5',
    earningsGrowth:   '10.2',
    fiftyTwoWeekHigh: currentPrice * 1.25,
    fiftyTwoWeekLow:  currentPrice * 0.75,
    historicalRevenue: [
      { year: (currentYear - 4).toString(), revenue: revenue * 0.70, profit: netIncome * 0.65 },
      { year: (currentYear - 3).toString(), revenue: revenue * 0.77, profit: netIncome * 0.72 },
      { year: (currentYear - 2).toString(), revenue: revenue * 0.85, profit: netIncome * 0.81 },
      { year: (currentYear - 1).toString(), revenue: revenue * 0.93, profit: netIncome * 0.90 },
      { year: currentYear.toString(),       revenue,                 profit: netIncome         },
    ],
    source: 'estimated',
  };
}
