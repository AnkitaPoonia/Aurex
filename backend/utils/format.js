// ─── utils/format.js ──────────────────────────────────────────────────────────
// Pure formatting helpers used by services and controllers.
// No side effects, no imports required.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format a number to fixed decimal places.
 * Returns 'N/A' for null/undefined/NaN values.
 */
export function fmt(val, digits = 2) {
  if (val === null || val === undefined) return 'N/A';
  return isNaN(val) ? 'N/A' : parseFloat(val).toFixed(digits);
}

/**
 * Format a decimal ratio as a percentage string.
 * e.g. 0.1234 → "12.3"
 * Returns 'N/A' for null/undefined/NaN values.
 */
export function pct(val, digits = 1) {
  if (val === null || val === undefined) return 'N/A';
  return isNaN(val) ? 'N/A' : (parseFloat(val) * 100).toFixed(digits);
}

/**
 * Safely parse a value as a number.
 * Returns 0 for NaN values.
 */
export function safeNum(val) {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}
