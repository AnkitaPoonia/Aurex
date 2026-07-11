import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, TrendingUp, Clock, Zap, BarChart2, Shield, Target, ChevronRight, ArrowDown } from 'lucide-react'

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    borderBottom: '1px solid #2C2B25',
    position: 'sticky',
    top: 0,
    zIndex: 60,
    background: 'rgba(10,10,11,0.92)',
    backdropFilter: 'blur(12px)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontFamily: "'Fraunces', serif",
    fontWeight: 600,
    fontSize: 20,
    color: '#F3F1E7',
    textDecoration: 'none',
  },
  logoMark: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: '#F2C230',
    color: '#0A0A0B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 700,
    fontSize: 15,
  },
  searchBoxNav: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#141412',
    border: '1px solid #2C2B25',
    borderRadius: 10,
    padding: '6px 6px 6px 14px',
    width: 280,
  },
  heroSection: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '80px 24px 40px',
    textAlign: 'center',
  },
  heroTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: '#3A3116',
    border: '1px solid #C99A0F',
    borderRadius: 99,
    padding: '5px 14px',
    fontSize: 12,
    fontFamily: "'IBM Plex Mono', monospace",
    color: '#F2C230',
    marginBottom: 24,
    letterSpacing: '0.05em',
  },
  heroTitle: {
    fontSize: 'clamp(36px, 6vw, 60px)',
    lineHeight: 1.1,
    fontWeight: 600,
    letterSpacing: '-0.02em',
    marginBottom: 18,
    fontFamily: "'Fraunces', serif",
  },
  heroSub: {
    color: '#948F7D',
    fontSize: 17,
    maxWidth: 520,
    margin: '0 auto 40px',
    lineHeight: 1.6,
  },
  searchBox: {
    maxWidth: 660,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#141412',
    border: '1.5px solid #2C2B25',
    borderRadius: 14,
    padding: '8px 8px 8px 20px',
    transition: 'border-color 0.2s',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: '#F3F1E7',
    fontSize: 16,
    padding: '10px 0',
    fontFamily: "'Inter', sans-serif",
  },
  searchBtn: {
    background: '#F2C230',
    color: '#0A0A0B',
    border: 'none',
    padding: '12px 24px',
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontFamily: "'Inter', sans-serif",
    transition: 'opacity 0.2s',
  },
  featureSection: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '60px 24px',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 20,
    marginTop: 40,
  },
  featureCard: {
    background: '#141412',
    border: '1px solid #2C2B25',
    borderRadius: 16,
    padding: '28px 24px',
    transition: 'border-color 0.2s, transform 0.2s',
    cursor: 'default',
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  howSection: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '60px 24px',
  },
  stepRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 20,
    marginTop: 16,
  },
  stepNum: {
    width: 36,
    height: 36,
    borderRadius: 99,
    background: '#3A3116',
    border: '1px solid #C99A0F',
    color: '#F2C230',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 700,
    fontSize: 14,
    flexShrink: 0,
  },
  whySection: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '60px 24px',
  },
  whyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
    marginTop: 32,
  },
  whyCard: {
    background: '#141412',
    border: '1px solid #2C2B25',
    borderRadius: 12,
    padding: '20px',
  },
  ctaSection: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '60px 24px',
    textAlign: 'center',
  },
  ctaBox: {
    background: '#141412',
    border: '1px solid #2C2B25',
    borderRadius: 20,
    padding: '60px 40px',
  },
  ctaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: '#F2C230',
    color: '#0A0A0B',
    border: 'none',
    padding: '14px 32px',
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    marginTop: 28,
    fontFamily: "'Inter', sans-serif",
    transition: 'opacity 0.2s',
  },
  footer: {
    borderTop: '1px solid #2C2B25',
    padding: '28px 24px',
    textAlign: 'center',
    color: '#948F7D',
    fontSize: 13,
  },
  kicker: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11.5,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#F2C230',
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 600,
    letterSpacing: '-0.01em',
    marginBottom: 6,
    fontFamily: "'Fraunces', serif",
  },
  sectionSub: {
    color: '#948F7D',
    fontSize: 14,
    maxWidth: 500,
  },
  divider: {
    borderBottom: '1px solid #2C2B25',
    margin: '0 24px',
  },
}

