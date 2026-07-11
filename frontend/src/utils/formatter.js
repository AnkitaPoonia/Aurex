// ─── utils/formatter.js ───────────────────────────────────────────────────────
// Shared number formatting utility used by PastTab and PresentTab.
// Extracted to eliminate duplication (was copy-pasted in both components).
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format a large number with appropriate suffix and optional currency symbol.
 * Returns 'N/A' for null/undefined/NaN values.
 *
 * Examples:
 *   formatNum(1_500_000_000, 'USD')  → '$1.50B'
 *   formatNum(25_000_000, 'INR')     → '₹2.50Cr'
 *   formatNum('N/A')                 → 'N/A'
 *
 * @param {number|string|null} val       Value to format
 * @param {string}             [currency] ISO currency code ('INR' | 'USD' | other)
 * @returns {string}
 */
export function formatNum(val, currency) {
  if (val === null || val === undefined || val === 'N/A') return 'N/A';
  const num = parseFloat(val);
  if (isNaN(num)) return val;

  const symbol =
    currency === 'INR' ? '₹' :
    currency === 'USD' ? '$' :
    '';

  if (Math.abs(num) >= 1e12) return `${symbol}${(num / 1e12).toFixed(2)}T`;
  if (Math.abs(num) >= 1e9)  return `${symbol}${(num / 1e9).toFixed(2)}B`;
  if (Math.abs(num) >= 1e7)  return `${symbol}${(num / 1e7).toFixed(2)}Cr`;   // Indian crore
  if (Math.abs(num) >= 1e6)  return `${symbol}${(num / 1e6).toFixed(2)}M`;

  return String(val);
}
