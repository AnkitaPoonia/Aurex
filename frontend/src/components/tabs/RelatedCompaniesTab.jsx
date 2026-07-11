// ─── components/tabs/RelatedCompaniesTab.jsx ─────────────────────────────────
// Related Companies tab — ecosystem grid showing suppliers, competitors,
// partners, and customers identified by AI. Click-to-research enabled.
// (Moved from components/ → components/tabs/ — no logic change)
// ─────────────────────────────────────────────────────────────────────────────

function RelatedCompaniesTab({ data, onCompanyClick }) {
  const relatedCompanies = data?.ai?.related_companies || []

  const relTagColor = {
    Supplier:   { color: '#F2C230', bg: '#3A3116', border: '#C99A0F' },
    Competitor: { color: '#E5544D', bg: '#2E1715', border: '#B03D37' },
    Partner:    { color: '#3FBE72', bg: '#132A1E', border: '#2A8A50' },
    Customer:   { color: '#7B8FF5', bg: '#1A1B2E', border: '#4A55A8' },
  }

  const relIcon = {
    Supplier:   '📦',
    Competitor: '⚔️',
    Partner:    '🤝',
    Customer:   '🛒',
  }

  const legendItems = Object.entries(relTagColor).map(([key, val]) => ({
    label: key,
    ...val,
    icon: relIcon[key],
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ background: '#141412', border: '1px solid #2C2B25', borderRadius: 14, padding: '24px' }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11, color: '#F2C230',
          textTransform: 'uppercase', letterSpacing: '0.1em',
          marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ width: 16, height: 1, background: '#C99A0F', display: 'inline-block' }} />
          Business Ecosystem
        </div>
        <h2 style={{
          fontFamily: "'Fraunces', serif", fontSize: 22,
          fontWeight: 600, margin: '0 0 8px', color: '#F3F1E7',
        }}>
          Related Companies
        </h2>
        <p style={{ color: '#948F7D', fontSize: 13.5, margin: 0, lineHeight: 1.6 }}>
          These are actual suppliers, competitors, partners, and customers — not peer comparisons.
          Click any company to research it instantly.
        </p>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
          {legendItems.map(item => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: item.bg, border: `1px solid ${item.border}`,
              borderRadius: 20, padding: '4px 12px',
              fontSize: 11.5, color: item.color, fontWeight: 600,
            }}>
              <span>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Company Cards Grid */}
      {relatedCompanies.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {relatedCompanies.map((company, idx) => {
            const tag  = relTagColor[company.relationship] || relTagColor['Partner']
            const icon = relIcon[company.relationship]     || '🔗'
            return (
              <div
                key={idx}
                id={`related-company-${idx}`}
                onClick={() => onCompanyClick && onCompanyClick(company.name)}
                style={{
                  background: '#141412',
                  border: `1px solid #2C2B25`,
                  borderRadius: 14, padding: '20px',
                  cursor: 'pointer',
                  transition: 'border-color 0.18s, transform 0.18s, background 0.18s',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = tag.border
                  e.currentTarget.style.transform   = 'translateY(-3px)'
                  e.currentTarget.style.background  = tag.bg
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = '#2C2B25'
                  e.currentTarget.style.transform   = 'translateY(0)'
                  e.currentTarget.style.background  = '#141412'
                }}
              >
                {/* Top row: name + icon */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <h4 style={{
                      fontFamily: "'Fraunces', serif", fontSize: 16,
                      fontWeight: 600, margin: '0 0 2px', color: '#F3F1E7',
                    }}>
                      {company.name}
                    </h4>
                    {company.ticker && company.ticker !== 'N/A' && (
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#948F7D' }}>
                        {company.ticker}
                      </div>
                    )}
                  </div>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: tag.bg, border: `1px solid ${tag.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, flexShrink: 0,
                  }}>
                    {icon}
                  </div>
                </div>

                {/* Relationship badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: tag.bg, color: tag.color,
                  fontSize: 10.5, fontWeight: 700,
                  padding: '3px 10px', borderRadius: 99,
                  border: `1px solid ${tag.border}`,
                  marginBottom: 10,
                }}>
                  {company.relationship}
                </div>

                {/* Reason */}
                <p style={{ color: '#948F7D', fontSize: 12.5, lineHeight: 1.6, margin: 0 }}>
                  {company.reason}
                </p>

                {/* Research arrow */}
                <div style={{
                  marginTop: 12, fontSize: 11.5,
                  color: tag.color, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  Research this company →
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{
          background: '#141412', border: '1px solid #2C2B25',
          borderRadius: 14, padding: '48px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
          <div style={{ color: '#F3F1E7', fontFamily: "'Fraunces', serif", fontSize: 16, marginBottom: 8 }}>
            No Related Companies Found
          </div>
          <div style={{ color: '#948F7D', fontSize: 13.5 }}>
            Add your Gemini API key to backend/.env to enable AI-generated ecosystem analysis.
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div style={{
        background: '#1C1C19', border: '1px solid #2C2B25',
        borderRadius: 10, padding: '12px 16px',
        fontSize: 12, color: '#948F7D', lineHeight: 1.6,
      }}>
        ℹ️ Related companies are AI-identified based on public knowledge about business relationships.
        Click any card to run a full research report on that company. These are not investment recommendations.
      </div>
    </div>
  )
}

export default RelatedCompaniesTab
