// ─── components/TabBar.jsx ────────────────────────────────────────────────────
// Sticky horizontal tab navigation bar for the Research page.
// ─────────────────────────────────────────────────────────────────────────────

import { TABS, VERDICT_COLORS } from '../utils/constants.js';

/**
 * @param {number}   activeTab    Index of the currently selected tab
 * @param {Function} onTabChange  Callback when a tab button is clicked
 * @param {string}   verdict      AI verdict string ('INVEST' | 'WAIT' | 'SKIP')
 */
function TabBar({ activeTab, onTabChange, verdict }) {
  const accentColor = VERDICT_COLORS[verdict] || VERDICT_COLORS.WAIT;

  return (
    <div style={{
      position: 'sticky', top: 57, zIndex: 50,
      background: '#0A0A0B', borderBottom: '1px solid #2C2B25',
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'flex', gap: 4, overflowX: 'auto',
      }}>
        {TABS.map((tab, idx) => (
          <button
            key={tab}
            id={`tab-${tab.toLowerCase().replace(/ /g, '-')}`}
            onClick={() => onTabChange(idx)}
            style={{
              padding: '13px 18px',
              border: 'none',
              borderBottom:
                activeTab === idx
                  ? `2px solid ${accentColor}`
                  : '2px solid transparent',
              background: 'transparent',
              color: activeTab === idx ? '#F3F1E7' : '#948F7D',
              fontWeight: activeTab === idx ? 700 : 500,
              fontSize: 13.5,
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
              whiteSpace: 'nowrap',
              transition: 'color 0.2s, border-color 0.2s',
              flexShrink: 0,
            }}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TabBar;
