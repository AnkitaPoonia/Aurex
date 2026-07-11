import { useNavigate } from 'react-router-dom';

function ErrorState({ message }) {
  const navigate = useNavigate();

  // Give beginner-friendly hints based on common errors
  const isNotFound = message?.toLowerCase().includes('not found');

  return (
    <div style={{
      maxWidth: 520, margin: '60px auto', padding: '36px 32px',
      textAlign: 'center', background: '#141412',
      border: '1px solid #2C2B25', borderRadius: 18,
    }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>

      <div style={{
        color: '#F3F1E7', fontWeight: 700, fontSize: 18,
        marginBottom: 10, fontFamily: "'Fraunces', serif",
      }}>
        {isNotFound ? 'Company Not Found' : 'Something Went Wrong'}
      </div>

      <div style={{ color: '#948F7D', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
        {isNotFound ? (
          <>
            We couldn't find that company. Try using the <strong style={{ color: '#F2C230' }}>stock ticker symbol</strong> instead.
            <br />
            <span style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
              Example: <code style={{ background: '#1C1C19', padding: '2px 6px', borderRadius: 4, color: '#F2C230' }}>HDFCBANK.NS</code> or <code style={{ background: '#1C1C19', padding: '2px 6px', borderRadius: 4, color: '#F2C230' }}>RELIANCE.NS</code>
            </span>
          </>
        ) : (
          message || 'Failed to fetch data. Please try again.'
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: '#F2C230', color: '#0A0A0B',
            border: 'none', padding: '10px 22px', borderRadius: 8,
            fontWeight: 700, fontSize: 13, cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Search Again
        </button>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: 'transparent', color: '#948F7D',
            border: '1px solid #2C2B25', padding: '10px 22px', borderRadius: 8,
            fontWeight: 600, fontSize: 13, cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export default ErrorState;
