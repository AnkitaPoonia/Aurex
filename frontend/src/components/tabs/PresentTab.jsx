// ─── components/tabs/PresentTab.jsx ──────────────────────────────────────────
// Current financial metrics tab — 5 metric sections with rating dots,
// data source badge, 52W range, AI analysis panel, health highlights, sentiment.
// Updated: imports formatNum from utils/formatter.js (was defined locally)
// ─────────────────────────────────────────────────────────────────────────────

import { formatNum } from '../../utils/formatter.js'

function getMetricRating(label, value) {
  const v = parseFloat(value)
  if (isNaN(v)) return null
  switch (label) {
    case 'ROE':          return v >= 20 ? 'good' : v >= 12 ? 'ok' : 'weak'
    case 'ROA':          return v >= 10 ? 'good' : v >= 5  ? 'ok' : 'weak'
    case 'ROCE':         return v >= 20 ? 'good' : v >= 12 ? 'ok' : 'weak'
    case 'Gross Margin': return v >= 40 ? 'good' : v >= 20 ? 'ok' : 'weak'
    case 'Op. Margin':   return v >= 15 ? 'good' : v >= 8  ? 'ok' : 'weak'
    case 'Net Margin':   return v >= 10 ? 'good' : v >= 5  ? 'ok' : 'weak'
    case 'D/E Ratio':    return v <  0.5 ? 'good': v <= 1.5 ? 'ok' : 'weak'
    case 'Current Ratio':return v >= 2   ? 'good': v >= 1   ? 'ok' : 'weak'
    case 'Quick Ratio':  return v >= 1.5 ? 'good': v >= 1   ? 'ok' : 'weak'
    case 'Revenue Grow': return v >= 15  ? 'good': v >= 5   ? 'ok' : 'weak'
    default: return null
  }
}

const ratingColor = { good: '#3FBE72', ok: '#F2C230', weak: '#E5544D' }
const ratingDot   = { good: '●', ok: '●', weak: '●' }

