// ─── components/tabs/PastTab.jsx ─────────────────────────────────────────────
// Past performance tab — revenue/profit chart, historical summary, major events,
// pros and cons from AI analysis.
// Updated: uses shared formatNum from utils/formatter.js (was duplicated here)
// ─────────────────────────────────────────────────────────────────────────────

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { formatNum } from '../../utils/formatter.js'

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1C1C19', border: '1px solid #2C2B25', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ color: '#948F7D', marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace" }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: {formatNum(p.value, currency)}
        </div>
      ))}
    </div>
  )
}

function PastTab({ data }) {
  const ai = data.ai?.past || {}
  const currency = data.company.currency
  const chartData = (data.historical?.revenue || []).map(item => ({
    year: String(item.year),
    Revenue: item.revenue,
    Profit: item.profit,
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Chart */}
      <div style={{ background: '#141412', border: '1px solid #2C2B25', borderRadius: 14, padding: '22px' }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#948F7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
          Revenue &amp; Profit Trend
        </div>
        <div style={{ fontSize: 13, color: '#948F7D', marginBottom: 18 }}>Historical performance over available years</div>

        {chartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2C2B25" />
                <XAxis dataKey="year" stroke="#948F7D" tick={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", fill: '#948F7D' }} />
                <YAxis stroke="#948F7D" tick={{ fontSize: 11, fill: '#948F7D' }} tickFormatter={v => formatNum(v, '')} width={60} />
                <Tooltip content={<CustomTooltip currency={currency} />} />
                <Line type="monotone" dataKey="Revenue" stroke="#F2C230" strokeWidth={2.5} dot={{ fill: '#F2C230', r: 4 }} />
                <Line type="monotone" dataKey="Profit"  stroke="#3FBE72" strokeWidth={2.5} dot={{ fill: '#3FBE72', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 18, marginTop: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#948F7D' }}>
                <span style={{ width: 14, height: 2, background: '#F2C230', display: 'inline-block', borderRadius: 1 }} />
                Revenue
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#948F7D' }}>
                <span style={{ width: 14, height: 2, background: '#3FBE72', display: 'inline-block', borderRadius: 1 }} />
                Net Profit
              </span>
            </div>
          </>
        ) : (
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#948F7D', fontSize: 13 }}>
            Historical data not available for this company.
          </div>
        )}
      </div>

      {/* Summary + Pros Cons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Historical Summary */}
          <div style={{ background: '#141412', border: '1px solid #2C2B25', borderRadius: 14, padding: '22px' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#948F7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
              Historical Summary
            </div>
            <p style={{ color: '#CFCBBB', fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>
              {ai.summary || 'Enable Gemini AI for historical analysis.'}
            </p>
          </div>

          {/* Major Events */}
          <div style={{ background: '#141412', border: '1px solid #2C2B25', borderRadius: 14, padding: '22px', flex: 1 }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#948F7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>
              Major Events
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(ai.events || []).map((event, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#F2C230', fontSize: 12, flexShrink: 0, paddingTop: 2 }}>
                    {event.year}
                  </span>
                  <span style={{ color: '#CFCBBB', fontSize: 13, lineHeight: 1.55 }}>{event.desc}</span>
                </div>
              ))}
              {(!ai.events || ai.events.length === 0) && (
                <div style={{ color: '#948F7D', fontSize: 13 }}>Enable Gemini AI to see key events.</div>
              )}
            </div>
          </div>
        </div>

        {/* Pros and Cons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#132A1E', border: '1px solid #1F4B31', borderRadius: 14, padding: '22px', flex: 1 }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#3FBE72', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14, fontWeight: 700 }}>
              ✓ Pros
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(ai.pros || []).map((p, i) => (
                <li key={i} style={{ color: '#D8D4C4', fontSize: 13, lineHeight: 1.6 }}>{p}</li>
              ))}
              {(!ai.pros || ai.pros.length === 0) && (
                <li style={{ color: '#948F7D', fontSize: 13 }}>Enable Gemini AI.</li>
              )}
            </ul>
          </div>

          <div style={{ background: '#2E1715', border: '1px solid #4C2320', borderRadius: 14, padding: '22px', flex: 1 }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#E5544D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14, fontWeight: 700 }}>
              ✗ Cons
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(ai.cons || []).map((c, i) => (
                <li key={i} style={{ color: '#D8D4C4', fontSize: 13, lineHeight: 1.6 }}>{c}</li>
              ))}
              {(!ai.cons || ai.cons.length === 0) && (
                <li style={{ color: '#948F7D', fontSize: 13 }}>Enable Gemini AI.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PastTab
