// ─── components/tabs/VerdictTab.jsx ──────────────────────────────────────────
// AI Verdict tab — shows the INVEST/WAIT/SKIP badge, confidence, reasoning,
// recommended action, and the quick summary triptych.
// (Moved from components/ → components/tabs/ — no logic change)
// ─────────────────────────────────────────────────────────────────────────────

function VerdictTab({ data }) {
  const ai = data.ai || {}

  const verdictConfig = {
    INVEST: { emoji: '🟢', color: '#3FBE72', bg: '#132A1E', border: '#3FBE72', label: 'INVEST' },
    WAIT:   { emoji: '🟡', color: '#F2C230', bg: '#3A3116', border: '#F2C230', label: 'WAIT' },
    SKIP:   { emoji: '🔴', color: '#E5544D', bg: '#2E1715', border: '#E5544D', label: 'SKIP' },
  }
  const verdict = verdictConfig[ai.verdict] || verdictConfig['WAIT']

  const quickSummary = ai.quick_summary || {}

  const summaryColor = {
    Positive: '#3FBE72', Strong: '#3FBE72', Promising: '#3FBE72',
    Mixed: '#F2C230', Moderate: '#F2C230', Uncertain: '#F2C230',
    Negative: '#E5544D', Weak: '#E5544D', Risky: '#E5544D',
  }

  return (
    <div>
      {/* Main Verdict Badge */}
      <div style={{
        background: `linear-gradient(155deg, ${verdict.bg} 0%, #141412 100%)`,
        border: `2px solid ${verdict.color}`,
        borderRadius: 18,
        padding: '32px 28px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 18,
            background: verdict.bg, border: `1px solid ${verdict.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 38,
          }}>
            {verdict.emoji}
          </div>
          <div>
            <div style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 40, fontWeight: 700,
              color: verdict.color, lineHeight: 1,
            }}>
              {verdict.label}
            </div>
            <div style={{ color: '#948F7D', fontSize: 13, marginTop: 6 }}>
              AI-powered analysis
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 28, fontWeight: 600, color: '#F3F1E7' }}>
              {ai.decision_strength || '—'}<span style={{ fontSize: 16, color: '#948F7D' }}>/10</span>
            </div>
            <div style={{ fontSize: 11, color: '#948F7D', marginTop: 4 }}>Decision Strength</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 28, fontWeight: 600, color: '#F3F1E7' }}>
              {ai.confidence || '—'}<span style={{ fontSize: 16, color: '#948F7D' }}>%</span>
            </div>
            <div style={{ fontSize: 11, color: '#948F7D', marginTop: 4 }}>Confidence</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Short Reason + Recommended Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#141412', border: '1px solid #2C2B25', borderRadius: 14, padding: '22px' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#948F7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
              AI Reasoning
            </div>
            <p style={{ color: '#D8D4C4', fontSize: 14.5, lineHeight: 1.7, margin: 0 }}>
              {ai.short_reason || 'Analysis not available. Please add a Gemini API key.'}
            </p>
          </div>

          <div style={{ background: '#141412', border: '1px solid #2C2B25', borderRadius: 14, padding: '22px' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#948F7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
              Recommended Action
            </div>
            <div style={{
              display: 'inline-block',
              background: verdict.bg,
              border: `1px solid ${verdict.border}`,
              color: verdict.color,
              padding: '8px 16px',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
            }}>
              {ai.recommended_action || 'Configure AI to get a recommendation.'}
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div style={{ background: '#141412', border: '1px solid #2C2B25', borderRadius: 14, padding: '22px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#948F7D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>
            Quick Summary
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Past', value: quickSummary.past || '—', detail: quickSummary.past_detail || '' },
              { label: 'Present', value: quickSummary.present || '—', detail: quickSummary.present_detail || '' },
              { label: 'Future', value: quickSummary.future || '—', detail: quickSummary.future_detail || '' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#1C1C19', borderRadius: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#948F7D', fontFamily: "'IBM Plex Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                  {item.detail && <div style={{ fontSize: 12, color: '#948F7D', marginTop: 2 }}>{item.detail}</div>}
                </div>
                <div style={{
                  fontWeight: 700, fontSize: 13,
                  color: summaryColor[item.value] || '#F3F1E7',
                  background: summaryColor[item.value] ? summaryColor[item.value] + '18' : '#2C2B25',
                  padding: '4px 10px', borderRadius: 6,
                }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default VerdictTab
