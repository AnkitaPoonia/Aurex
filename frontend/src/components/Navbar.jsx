// ─── components/Navbar.jsx ────────────────────────────────────────────────────
// Top navigation bar shown on the Research page.
// Contains the Aurex logo and a search input with a Go button.
// ─────────────────────────────────────────────────────────────────────────────

import { useState }      from 'react';
import { useNavigate }   from 'react-router-dom';
import { Search }        from 'lucide-react';

function Navbar() {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  function handleSearch(q) {
    const trimmed = q.trim();
    if (!trimmed) return;
    navigate(`/research/${encodeURIComponent(trimmed)}`);
    setSearchInput('');
  }

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 28px',
      borderBottom: '1px solid #2C2B25',
      position: 'sticky',
      top: 0,
      zIndex: 60,
      background: 'rgba(10,10,11,0.95)',
      backdropFilter: 'blur(12px)',
      gap: 16,
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 19,
          color: '#F3F1E7', cursor: 'pointer', flexShrink: 0,
        }}
      >
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: '#F2C230', color: '#0A0A0B',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 14,
        }}>
          A
        </div>
        Aurex
      </div>

      {/* Search */}
      <div style={{
        flex: 1, maxWidth: 480,
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#141412', border: '1px solid #2C2B25',
        borderRadius: 10, padding: '6px 6px 6px 14px',
      }}>
        <Search size={15} color="#948F7D" />
        <input
          style={{
            flex: 1, border: 'none', outline: 'none',
            background: 'transparent', color: '#F3F1E7',
            fontSize: 14, fontFamily: "'Inter', sans-serif", padding: '3px 0',
          }}
          placeholder="Search by ticker e.g. HDFCBANK.NS, RELIANCE.NS..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch(searchInput)}
        />
        <button
          onClick={() => handleSearch(searchInput)}
          style={{
            background: '#F2C230', color: '#0A0A0B',
            border: 'none', padding: '6px 14px', borderRadius: 7,
            fontWeight: 700, fontSize: 12, cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Go
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