function MetricCard({ label, value, sub, highlight, ratingLabel }) {
  const rating = ratingLabel ? getMetricRating(ratingLabel, value?.replace('%', '').replace('×', '')) : null
  return (
    <div style={{
      background: '#141412',
      border: highlight ? '1px solid #F2C230' : '1px solid #2C2B25',
      borderRadius: 11, padding: '14px 16px',
      position: 'relative',
    }}>
      {rating && (
        <span style={{
          position: 'absolute', top: 10, right: 12,
          color: ratingColor[rating], fontSize: 9,
        }}>
          {ratingDot[rating]}
        </span>
      )}
      <div style={{ fontSize: 11, color: '#948F7D', fontWeight: 600, marginBottom: 5 }}>{label}</div>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 18, fontWeight: 600,
        color: highlight ? '#F2C230' : '#F3F1E7',
      }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: '#948F7D', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

function PresentTab({ data }) {
  const m = data.metrics || {}
  const ai = data.ai?.present || {}
  const company = data.company || {}
  const currency = company.currency

  const sentimentColor = { Positive: '#3FBE72', Neutral: '#F2C230', Cautious: '#E5544D' }
  const sc = sentimentColor[ai.sentiment] || '#F2C230'

  const dataSourceLabel = {
    yahoo:     { text: 'Yahoo Finance',           color: '#7B8FF5', bg: '#1A1B2E' },
    estimated: { text: 'Estimated / Simulated',   color: '#F2C230', bg: '#3A3116' },
  }
  const dsConfig = dataSourceLabel[m.dataSource] || dataSourceLabel['estimated']

  // 52-week position
  const hi  = parseFloat(company.fiftyTwoWeekHigh) || 0
  const lo  = parseFloat(company.fiftyTwoWeekLow)  || 0
  const cur = parseFloat(company.currentPrice)      || 0
  const pctFromLow  = hi !== lo ? (((cur - lo) / (hi - lo)) * 100).toFixed(0) : null

  const incomeMetrics = [
    { label: 'Revenue (TTM)',      value: formatNum(m.revenue, currency),      sub: m.revenueGrowth !== 'N/A' ? `${m.revenueGrowth}% YoY` : null },
    { label: 'Gross Profit',       value: formatNum(m.grossProfit, currency),  sub: m.grossMargin !== 'N/A' ? `${m.grossMargin}% margin` : null },
    { label: 'Net Profit',         value: formatNum(m.netIncome, currency),    sub: m.profitMargin !== 'N/A' ? `${m.profitMargin}% margin` : null },
    { label: 'Op. Cashflow',       value: formatNum(m.operatingCashflow, currency), sub: null },
  ]

  const marginMetrics = [
    { label: 'Gross Margin',  value: m.grossMargin !== 'N/A' ? `${m.grossMargin}%` : 'N/A',   ratingLabel: 'Gross Margin' },
    { label: 'Op. Margin',    value: m.operatingMargin !== 'N/A' ? `${m.operatingMargin}%` : 'N/A', ratingLabel: 'Op. Margin' },
    { label: 'Net Margin',    value: m.profitMargin !== 'N/A' ? `${m.profitMargin}%` : 'N/A',  ratingLabel: 'Net Margin' },
    { label: 'Revenue Grow',  value: m.revenueGrowth !== 'N/A' ? `${m.revenueGrowth}%` : 'N/A', ratingLabel: 'Revenue Grow', sub: 'YoY Growth' },
  ]

  const returnMetrics = [
    { label: 'ROE',  value: m.roe  !== 'N/A' ? `${m.roe}%`  : 'N/A', sub: 'Return on Equity',  highlight: parseFloat(m.roe) > 15, ratingLabel: 'ROE' },
    { label: 'ROA',  value: m.roa  !== 'N/A' ? `${m.roa}%`  : 'N/A', sub: 'Return on Assets',  ratingLabel: 'ROA' },
    { label: 'ROCE', value: m.roce !== 'N/A' ? `${m.roce}%` : (m.roa !== 'N/A' ? `${m.roa}%` : 'N/A'), sub: 'Return on Capital', ratingLabel: 'ROCE' },
    { label: 'Earn. Growth', value: m.earningsGrowth !== 'N/A' ? `${m.earningsGrowth}%` : 'N/A', sub: 'YoY' },
  ]

  const valuationMetrics = [
    { label: 'PE Ratio',     value: m.peRatio   !== 'N/A' ? `${m.peRatio}×`   : 'N/A', sub: 'Trailing' },
    { label: 'Forward PE',   value: m.forwardPE !== 'N/A' ? `${m.forwardPE}×` : 'N/A', sub: 'Forward' },
    { label: 'PB Ratio',     value: m.pbRatio   !== 'N/A' ? `${m.pbRatio}×`   : 'N/A', sub: 'Price to Book' },
    { label: 'EPS',          value: m.eps       !== 'N/A' ? `${m.eps}`         : 'N/A', sub: 'Earnings/Share' },
    { label: 'Beta',         value: m.beta      !== 'N/A' ? `${m.beta}`        : 'N/A', sub: 'Volatility vs. Market' },
    { label: 'Div. Yield',   value: m.dividendYield !== 'N/A' ? `${m.dividendYield}%` : 'N/A', sub: 'Annual Dividend' },
  ]

  const healthMetrics = [
    { label: 'D/E Ratio',     value: m.debtToEquity !== 'N/A' ? `${m.debtToEquity}` : 'N/A', sub: parseFloat(m.debtToEquity) < 1 ? 'Manageable' : 'High leverage', ratingLabel: 'D/E Ratio' },
    { label: 'Current Ratio', value: m.currentRatio !== 'N/A' ? `${m.currentRatio}` : 'N/A', sub: 'Liquidity',  ratingLabel: 'Current Ratio' },
    { label: 'Quick Ratio',   value: m.quickRatio   !== 'N/A' ? `${m.quickRatio}`   : 'N/A', sub: 'Acid Test',  ratingLabel: 'Quick Ratio' },
  ]

  const sectionTitle = (title, color = '#948F7D') => (
    <div style={{
      fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color,
      textTransform: 'uppercase', letterSpacing: '0.08em',
      marginBottom: 10, marginTop: 4, fontWeight: 700,
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span style={{ width: 16, height: 1, background: color, display: 'inline-block' }} />
      {title}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Data Source + 52W Banner */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{
          background: dsConfig.bg, border: `1px solid ${dsConfig.color}30`,
          borderRadius: 8, padding: '6px 14px',
          fontSize: 12, color: dsConfig.color, fontWeight: 600,
        }}>
          📡 Data: {dsConfig.text}
        </div>
        {hi > 0 && lo > 0 && (
          <div style={{
            background: '#141412', border: '1px solid #2C2B25',
            borderRadius: 8, padding: '6px 14px',
            fontSize: 12, color: '#948F7D',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span>52W Low: <span style={{ color: '#E5544D', fontFamily: "'IBM Plex Mono', monospace" }}>{lo.toLocaleString()}</span></span>
            <span style={{ color: '#2C2B25' }}>|</span>
            <span>High: <span style={{ color: '#3FBE72', fontFamily: "'IBM Plex Mono', monospace" }}>{hi.toLocaleString()}</span></span>
            {pctFromLow !== null && (
              <>
                <span style={{ color: '#2C2B25' }}>|</span>
                <span>At <span style={{ color: '#F2C230', fontFamily: "'IBM Plex Mono', monospace" }}>{pctFromLow}%</span> of 52W range</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Income Section */}
      {sectionTitle('Income Statement')}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: -6 }}>
        {incomeMetrics.map(metric => <MetricCard key={metric.label} {...metric} />)}
      </div>

      {/* Margins Section */}
      {sectionTitle('Margins & Growth', '#3FBE72')}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: -6 }}>
        {marginMetrics.map(metric => <MetricCard key={metric.label} {...metric} />)}
      </div>

      {/* Returns Section */}
      {sectionTitle('Returns & Efficiency', '#F2C230')}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: -6 }}>
        {returnMetrics.map(metric => <MetricCard key={metric.label} {...metric} />)}
      </div>

      {/* Valuation Section */}
      {sectionTitle('Valuation Ratios', '#7B8FF5')}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginTop: -6 }}>
        {valuationMetrics.map(metric => <MetricCard key={metric.label} {...metric} />)}
      </div>

      {/* Health Section */}
      {sectionTitle('Financial Health', '#E5544D')}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: -6 }}>
        {healthMetrics.map(metric => <MetricCard key={metric.label} {...metric} />)}
      </div>

      {/* AI Summary + Health Highlights + Sentiment */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 0.8fr', gap: 16 }}>
        {/* AI Summary */}
        <div style={{ background: '#141412', border: '1px solid #2C2B25', borderRadius: 14, padding: '22px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#948F7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
            AI Analysis
          </div>
          <p style={{ color: '#CFCBBB', fontSize: 14, lineHeight: 1.7, margin: '0 0 14px' }}>
            {ai.summary || 'Enable Gemini AI for detailed present analysis.'}
          </p>
          {ai.latest_quarter && (
            <div style={{ background: '#1C1C19', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#948F7D' }}>
              📊 {ai.latest_quarter}
            </div>
          )}
        </div>

        {/* Health Highlights */}
        <div style={{ background: '#141412', border: '1px solid #2C2B25', borderRadius: 14, padding: '22px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#948F7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
            Health Highlights
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(ai.health_highlights || []).map((h, i) => (
              <div key={i} style={{
                display: 'flex', gap: 8, alignItems: 'flex-start',
                padding: '8px 10px', background: '#1C1C19', borderRadius: 8,
              }}>
                <span style={{ color: '#3FBE72', fontSize: 12, flexShrink: 0, paddingTop: 1 }}>✓</span>
                <span style={{ color: '#CFCBBB', fontSize: 13, lineHeight: 1.5 }}>{h}</span>
              </div>
            ))}
            {(!ai.health_highlights || ai.health_highlights.length === 0) && (
              <div style={{ color: '#948F7D', fontSize: 13, fontStyle: 'italic' }}>Enable Gemini AI for highlights.</div>
            )}
          </div>
        </div>

        {/* Sentiment */}
        <div style={{ background: '#141412', border: '1px solid #2C2B25', borderRadius: 14, padding: '22px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#948F7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 20 }}>
            Sentiment
          </div>
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            border: `4px solid ${sc}`,
            margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: sc + '15',
          }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, color: sc }}>
              {ai.sentiment?.[0] || '?'}
            </span>
          </div>
          <div style={{ fontWeight: 700, color: sc, fontSize: 16, fontFamily: "'Fraunces', serif" }}>
            {ai.sentiment || 'N/A'}
          </div>
          <div style={{ color: '#948F7D', fontSize: 11.5, marginTop: 8, lineHeight: 1.5 }}>
            Based on current metrics &amp; AI analysis
          </div>
        </div>
      </div>

      {/* Metric Legend */}
      <div style={{
        background: '#1C1C19', border: '1px solid #2C2B25',
        borderRadius: 10, padding: '10px 14px',
        display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center',
      }}>
        <span style={{ fontSize: 11, color: '#948F7D' }}>Rating dots:</span>
        {[['good', '#3FBE72', 'Strong'], ['ok', '#F2C230', 'Moderate'], ['weak', '#E5544D', 'Weak']].map(([key, color, label]) => (
          <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#948F7D' }}>
            <span style={{ color, fontSize: 9 }}>●</span> {label}
          </span>
        ))}
        <span style={{ fontSize: 11, color: '#948F7D', marginLeft: 'auto', fontStyle: 'italic' }}>
          Benchmarks are industry averages — not absolute rules
        </span>
      </div>
    </div>
  )
}

export default PresentTab
