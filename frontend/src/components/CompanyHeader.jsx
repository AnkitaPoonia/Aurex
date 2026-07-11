// ─── components/CompanyHeader.jsx ─────────────────────────────────────────────
// Company name, ticker badge, price, and daily change shown above the tabs.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @param {object} company  Company object from the research API response
 */
function CompanyHeader({ company }) {
  const currencySymbol =
    company.currency === 'INR' ? '₹' :
    company.currency === 'USD' ? '$' :
    '';

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 16, marginBottom: 20,
    }}>
      {/* Left: Logo mark + name + exchange */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 12,
          background: '#3A3116', border: '1px solid #C99A0F',
          color: '#F2C230',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 13,
          flexShrink: 0,
        }}>
          {(company.ticker || 'XX').slice(0, 4)}
        </div>
        <div>
          <h1 style={{
            fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, margin: 0,
          }}>
            {company.name}
          </h1>
          <div style={{ color: '#948F7D', fontSize: 13, marginTop: 3 }}>
            {company.exchange} ·{' '}
            <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{company.ticker}</span>
            {' '}· {company.sector}
          </div>
        </div>
      </div>

      {/* Right: Price + change */}
      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 24, fontWeight: 600,
        }}>
          {currencySymbol}{company.currentPrice?.toLocaleString()}
        </div>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600,
          color: company.priceChange >= 0 ? '#3FBE72' : '#E5544D',
        }}>
          {company.priceChange >= 0 ? '▲' : '▼'}{' '}
          {Math.abs(company.priceChange).toFixed(2)}% today
        </div>
      </div>
    </div>
  );
}

export default CompanyHeader;