function LandingPage() {
  const [query, setQuery] = useState('')
  const [navQuery, setNavQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(q) {
    const trimmed = q.trim()
    if (!trimmed) return
    navigate(`/research/${encodeURIComponent(trimmed)}`)
  }

  function handleKeyDown(e, q) {
    if (e.key === 'Enter') handleSearch(q)
  }

  return (
    <div style={{ background: '#0A0A0B', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <div style={styles.logoMark}>A</div>
          Aurex
        </div>
        <div style={styles.searchBoxNav}>
          <Search size={16} color="#948F7D" />
          <input
            style={{ ...styles.searchInput, fontSize: 14, padding: '4px 0' }}
            placeholder="Search a company..."
            value={navQuery}
            onChange={e => setNavQuery(e.target.value)}
            onKeyDown={e => handleKeyDown(e, navQuery)}
          />
          <button
            style={{ ...styles.searchBtn, padding: '6px 14px', fontSize: 12, borderRadius: 8 }}
            onClick={() => handleSearch(navQuery)}
          >
            Go
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroTag}>
          <Zap size={12} /> AI-Powered Investment Research
        </div>
        <h1 style={styles.heroTitle}>
          Understand the <span style={{ color: '#F2C230' }}>Market.</span>
          <br />Not Just the Stock.
        </h1>
        <p style={styles.heroSub}>
          Aurex traces a company's past, present, and future — then gives you one honest verdict: INVEST, WAIT, or SKIP.
        </p>

        <div
          style={styles.searchBox}
          onFocus={e => e.currentTarget.style.borderColor = '#F2C230'}
          onBlur={e => e.currentTarget.style.borderColor = '#2C2B25'}
        >
          <Search size={20} color="#948F7D" style={{ flexShrink: 0 }} />
          <input
            style={styles.searchInput}
            placeholder="Enter ticker: HDFCBANK.NS, RELIANCE.NS, AAPL, TSLA..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => handleKeyDown(e, query)}
            autoFocus
          />
          <button
            style={styles.searchBtn}
            onClick={() => handleSearch(query)}
            onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            Start Research
          </button>
        </div>

        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: 'Reliance', ticker: 'RELIANCE.NS' },
            { label: 'Infosys', ticker: 'INFY.NS' },
            { label: 'HDFC Bank', ticker: 'HDFCBANK.NS' },
            { label: 'Apple', ticker: 'AAPL' },
            { label: 'Tesla', ticker: 'TSLA' },
          ].map(s => (
            <button
              key={s.ticker}
              onClick={() => handleSearch(s.ticker)}
              style={{
                background: 'transparent',
                border: '1px solid #2C2B25',
                borderRadius: 99,
                padding: '5px 14px',
                fontSize: 12.5,
                color: '#948F7D',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                transition: 'all 0.15s',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = '#F2C230'; e.currentTarget.style.color = '#F2C230' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#2C2B25'; e.currentTarget.style.color = '#948F7D' }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </section>

      <div style={styles.divider} />

      {/* Feature Cards */}
      <section style={styles.featureSection}>
        <div style={styles.kicker}>
          <span style={{ width: 16, height: 1, background: '#C99A0F', display: 'inline-block' }} />
          What Aurex Analyses
        </div>
        <h2 style={styles.sectionTitle}>Past → Present → Future</h2>
        <p style={styles.sectionSub}>Everything exists to justify one verdict. Each section builds the case.</p>

        <div style={styles.featureGrid}>
          {[
            {
              icon: <Clock size={22} color="#F2C230" />,
              iconBg: '#3A3116',
              label: '01 — Past',
              title: 'How it performed',
              desc: 'Revenue trends, profit history, major events, and what shaped the company into what it is today.',
              color: '#F2C230',
            },
            {
              icon: <BarChart2 size={22} color="#3FBE72" />,
              iconBg: '#132A1E',
              label: '02 — Present',
              title: 'Current health',
              desc: 'ROE, ROCE, PE, Debt, Cash Flow, Operating Margins — the numbers that matter right now.',
              color: '#3FBE72',
            },
            {
              icon: <TrendingUp size={22} color="#7B8FF5" />,
              iconBg: '#1A1B2E',
              label: '03 — Future',
              title: 'What comes next',
              desc: 'Growth drivers, risks, industry outlook, and directional projections — without price predictions.',
              color: '#7B8FF5',
            },
          ].map(f => (
            <div
              key={f.label}
              style={styles.featureCard}
              onMouseOver={e => { e.currentTarget.style.borderColor = f.color; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#2C2B25'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ ...styles.featureIcon, background: f.iconBg }}>
                {f.icon}
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: f.color, marginBottom: 8, letterSpacing: '0.06em' }}>
                {f.label}
              </div>
              <h3 style={{ fontSize: 18, marginBottom: 10, fontFamily: "'Fraunces', serif", fontWeight: 600 }}>{f.title}</h3>
              <p style={{ color: '#948F7D', fontSize: 13.5, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={styles.divider} />

      {/* How It Works */}
      <section style={styles.howSection}>
        <div style={styles.kicker}>
          <span style={{ width: 16, height: 1, background: '#C99A0F', display: 'inline-block' }} />
          Simple Process
        </div>
        <h2 style={styles.sectionTitle}>How Aurex Works</h2>
        <p style={{ ...styles.sectionSub, marginBottom: 40 }}>Three steps from search to verdict.</p>

        <div style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { num: '01', title: 'Search a Company', desc: 'Type any company name or stock ticker. Aurex finds and resolves it automatically.' },
            { num: '02', title: 'AI Research', desc: 'Real financial data is fetched and analysed by AI — past trends, present metrics, future outlook.' },
            { num: '03', title: 'Investment Verdict', desc: 'You get one clear answer: INVEST, WAIT, or SKIP — with full reasoning to back it up.' },
          ].map((step, idx) => (
            <div key={step.num}>
              <div style={styles.stepRow}>
                <div style={styles.stepNum}>{step.num}</div>
                <div style={{ paddingTop: 6 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, fontFamily: "'Fraunces', serif" }}>{step.title}</div>
                  <div style={{ color: '#948F7D', fontSize: 13.5, lineHeight: 1.6 }}>{step.desc}</div>
                </div>
              </div>
              {idx < 2 && (
                <div style={{ paddingLeft: 18, marginTop: 8, marginBottom: 8 }}>
                  <ArrowDown size={16} color="#2C2B25" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div style={styles.divider} />

      {/* Why Aurex */}
      <section style={styles.whySection}>
        <div style={styles.kicker}>
          <span style={{ width: 16, height: 1, background: '#C99A0F', display: 'inline-block' }} />
          Why Aurex
        </div>
        <h2 style={styles.sectionTitle}>Built differently</h2>
        <p style={{ ...styles.sectionSub, marginBottom: 0 }}>Not another screener. Not another dashboard.</p>

        <div style={styles.whyGrid}>
          {[
            { icon: <Target size={18} color="#F2C230" />, title: 'Verdict First', desc: 'The INVEST/WAIT/SKIP decision is always front and centre. Everything else supports it.' },
            { icon: <Shield size={18} color="#3FBE72" />, title: 'Real Data Only', desc: 'All financial data comes from Yahoo Finance. AI explains, never invents numbers.' },
            { icon: <Zap size={18} color="#7B8FF5" />, title: 'AI-Powered', desc: 'Gemini AI reads the financials and writes the analysis, so you get context not just ratios.' },
            { icon: <BarChart2 size={18} color="#E5544D" />, title: 'No Price Targets', desc: 'We never predict stock prices. We assess fundamentals and direction instead.' },
          ].map(w => (
            <div key={w.title} style={styles.whyCard}>
              <div style={{ marginBottom: 12 }}>{w.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, fontFamily: "'Fraunces', serif" }}>{w.title}</div>
              <div style={{ color: '#948F7D', fontSize: 13, lineHeight: 1.6 }}>{w.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={styles.divider} />

      {/* CTA */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaBox}>
          <div style={styles.kicker} style={{ justifyContent: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F2C230', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 16, height: 1, background: '#C99A0F', display: 'inline-block' }} />
            Start Now — Free
          </div>
          <h2 style={{ ...styles.sectionTitle, fontSize: 32 }}>
            Your next investment<br />decision starts here.
          </h2>
          <p style={{ color: '#948F7D', fontSize: 15, marginTop: 12, lineHeight: 1.6 }}>
            Search any company. Get the verdict in seconds.
          </p>
          <button
            style={styles.ctaBtn}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            Start Research <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ ...styles.logoMark, width: 22, height: 22, fontSize: 11, borderRadius: 6 }}>A</div>
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: '#F3F1E7' }}>Aurex</span>
        </div>
        <p>Data: Yahoo Finance &nbsp;·&nbsp; AI: Google Gemini &nbsp;·&nbsp; Aurex © 2024</p>
      </footer>
    </div>
  )
}

export default LandingPage
