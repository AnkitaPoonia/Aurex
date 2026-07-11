import axios from 'axios';
import YahooFinance from 'yahoo-finance2';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { searchCompany } from './search.controller.js';
import { YF_HEADERS, GEMINI_MODELS, GEMINI_API_KEY, HAS_GEMINI_KEY } from '../config/config.js';
import { getAxiosConfig, buildEstimatedMetrics } from '../utils/helpers.js';
import { fmt, pct } from '../utils/format.js';
import { buildPrompt, buildStaticFallback } from '../constants/prompts.js';
import { ProxyAgent, fetch } from "undici";

const proxyAgent = new ProxyAgent(
  `http://${process.env.WEBSHARE_PROXY_USER}:${process.env.WEBSHARE_PROXY_PASS}@${process.env.WEBSHARE_PROXY_IP}:${process.env.WEBSHARE_PROXY_PORT}`
);

const proxyFetch = (url, options = {}) =>
  fetch(url, { ...options, dispatcher: proxyAgent });

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"], fetch: proxyFetch });
const yfDirect = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

async function getYahooPrice(ticker) {
  const parseMeta = (data) => {
    const meta = data?.chart?.result?.[0]?.meta || {};
    if (!meta.regularMarketPrice) return null;
    return {
      currentPrice: meta.regularMarketPrice || 0,
      currency: meta.currency || 'USD',
      priceChange:
        meta.regularMarketChangePercent ||
        ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose * 100) ||
        0,
      marketCap: meta.marketCap || 0,
      exchange: meta.fullExchangeName || meta.exchangeName || 'N/A',
      longName: meta.longName || meta.shortName || ticker,
      fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh || 0,
      fiftyTwoWeekLow: meta.fiftyTwoWeekLow || 0,
    };
  };

  const hosts = ['query1.finance.yahoo.com', 'query2.finance.yahoo.com'];
  for (const host of hosts) {
    const url = `https://${host}/v8/finance/chart/${ticker}?interval=1d&range=5d`;
    for (const config of [{ headers: YF_HEADERS, timeout: 15000 }, getAxiosConfig({ headers: YF_HEADERS })]) {
      try {
        const res = await axios.get(url, config);
        const result = parseMeta(res.data);
        if (result) return result;
      } catch (_) { }
    }
  }

  return { currentPrice: 0, currency: 'USD', priceChange: 0, marketCap: 0, exchange: 'N/A', longName: ticker, fiftyTwoWeekHigh: 0, fiftyTwoWeekLow: 0 };
}
async function getYahooFundamentals(ticker) {
  let quoteSummary;
  try {
    quoteSummary = await yfDirect.quoteSummary(ticker, {
      modules: ["price", "summaryProfile", "financialData", "defaultKeyStatistics", "summaryDetail"]
    });
  } catch (_) {
    quoteSummary = await yf.quoteSummary(ticker, {
      modules: ["price", "summaryProfile", "financialData", "defaultKeyStatistics", "summaryDetail"]
    });
  }

  const fetchTimeSeries = async (module, type) => {
    try {
      return await yfDirect.fundamentalsTimeSeries(ticker, { module, type, period1: "2019-01-01" });
    } catch (_) {
      return await yf.fundamentalsTimeSeries(ticker, { module, type, period1: "2019-01-01" });
    }
  };

  const [tsAnnual, tsCash] = await Promise.all([
    fetchTimeSeries("financials", "annual"),
    fetchTimeSeries("cash-flow", "annual"),
  ]);

  const financials = tsAnnual
    .filter(item => item.totalRevenue != null)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const latest = financials[0] || {};
  const previous = financials[1] || {};
  const currentRevenue =
    latest.totalRevenue ??
    latest.operatingRevenue ??
    0;

  const currentGrossProfit =
    latest.grossProfit ??
    0;

  const currentNetIncome =
    latest.netIncome ??
    latest.netIncomeCommonStockholders ??
    0;

  const cashflows = [...tsCash].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const latestCash = cashflows[0] || {};

  const currentOpCash =
    latestCash.operatingCashFlow ??
    latestCash.operatingCashFlowContinuing ??
    latestCash.cashFlowFromOperations ??
    0;


  const fd = quoteSummary?.financialData || {};
  const ks = quoteSummary?.defaultKeyStatistics || {};
  const sd = quoteSummary?.summaryDetail || {};

  const historicalRevenue = financials
    .slice(0, 5)
    .reverse()
    .map(item => ({
      year: new Date(item.date).getFullYear().toString(),
      revenue: item.totalRevenue || 0,
      profit: item.netIncome || 0,
    }));

  let revenueGrowth = "N/A";
  if (previous.totalRevenue) {
    revenueGrowth = pct(
      (currentRevenue - previous.totalRevenue) / previous.totalRevenue
    );
  }

  return {
    name: quoteSummary.price?.longName || null,

    price:
      quoteSummary.price?.regularMarketPrice || 0,

    marketCap:
      quoteSummary.price?.marketCap || 0,

    exchange:
      quoteSummary.price?.exchangeName || null,

    sector:
      quoteSummary.summaryProfile?.sector || null,

    industry:
      quoteSummary.summaryProfile?.industry || null,

    change:
      quoteSummary.price?.regularMarketChangePercent || 0,
    revenue: currentRevenue || fd.totalRevenue?.raw || 0,
    grossProfit: currentGrossProfit || fd.grossProfits?.raw || 0,
    netIncome: currentNetIncome || fd.netIncomeToCommon?.raw || 0,
    operatingCashflow: currentOpCash || fd.operatingCashflow?.raw || 0,
    grossMargin: fd.grossMargins != null ? pct(fd.grossMargins) : 'N/A',
    operatingMargin: fd.operatingMargins != null ? pct(fd.operatingMargins) : 'N/A',
    profitMargin: fd.profitMargins != null ? pct(fd.profitMargins) : 'N/A',
    roe: fd.returnOnEquity != null ? pct(fd.returnOnEquity) : 'N/A',
    roa: fd.returnOnAssets != null ? pct(fd.returnOnAssets) : 'N/A',
    roce: 'N/A',
    debtToEquity: fd.debtToEquity != null ? fmt(fd.debtToEquity) : 'N/A',
    currentRatio: fd.currentRatio != null ? fmt(fd.currentRatio) : 'N/A',
    quickRatio: fd.quickRatio != null ? fmt(fd.quickRatio) : 'N/A',
    peRatio: sd.trailingPE != null ? fmt(sd.trailingPE, 1) : 'N/A',
    forwardPE: ks.forwardPE != null ? fmt(ks.forwardPE, 1) : 'N/A',
    pbRatio: ks.priceToBook != null ? fmt(ks.priceToBook) : 'N/A',
    eps: ks.trailingEps != null ? fmt(ks.trailingEps) : 'N/A',
    beta: ks.beta != null ? fmt(ks.beta) : 'N/A',
    dividendYield: sd.dividendYield != null ? pct(sd.dividendYield) : 'N/A',
    revenueGrowth,
    earningsGrowth:
      previous.netIncome ? pct(
        (currentNetIncome - previous.netIncome) / previous.netIncome
      ) : "N/A",
    fiftyTwoWeekHigh: ks.fiftyTwoWeekHigh || sd.fiftyTwoWeekHigh || 0,
    fiftyTwoWeekLow: ks.fiftyTwoWeekLow || sd.fiftyTwoWeekLow || 0,
    historicalRevenue,
    source: 'yahoo',
  };
}

