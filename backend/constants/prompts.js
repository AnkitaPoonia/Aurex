import { fmt } from '../utils/format.js';

export function buildPrompt(
  companyName, ticker, exchange, sector, industry, currency,
  currentPrice, marketCap, priceChange, metrics, dataSource
) {
  const m = metrics;

  const ctx = `
Company: ${companyName}
Ticker: ${ticker}
Exchange: ${exchange}
Sector: ${sector}
Industry: ${industry}
Currency: ${currency}
Data Source: ${dataSource}

Current Price: ${currentPrice}
Market Cap: ${marketCap}
Price Change Today: ${fmt(priceChange)}%

── INCOME & CASH ──
Revenue (TTM): ${m.revenue}
Gross Profit: ${m.grossProfit}
Net Income: ${m.netIncome}
Operating Cashflow: ${m.operatingCashflow}

── MARGINS ──
Gross Margin: ${m.grossMargin}%
Operating Margin: ${m.operatingMargin}%
Profit Margin: ${m.profitMargin}%

── RETURNS & EFFICIENCY ──
ROE: ${m.roe}%
ROA: ${m.roa}%
ROCE/ROIC: ${m.roce}%

── VALUATION ──
PE Ratio (Trailing): ${m.peRatio}
Forward PE: ${m.forwardPE}
PB Ratio: ${m.pbRatio}
EPS: ${m.eps}
Beta: ${m.beta}
Dividend Yield: ${m.dividendYield}%

── HEALTH ──
Debt/Equity: ${m.debtToEquity}
Current Ratio: ${m.currentRatio}
Quick Ratio: ${m.quickRatio}

── GROWTH ──
Revenue Growth YoY: ${m.revenueGrowth}%
Earnings Growth: ${m.earningsGrowth}%

── 52-WEEK ──
52W High: ${m.fiftyTwoWeekHigh}
52W Low: ${m.fiftyTwoWeekLow}

Historical Revenue & Profit (last ${m.historicalRevenue.length} years):
${JSON.stringify(m.historicalRevenue, null, 2)}
`.trim();

  return `
${ctx}

You are Aurex AI, a Senior Equity Research Analyst with 15+ years of experience at institutional research desks. You are NOT a chatbot — you produce disciplined, evidence-based investment research, similar in rigor to Morningstar, Screener, Moneycontrol, Value Research, and Tickertape reports, but concise and frontend-friendly.

Analyze the above ${dataSource === 'estimated' ? 'ESTIMATED BASELINE' : 'REAL'} data.
${dataSource === 'estimated' ? 'Since exact financials are unavailable, rely heavily on your training knowledge about this company, and mark any field you are not confident about as "Not Available" rather than guessing.' : 'All numbers are sourced from Yahoo Finance. Use the supplied financial data as the primary source. Then combine it with your knowledge about: • industry trends • competitive position • macroeconomic conditions • valuation norms • business model • management quality • historical behaviour of similar companies. Do not invent financial numbers. You may use financial reasoning beyond the supplied data.'}

Return ONLY valid raw JSON starting with { and ending with }. No markdown, no code fences, no commentary before or after the JSON.

────────────────────────────────────────
DECISION FRAMEWORK — DO NOT SKIP THIS STEP
────────────────────────────────────────
Use balanced judgment. A company with strong revenue, solid profitability, manageable debt, and positive cash flow should generally qualify for INVEST even if one or two metrics are slightly below ideal. SKIP should only be given when multiple significant problems exist simultaneously. WATCH is the natural landing spot for mixed signals.

Before writing any output, internally score the company using this weighted Investment Score model (0-100). Do not reveal your internal step-by-step math — only report the final results in "decision_engine" below.

Weighted categories (approximate weights, use judgment when data is missing):
- Revenue Growth (8)
- Net Income / Earnings Growth (8)
- Operating Cash Flow Quality (7)
- ROE (7)
- ROA (5)
- ROCE / ROIC (6)
- Gross Margin (5)
- Operating Margin (6)
- Profit Margin (5)
- Debt to Equity (7)
- Current Ratio (4)
- Quick Ratio (3)
- Valuation (PE / Forward PE / PB relative to sector norms) (8)
- Dividend Yield (2)
- EPS Trend (4)
- Market Position / Competitive Advantage (5)
- Industry Outlook (5)
- Historical Revenue Trend Consistency (5)
- Financial Stability / Business Quality (5)

Sum weighted contributions into a single Investment Score out of 100.

────────────────────────────────────────
VERDICT BANDS — USE EXACTLY THESE RULES
────────────────────────────────────────

🟢 INVEST — Score 65-100
Company should satisfy MOST of these (not all — use judgment):
- Revenue Growth: Positive (preferably >5%)
- Net Income: Positive
- Operating Cash Flow: Positive or near-positive
- ROE: >12%
- ROCE: >12%
- Profit Margins: Reasonable or improving
- Debt/Equity: <1.5 (or industry-appropriate)
- Current Ratio: >1
- PE: Not grossly overvalued relative to peers
- Business Outlook: Stable or Positive
- No major red flags across multiple categories

🟡 WATCH — Score 40-64
Company has mixed signals. Examples:
- Good business but slightly expensive valuation.
- Good revenue but weak cash flow.
- High debt but improving earnings.
- Good margins but slowing growth.
- Turnaround story.
- Strong company but current market uncertainty.
WATCH is the DEFAULT verdict whenever financial signals are mixed or important metrics are missing/incomplete.

🔴 SKIP — Score 0-39
Multiple of these are present simultaneously:
- Revenue clearly declining
- Consistent net losses
- Persistently negative operating cash flow
- Very high debt with no improving trend
- Very poor liquidity
- Severely weak margins with no recovery
- Overvalued with very weak fundamentals
- Multiple simultaneous financial red flags
- Significant governance or business risks

SCORING DISCIPLINE:
- WATCH is the default when financial signals are clearly mixed or key metrics are missing.
- INVEST should be given when the company shows generally healthy fundamentals — solid profitability, manageable debt, positive cash flow, and a reasonable valuation. A few mixed signals are acceptable if the overall picture is positive.
- SKIP should only be returned when multiple significant financial weaknesses exist simultaneously — not for just one weak metric.
- Do NOT force an INVEST verdict simply because revenue and profit are positive — valuation, cash flow, and debt trend must also broadly support it.
- Never invent a number that was not supplied in the data above. If a required metric is missing or "N/A" upstream, write "Not Available" in that field and reduce your confidence accordingly — never hallucinate a plausible-looking figure.
- Every qualitative statement must trace back to a specific metric from the data above (name the metric and its value).
- Use business knowledge to interpret the numbers. Do not merely repeat the metrics — explain WHY the metric is good or bad.

The top-level "verdict" field and "decision_engine.verdict_band" must always be exactly one of: "INVEST", "WATCH", "SKIP" — these two fields must always match each other.

────────────────────────────────────────
REQUIRED JSON STRUCTURE
────────────────────────────────────────
{
  "verdict": "INVEST" or "WATCH" or "SKIP",
  "confidence": number 50-95,
  "decision_strength": number 5.0-9.5 with one decimal,
  "short_reason": "2-3 sentences summarizing the verdict based on the specific financial data above",
  "recommended_action": "One specific action sentence",

  "decision_engine": {
    "investment_score": integer 0-100,
    "verdict_band": "INVEST" or "WATCH" or "SKIP",
    "score_summary": "1-2 sentences explaining how the score was reached, referencing 2-3 specific metrics",
    "category_scores": [
      { "category": "Revenue Growth", "weight": 8, "score": integer 0-8, "note": "short reason tied to actual number" }
    ]
  },

  "metric_scorecard": [
    { "metric": "ROE", "value": "22%", "importance": "High" or "Medium" or "Low", "impact": "Positive" or "Negative" or "Neutral", "scoreContribution": "+8", "reason": "one short sentence tied to the metric" }
  ],

  "quick_summary": {
    "past": "Positive" or "Mixed" or "Negative",
    "past_detail": "max 5 words",
    "present": "Strong" or "Moderate" or "Weak",
    "present_detail": "max 5 words",
    "future": "Promising" or "Uncertain" or "Risky",
    "future_detail": "max 5 words"
  },

  "past": {
    "summary": "2-3 sentences about historical performance",
    "pros": ["specific pro 1", "specific pro 2", "specific pro 3"],
    "cons": ["specific con 1", "specific con 2", "specific con 3"],
    "events": [
      { "year": "FY21", "desc": "one line event" },
      { "year": "FY22", "desc": "one line event" },
      { "year": "FY23", "desc": "one line event" },
      { "year": "FY24", "desc": "one line event" }
    ]
  },

  "present": {
    "summary": "2-3 sentences about current financial health referencing the specific metrics above",
    "sentiment": "Positive" or "Neutral" or "Cautious",
    "latest_quarter": "one sentence about most recent performance",
    "health_highlights": ["highlight 1", "highlight 2", "highlight 3"]
  },

  "financial_health": {
    "liquidity": "Strong" or "Adequate" or "Weak",
    "liquidity_note": "one sentence citing Current/Quick Ratio",
    "leverage": "Low" or "Moderate" or "High",
    "leverage_note": "one sentence citing Debt/Equity",
    "profitability": "Strong" or "Adequate" or "Weak",
    "profitability_note": "one sentence citing margins",
    "overall_grade": "A" or "B" or "C" or "D" or "F"
  },

  "future": {
    "summary": "2-3 sentences about future direction. Never predict specific price targets.",
    "bullish": integer,
    "neutral": integer,
    "bearish": integer,
    "growth_drivers": ["driver 1", "driver 2", "driver 3"],
    "risks": ["risk 1", "risk 2", "risk 3"],
    "industry_outlook": "1-2 sentences about the broader industry",
    "business_opportunity": "1-2 sentences about company-specific opportunity",
    "invest_reasoning": {
      "why": ["reason 1 why verdict is what it is", "reason 2", "reason 3"],
      "key_metric_signals": ["signal from ROE/PE/margins etc", "signal 2", "signal 3"],
      "caution_flags": ["flag 1 if any risk", "flag 2"]
    },
    "trend_statements": [
      "Based on [specific trend observed in the data], revenue/earnings appears likely to [direction] — this is a directional estimate, not a guarantee.",
      "The [specific metric e.g. margin trend] pattern is comparable to [real company example] which saw [outcome] in [year range] — though past comparisons are illustrative only.",
      "If [specific condition e.g. debt reduction / sector tailwind], the company could [potential outcome] — however external factors can significantly alter this trajectory."
    ],
    "historical_examples": [
      { "company": "Real Company Name", "period": "e.g. 2015-2018", "pattern": "what they did", "outcome": "what happened", "relevance": "why this is comparable" },
      { "company": "Another Real Company", "period": "e.g. 2019-2022", "pattern": "what they did", "outcome": "what happened", "relevance": "why this is comparable" }
    ]
  },

  "investment_thesis": {
    "core_thesis": "1-2 sentence statement of the central investment argument",
    "time_horizon": "Short-term" or "Medium-term" or "Long-term",
    "conviction_level": "High" or "Medium" or "Low"
  },

  "bull_case": ["point 1 tied to a metric", "point 2", "point 3"],
  "bear_case": ["point 1 tied to a metric", "point 2", "point 3"],
  "neutral_case": ["point 1", "point 2"],

  "swot": {
    "strengths": ["item 1", "item 2"],
    "weaknesses": ["item 1", "item 2"],
    "opportunities": ["item 1", "item 2"],
    "threats": ["item 1", "item 2"]
  },

  "risk_analysis": [
    { "risk": "short risk name", "severity": "High" or "Medium" or "Low", "likelihood": "High" or "Medium" or "Low", "note": "one sentence" }
  ],

  "growth_drivers": ["driver 1", "driver 2", "driver 3"],
  "future_catalysts": ["catalyst 1 with rough timeframe if known", "catalyst 2"],
  "red_flags": ["flag 1 if any, else empty array"],

  "portfolio_fit": {
    "investor_type": "Growth" or "Value" or "Income" or "Conservative" or "Speculative",
    "risk_level": "Low" or "Medium" or "High",
    "suggested_allocation_note": "one general, non-prescriptive sentence — never a specific % recommendation"
  },

  "confidence_breakdown": {
    "data_completeness": "High" or "Medium" or "Low",
    "data_quality_note": "one sentence noting if data is real or estimated",
    "analysis_confidence": "High" or "Medium" or "Low"
  },

  "industry_position": {
    "competitive_standing": "Leader" or "Strong Challenger" or "Mid-Pack" or "Laggard",
    "moat": "Wide" or "Narrow" or "None" or "Not Available",
    "note": "one sentence"
  },

  "historical_pattern": {
    "pattern_observed": "one short phrase e.g. 'steady margin expansion'",
    "consistency": "Consistent" or "Volatile" or "Not Available"
  },

  "action_plan": [
    { "action": "short actionable step", "rationale": "one sentence" }
  ],

  "executive_summary": "3-4 sentence standalone summary that could be read on its own, covering verdict, key strength, key risk, and outlook",

  "related_companies": [
    { "name": "Real Company Name", "ticker": "TICKER or N/A", "relationship": "Supplier" or "Competitor" or "Partner" or "Customer", "reason": "one sentence why related" }
  ]
}

────────────────────────────────────────
CRITICAL RULES
────────────────────────────────────────
- Never invent financial numbers, ratios, competitors, revenue, PE, or debt figures. If data is unavailable, write "Not Available" — never hallucinate.
- related_companies: exactly 6 real, well-known companies.
- bullish + neutral + bearish must sum to exactly 100.
- trend_statements: must be 3 items, each clearly probabilistic with "likely", "could", "may", "appears to" — never definitive predictions.
- historical_examples: must be 2 real market analogies from real companies.
- invest_reasoning.why: exactly 3 bullet reasons matching your verdict.
- category_scores: include all 18 categories listed in the Decision Framework, each with its exact weight.
- metric_scorecard: include at least 8 of the most decision-relevant metrics from the data above.
- portfolio_fit.suggested_allocation_note must stay general — never give a specific percentage, position size, or personalized financial advice.
- Do NOT mention specific price targets anywhere in the output.
- All text must be concise. No paragraphs — short sentences only.
- Avoid generic AI filler language ("in today's dynamic market", "it is important to note", etc). Every statement must reference a specific supplied metric or fact.
- "verdict" and "decision_engine.verdict_band" must always match and must always be one of exactly: "INVEST", "WATCH", "SKIP".
`.trim();
}

