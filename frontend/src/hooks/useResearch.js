// ─── hooks/useResearch.js ─────────────────────────────────────────────────────
// Custom hook that manages research data fetching, loading, and error state.
// Extracted from Research.jsx (was Dashboard.jsx) to keep the page component lean.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect }        from 'react';
import { fetchCompanyResearch }        from '../services/api.js';
import { LOADING_STEPS }               from '../utils/constants.js';

/**
 * Fetch and manage research data for a given decoded query string.
 *
 * @param {string} query  Decoded company name or ticker (from URL param)
 * @returns {{
 *   data: object|null,
 *   loading: boolean,
 *   error: string,
 *   loadingStep: number
 * }}
 */
export function useResearch(query) {
  const [data,        setData]        = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

  // Advance the loading step indicator while fetching
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingStep(prev =>
        prev < LOADING_STEPS.length - 1 ? prev + 1 : prev
      );
    }, 1800);
    return () => clearInterval(interval);
  }, [loading]);

  // Re-fetch whenever the query changes
  useEffect(() => {
    if (!query) return;

    setData(null);
    setError('');
    setLoading(true);
    setLoadingStep(0);

    fetchCompanyResearch(query)
      .then(setData)
      .catch(err =>
        setError(
          err.response?.data?.error ||
          'Failed to fetch data. Please try again.'
        )
      )
      .finally(() => setLoading(false));
  }, [query]);

  return { data, loading, error, loadingStep };
}
