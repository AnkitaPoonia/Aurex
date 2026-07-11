// ─── components/tabs/FutureTab.jsx ───────────────────────────────────────────
// Future outlook tab — bullish/neutral/bearish bars, why-verdict reasoning,
// projected chart, trend statements, historical analogies.
// (Moved from components/ → components/tabs/ — no logic change)
// ─────────────────────────────────────────────────────────────────────────────

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1C1C19', border: '1px solid #2C2B25', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ color: '#948F7D', marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace" }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  )
}

function FutureTab({ data }) {
  const ai      = data.ai || {}
  const future  = ai.future || {}
  const historical = data.historical?.revenue || []
  const verdict = ai.verdict || 'WAIT'

  const verdictColor = { INVEST: '#3FBE72', WAIT: '#F2C230', SKIP: '#E5544D' }
  const verdictBg    = { INVEST: '#132A1E', WAIT: '#3A3116',  SKIP: '#2E1715'  }
  const verdictBorder= { INVEST: '#2A8A50', WAIT: '#C99A0F',  SKIP: '#B03D37'  }
  const vc = verdictColor[verdict] || '#F2C230'
  const vb = verdictBg[verdict]    || '#3A3116'

  const bullish = future.bullish ?? 40
  const neutral = future.neutral ?? 35
  const bearish = future.bearish ?? 25

  const dominantOutlook = bullish >= neutral && bullish >= bearish ? 'Bullish'
    : neutral >= bullish && neutral >= bearish ? 'Neutral' : 'Bearish'

  const chartData = historical.map(item => ({
    year: String(item.year),
    Historical: item.revenue,
    Projected: null,
  }))

  if (chartData.length > 0) {
    const lastVal = chartData[chartData.length - 1]?.Historical || 0
    const growthFactor = bullish > 50 ? 1.12 : bullish > 35 ? 1.06 : 0.98
    chartData[chartData.length - 1] = { ...chartData[chartData.length - 1], Projected: lastVal }
    const lastYear = parseInt(chartData[chartData.length - 1].year) || new Date().getFullYear()
    chartData.push({ year: String(lastYear + 1), Historical: null, Projected: Math.round(lastVal * growthFactor) })
    chartData.push({ year: String(lastYear + 2), Historical: null, Projected: Math.round(lastVal * growthFactor * growthFactor) })
  }

  const outlookCards = [
    { key: 'bull', label: 'Bullish', pct: bullish, color: '#3FBE72', bg: '#132A1E', activeBorder: '#3FBE72' },
    { key: 'neu',  label: 'Neutral', pct: neutral,  color: '#F2C230', bg: '#3A3116', activeBorder: '#F2C230' },
    { key: 'bear', label: 'Bearish', pct: bearish,  color: '#E5544D', bg: '#2E1715', activeBorder: '#E5544D' },
  ]

  const investReasoning    = future.invest_reasoning    || {}
  const trendStatements    = future.trend_statements    || []
  const historicalExamples = future.historical_examples || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Outlook Tri */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        {outlookCards.map(card => (
          <div key={card.key} style={{
            background: card.bg,
            border: `${dominantOutlook === card.label ? 2 : 1}px solid ${dominantOutlook === card.label ? card.activeBorder : '#2C2B25'}`,
            borderRadius: 12, padding: '22px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 30, fontWeight: 600, color: card.color, margin: '4px 0 6px' }}>
              {card.pct}%
            </div>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: card.color, letterSpacing: '0.02em' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* ─── WHY INVEST / WAIT / SKIP ─────────────────────────────────────────── */}
      <div style={{ background: '#141412', border: `1px solid ${verdictBorder[verdict] || '#2C2B25'}`, borderRadius: 14, padding: '22px' }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5,
          color: vc, textTransform: 'uppercase', letterSpacing: '0.07em',
          marginBottom: 14, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{
            background: vb, border: `1px solid ${vc}`,
            padding: '2px 10px', borderRadius: 6, fontSize: 11,
          }}>
            {verdict}
          </span>
          Why this verdict?
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {/* Core Reasons */}
          <div>
            <div style={{ fontSize: 11, color: '#948F7D', fontFamily: "'IBM Plex Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              Core Reasons
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(investReasoning.why || []).map((reason, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  background: '#1C1C19', borderRadius: 8, padding: '10px 12px',
                }}>
                  <span style={{ color: vc, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, flexShrink: 0, paddingTop: 1 }}>
                    {i + 1}.
                  </span>
                  <span style={{ color: '#D8D4C4', fontSize: 13, lineHeight: 1.55 }}>{reason}</span>
                </div>
              ))}
              {(!investReasoning.why || investReasoning.why.length === 0) && (
                <div style={{ color: '#948F7D', fontSize: 13, fontStyle: 'italic' }}>Enable Gemini AI for reasoning.</div>
              )}
            </div>
          </div>

          {/* Metric Signals + Caution Flags */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: '#948F7D', fontFamily: "'IBM Plex Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Key Metric Signals
              </div>
              {(investReasoning.key_metric_signals || []).map((signal, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
                  <span style={{ color: '#3FBE72', fontSize: 12, flexShrink: 0, paddingTop: 1 }}>✓</span>
                  <span style={{ color: '#CFCBBB', fontSize: 13, lineHeight: 1.5 }}>{signal}</span>
                </div>
              ))}
            </div>
            {(investReasoning.caution_flags || []).length > 0 && (
              <div>
                <div style={{ fontSize: 11, color: '#E5544D', fontFamily: "'IBM Plex Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  ⚠ Caution Flags
                </div>
                {investReasoning.caution_flags.map((flag, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
                    <span style={{ color: '#E5544D', fontSize: 12, flexShrink: 0, paddingTop: 1 }}>!</span>
                    <span style={{ color: '#CFCBBB', fontSize: 13, lineHeight: 1.5 }}>{flag}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Projected Chart */}
      <div style={{ background: '#141412', border: '1px solid #2C2B25', borderRadius: 14, padding: '22px' }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#948F7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
          Projected Trend
        </div>
        <div style={{ fontSize: 13, color: '#948F7D', marginBottom: 16 }}>
          Directional only — not a price target. Based on AI sentiment analysis.
        </div>
        {chartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2C2B25" />
                <XAxis dataKey="year" stroke="#948F7D" tick={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", fill: '#948F7D' }} />
                <YAxis stroke="#948F7D" tick={{ fontSize: 11, fill: '#948F7D' }} hide />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Historical" stroke="#3FBE72" strokeWidth={2.5} dot={{ fill: '#3FBE72', r: 4 }} connectNulls={false} />
                <Line type="monotone" dataKey="Projected"  stroke="#F2C230" strokeWidth={2.5} strokeDasharray="6 5" dot={{ fill: '#F2C230', r: 4 }} connectNulls={true} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 18, marginTop: 10 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#948F7D' }}>
                <span style={{ width: 14, height: 2, background: '#3FBE72', display: 'inline-block', borderRadius: 1 }} />
                Historical
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#948F7D' }}>
                <span style={{ width: 14, height: 2, background: '#F2C230', display: 'inline-block', borderRadius: 1 }} />
                Projected direction
              </span>
            </div>
          </>
        ) : (
          <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#948F7D', fontSize: 13 }}>
            Historical data needed for projection.
          </div>
        )}
      </div>

      {/* Drivers + Risks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#141412', border: '1px solid #2C2B25', borderRadius: 14, padding: '22px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#3FBE72', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14, fontWeight: 700 }}>
            ↑ Growth Drivers
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(future.growth_drivers || []).map((d, i) => (
              <li key={i} style={{ color: '#D8D4C4', fontSize: 13.5, lineHeight: 1.6 }}>{d}</li>
            ))}
            {(!future.growth_drivers || future.growth_drivers.length === 0) && (
              <li style={{ color: '#948F7D', fontSize: 13 }}>Enable Gemini AI.</li>
            )}
          </ul>
        </div>
        <div style={{ background: '#141412', border: '1px solid #2C2B25', borderRadius: 14, padding: '22px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#E5544D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14, fontWeight: 700 }}>
            ↓ Future Risks
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(future.risks || []).map((r, i) => (
              <li key={i} style={{ color: '#D8D4C4', fontSize: 13.5, lineHeight: 1.6 }}>{r}</li>
            ))}
            {(!future.risks || future.risks.length === 0) && (
              <li style={{ color: '#948F7D', fontSize: 13 }}>Enable Gemini AI.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Industry Outlook + Business Opportunity + AI Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 16 }}>
        <div style={{ background: '#141412', border: '1px solid #2C2B25', borderRadius: 14, padding: '20px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#948F7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Industry Outlook</div>
          <p style={{ color: '#CFCBBB', fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{future.industry_outlook || 'Enable Gemini AI.'}</p>
        </div>
        <div style={{ background: '#141412', border: '1px solid #2C2B25', borderRadius: 14, padding: '20px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#948F7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Business Opportunity</div>
          <p style={{ color: '#CFCBBB', fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{future.business_opportunity || 'Enable Gemini AI.'}</p>
        </div>
        <div style={{ background: '#141412', border: '1px solid #2C2B25', borderRadius: 14, padding: '20px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#948F7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>AI Summary</div>
          <p style={{ color: '#CFCBBB', fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{future.summary || 'Enable Gemini AI for forward-looking analysis.'}</p>
        </div>
      </div>

      {/* ─── TREND STATEMENTS ──────────────────────────────────────────────────── */}
      <div style={{ background: '#141412', border: '1px solid #2C2B25', borderRadius: 14, padding: '22px' }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5,
          color: '#7B8FF5', textTransform: 'uppercase', letterSpacing: '0.07em',
          marginBottom: 6, fontWeight: 700,
        }}>
          📈 Trend Statements
        </div>
        <div style={{ fontSize: 12, color: '#948F7D', marginBottom: 16 }}>
          These are AI-generated probability estimates based on observable trends — not guarantees or financial advice.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {trendStatements.length > 0 ? trendStatements.map((stmt, i) => (
            <div key={i} style={{
              background: '#1A1B2E', border: '1px solid #2C2D4A',
              borderRadius: 10, padding: '14px 16px',
              display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: '#2C2D4A', border: '1px solid #4A55A8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
                color: '#7B8FF5', flexShrink: 0, marginTop: 1,
              }}>
                {i + 1}
              </div>
              <p style={{ color: '#CFCBBB', fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{stmt}</p>
            </div>
          )) : (
            <div style={{ color: '#948F7D', fontSize: 13, fontStyle: 'italic' }}>
              Enable Gemini AI to get probabilistic trend statements for this company.
            </div>
          )}
        </div>
      </div>

      {/* ─── HISTORICAL EXAMPLES ───────────────────────────────────────────────── */}
      {historicalExamples.length > 0 && (
        <div style={{ background: '#141412', border: '1px solid #2C2B25', borderRadius: 14, padding: '22px' }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5,
            color: '#F2C230', textTransform: 'uppercase', letterSpacing: '0.07em',
            marginBottom: 6, fontWeight: 700,
          }}>
            🏛 Historical Market Analogies
          </div>
          <div style={{ fontSize: 12, color: '#948F7D', marginBottom: 16 }}>
            Real past examples from the market that share a comparable pattern. Illustrative only — history doesn't repeat perfectly.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {historicalExamples.map((ex, i) => (
              <div key={i} style={{
                background: '#1C1C19', border: '1px solid #2C2B25',
                borderRadius: 12, padding: '18px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 600, color: '#F3F1E7', marginBottom: 2 }}>
                      {ex.company}
                    </div>
                    <div style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 10.5, color: '#F2C230',
                      background: '#3A3116', padding: '2px 8px', borderRadius: 4,
                      display: 'inline-block',
                    }}>
                      {ex.period}
                    </div>
                  </div>
                  <div style={{ fontSize: 20 }}>📊</div>
                </div>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: '#948F7D', fontFamily: "'IBM Plex Mono', monospace", textTransform: 'uppercase' }}>Pattern: </span>
                  <span style={{ fontSize: 13, color: '#CFCBBB' }}>{ex.pattern}</span>
                </div>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: '#948F7D', fontFamily: "'IBM Plex Mono', monospace", textTransform: 'uppercase' }}>Outcome: </span>
                  <span style={{ fontSize: 13, color: '#3FBE72' }}>{ex.outcome}</span>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#948F7D', fontFamily: "'IBM Plex Mono', monospace", textTransform: 'uppercase' }}>Relevance: </span>
                  <span style={{ fontSize: 13, color: '#CFCBBB' }}>{ex.relevance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div style={{
        background: '#1C1C19', border: '1px solid #2C2B25',
        borderRadius: 10, padding: '14px 16px',
        fontSize: 12, color: '#948F7D', lineHeight: 1.6,
      }}>
        ⚠️ All future projections, trend statements, and historical analogies are AI-generated probability estimates for educational purposes only.
        They are not financial predictions or investment advice. Markets are inherently uncertain — always conduct your own due diligence.
      </div>
    </div>
  )
}

export default FutureTab
