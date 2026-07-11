// ─── components/LoadingState.jsx ──────────────────────────────────────────────
// Animated loading screen shown while research data is being fetched.
// ─────────────────────────────────────────────────────────────────────────────

import { LOADING_STEPS } from '../utils/constants.js';

/**
 * @param {number} loadingStep  Index of the currently active loading step
 */
function LoadingState({ loadingStep }) {
  return (
    <div style={{
      maxWidth: 600, margin: '0 auto', padding: '80px 24px', textAlign: 'center',
    }}>
      <div style={{ marginBottom: 24 }}>
        <span className="loading-dot" />
        <span className="loading-dot" />
        <span className="loading-dot" />
      </div>

      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        color: '#948F7D', fontSize: 13, marginBottom: 32,
      }}>
        {LOADING_STEPS[loadingStep]}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
        {LOADING_STEPS.map((step, i) => (
          <div
            key={step}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              borderRadius: 8,
              background: i <= loadingStep ? '#141412' : 'transparent',
              border:     i <= loadingStep ? '1px solid #2C2B25' : '1px solid transparent',
              transition: 'all 0.3s',
            }}
          >
            <div style={{
              width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
              background:
                i < loadingStep  ? '#3FBE72' :
                i === loadingStep ? '#F2C230' :
                '#2C2B25',
              transition: 'background 0.3s',
            }} />
            <span style={{
              fontSize: 12.5,
              color: i <= loadingStep ? '#F3F1E7' : '#2C2B25',
              fontFamily: "'IBM Plex Mono', monospace",
            }}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoadingState;