function buildLangChainChain(modelName) {
  const llm = new ChatGoogleGenerativeAI({
    model: modelName,
    apiKey: GEMINI_API_KEY,
    temperature: 0.3,
    maxOutputTokens: 4096,
  });

  const promptTemplate = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are Aurex AI, a senior financial research analyst. ` +
      `You MUST respond with ONLY valid raw JSON — no markdown, no code fences, ` +
      `no explanation text. Start your response with {{ and end with }}.`,
    ],
    ['human', '{input}'],
  ]);

  const outputParser = new StringOutputParser();
  return promptTemplate.pipe(llm).pipe(outputParser);
}

async function runLangChainWithFallback(promptText) {
  for (const modelName of GEMINI_MODELS) {
    try {
      const chain = buildLangChainChain(modelName);
      const result = await chain.invoke({ input: promptText });

      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (_) { }
  }
  return null;
}

export async function researchController(req, res, next) {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const topResult = await searchCompany(query);
    if (!topResult) {
      const error = new Error('No stock found. Only stocks are supported — mutual funds and ETFs are not allowed. Try a stock ticker like HDFCBANK.NS or AAPL.');
      error.status = 404;
      throw error;
    }

    const ticker = topResult.symbol;
    const searchName = topResult.longname || topResult.shortname || ticker;

    const yahooPrice = await getYahooPrice(ticker).catch(() => null);
    let financials = await getYahooFundamentals(ticker);

    const currentPrice = financials?.price || yahooPrice?.currentPrice || 0;
    const marketCap = financials?.marketCap || yahooPrice?.marketCap || 0;
    if (!financials || financials.revenue === 0) {
      financials = buildEstimatedMetrics(marketCap, currentPrice);
    }

    const companyName = financials.name || yahooPrice?.longName || searchName;
    const priceChange = financials.change || yahooPrice?.priceChange || 0;
    const finalMarketCap = financials.marketCap > 0 ? financials.marketCap : (yahooPrice?.marketCap || 0);
    const currency = topResult.currency || yahooPrice?.currency || 'USD';
    const exchange = financials.exchange || yahooPrice?.exchange || topResult.exchange || 'N/A';
    const sector = financials.sector || 'N/A';
    const industry = financials.industry || 'N/A';

    let prompt = buildPrompt(
      companyName, ticker, exchange, sector, industry, currency,
      currentPrice, finalMarketCap, priceChange,
      financials, financials.source
    );

    if (financials.source === 'estimated') {
      prompt += "\n\nIMPORTANT: Low confidence due to insufficient financial statements.";
    }

    let aiData = null;
    if (HAS_GEMINI_KEY) {
      aiData = await runLangChainWithFallback(prompt);
    }

    if (!aiData) {
      const hasFinancials = financials.revenue > 0 && financials.source !== 'estimated';
      aiData = buildStaticFallback(companyName, HAS_GEMINI_KEY, hasFinancials);
    }

    return res.json({
      company: {
        name: companyName,
        ticker,
        exchange,
        sector,
        industry,
        currentPrice,
        priceChange,
        marketCap: finalMarketCap,
        currency,
        fiftyTwoWeekHigh: financials.fiftyTwoWeekHigh || yahooPrice?.fiftyTwoWeekHigh || 0,
        fiftyTwoWeekLow: financials.fiftyTwoWeekLow || yahooPrice?.fiftyTwoWeekLow || 0,
      },
      metrics: {
        revenue: financials.revenue,
        netIncome: financials.netIncome,
        grossProfit: financials.grossProfit,
        operatingCashflow: financials.operatingCashflow,
        grossMargin: financials.grossMargin,
        operatingMargin: financials.operatingMargin,
        profitMargin: financials.profitMargin,
        roe: financials.roe,
        roa: financials.roa,
        roce: financials.roce,
        debtToEquity: financials.debtToEquity,
        currentRatio: financials.currentRatio,
        quickRatio: financials.quickRatio,
        peRatio: financials.peRatio,
        forwardPE: financials.forwardPE,
        pbRatio: financials.pbRatio,
        eps: financials.eps,
        beta: financials.beta,
        dividendYield: financials.dividendYield,
        revenueGrowth: financials.revenueGrowth,
        earningsGrowth: financials.earningsGrowth,
        dataSource: financials.source,
      },
      historical: { revenue: financials.historicalRevenue },
      ai: aiData,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    next(error);
  }
}

export function healthController(req, res) {
  res.json({
    status: 'ok',
    yahoo: true,
    gemini: HAS_GEMINI_KEY,
    proxy: !!(process.env.WEBSHARE_PROXY_IP && process.env.WEBSHARE_PROXY_PORT),
    langchain: true,
  });
}