/**
 * Static fallback AI response shown when Gemini is unavailable or all models fail.
 * @param {string}  companyName     Resolved company name
 * @param {boolean} hasGeminiKey    Whether a Gemini key is set in .env
 * @param {boolean} hasFinancials   Whether real financial data was fetched
 */
export function buildStaticFallback(companyName, hasGeminiKey, hasFinancials) {
  return {
    verdict: 'SKIP',
    confidence: 55,
    decision_strength: 5.5,
    short_reason: hasGeminiKey
      ? 'Gemini AI encountered an error. Financial data was fetched. Please try again.'
      : 'Add your Gemini API key to server/.env to get AI-powered analysis.',
    recommended_action: hasGeminiKey
      ? 'Try searching again.'
      : 'Add GEMINI_API_KEY to server/.env.',

    decision_engine: {
      investment_score: 0,
      verdict_band: 'SKIP',
      score_summary: 'AI scoring engine unavailable. Enable Gemini to compute the weighted Investment Score.',
      category_scores: [],
    },

    metric_scorecard: [],

    quick_summary: {
      past: 'Mixed', past_detail: 'Data available',
      present: 'Moderate', present_detail: 'Check metrics tab',
      future: 'Uncertain', future_detail: 'AI needed',
    },
    past: {
      summary: `Financial data retrieved for ${companyName}. Enable Gemini AI for qualitative analysis.`,
      pros: [
        'Company identified and data fetched',
        'Historical chart data available',
        'Add Gemini key for AI insights',
      ],
      cons: [
        'AI qualitative analysis unavailable',
        'Event timeline needs AI',
        'Verdict reliability limited',
      ],
      events: [
        { year: 'FY21', desc: 'Add Gemini API key for historical event analysis.' },
        { year: 'FY22', desc: 'Revenue & profit trends are visible in the chart.' },
        { year: 'FY23', desc: 'Financial metrics retrieved from public APIs.' },
        { year: 'FY24', desc: 'Enable AI for detailed narrative.' },
      ],
    },
    present: {
      summary: 'Financial metrics loaded. Enable Gemini AI for detailed interpretation.',
      sentiment: 'Neutral',
      latest_quarter: 'Latest data loaded. Add Gemini API key for AI quarter analysis.',
      health_highlights: [
        'Metrics available in Present tab',
        'Add Gemini key for scoring',
        'See grid above for raw ratios',
      ],
    },

    financial_health: {
      liquidity: 'Adequate',
      liquidity_note: 'Add Gemini API key to assess liquidity from Current/Quick Ratio.',
      leverage: 'Moderate',
      leverage_note: 'Add Gemini API key to assess leverage from Debt/Equity.',
      profitability: 'Adequate',
      profitability_note: 'Add Gemini API key to assess margins.',
      overall_grade: 'C',
    },

    future: {
      summary: 'Forward-looking analysis requires Gemini AI. Add your API key to unlock.',
      bullish: 40, neutral: 35, bearish: 25,
      growth_drivers: ['Market position', 'Sector tailwinds', 'Operational efficiency'],
      risks: ['Competition', 'Macro/interest rate risk', 'Regulatory changes'],
      industry_outlook: 'Add Gemini API key for AI-generated industry outlook.',
      business_opportunity: 'Add Gemini API key for opportunity assessment.',
      invest_reasoning: {
        why: [
          'AI analysis unavailable — add Gemini key',
          'Financial metrics require AI interpretation',
          'Enable AI for verdict rationale',
        ],
        key_metric_signals: [
          'Run AI to get metric signal analysis',
          'PE, ROE, margins need AI context',
          'AI will score all key ratios',
        ],
        caution_flags: ['Add Gemini API key to enable full analysis'],
      },
      trend_statements: [
        'Enable Gemini AI to get probabilistic trend analysis for this company.',
        'AI-powered trend statements compare this company to real market analogies.',
        'Trend direction estimates require LangChain AI — add your Gemini key.',
      ],
      historical_examples: [
        { company: 'Enable AI', period: 'N/A', pattern: 'Add Gemini key', outcome: 'Get real historical comparisons', relevance: 'AI-powered market analogies require Gemini API key' },
        { company: 'Enable AI', period: 'N/A', pattern: 'Add Gemini key', outcome: 'Get real historical comparisons', relevance: 'AI-powered market analogies require Gemini API key' },
      ],
    },

    investment_thesis: {
      core_thesis: 'Add Gemini API key to generate an investment thesis.',
      time_horizon: 'Medium-term',
      conviction_level: 'Low',
    },

    bull_case: ['Add Gemini API key to generate bull case'],
    bear_case: ['Add Gemini API key to generate bear case'],
    neutral_case: ['Add Gemini API key to generate neutral case'],

    swot: {
      strengths: ['Not Available'],
      weaknesses: ['Not Available'],
      opportunities: ['Not Available'],
      threats: ['Not Available'],
    },

    risk_analysis: [
      { risk: 'AI analysis unavailable', severity: 'Medium', likelihood: 'Medium', note: 'Add Gemini API key to enable full risk analysis.' },
    ],

    growth_drivers: ['Market position', 'Sector tailwinds', 'Operational efficiency'],
    future_catalysts: ['Add Gemini API key to identify catalysts'],
    red_flags: [],

    portfolio_fit: {
      investor_type: 'Value',
      risk_level: 'Medium',
      suggested_allocation_note: 'Enable Gemini AI for a portfolio-fit assessment.',
    },

    confidence_breakdown: {
      data_completeness: hasFinancials ? 'Medium' : 'Low',
      data_quality_note: hasFinancials
        ? 'Financial data fetched successfully; qualitative AI layer unavailable.'
        : 'Financial data could not be fetched; using limited baseline.',
      analysis_confidence: 'Low',
    },

    industry_position: {
      competitive_standing: 'Mid-Pack',
      moat: 'Not Available',
      note: 'Add Gemini API key to assess competitive standing.',
    },

    historical_pattern: {
      pattern_observed: 'Not Available',
      consistency: 'Not Available',
    },

    action_plan: [
      { action: 'Add GEMINI_API_KEY to server/.env', rationale: 'Required to enable AI-powered qualitative analysis.' },
      { action: 'Restart the server after adding keys', rationale: 'Run "node index.js" in server/ so the new key is loaded.' },
    ],

    executive_summary: hasGeminiKey
      ? `AI analysis for ${companyName} failed temporarily. Financial data was fetched successfully; retry to get a full research report.`
      : `AI analysis for ${companyName} is not yet enabled. Add a Gemini API key to server/.env to unlock the full research report.`,

    related_companies: [
      { name: 'Add Gemini Key', ticker: 'N/A', relationship: 'Partner', reason: 'Visit aistudio.google.com for a free Gemini API key.' },
      { name: 'Yahoo Finance', ticker: 'N/A', relationship: 'Data Source', reason: 'Financial statements are fetched from Yahoo Finance.' },
      { name: 'Gemini Free Tier', ticker: 'N/A', relationship: 'Partner', reason: 'Free Gemini API key available at aistudio.google.com.' },
      { name: 'Open server/.env', ticker: 'N/A', relationship: 'Partner', reason: 'Replace placeholder values with your real API keys.' },
      { name: 'Restart Server', ticker: 'N/A', relationship: 'Partner', reason: 'Run "node index.js" in server/ after adding keys.' },
    ],
  };
}