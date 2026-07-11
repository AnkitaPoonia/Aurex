// ─── services/api.js ─────────────────────────────────────────────────────────
// Centralised API layer.  All HTTP calls to the backend originate here so that
// the URL and request shape are defined in one place.
// ─────────────────────────────────────────────────────────────────────────────

import axios    from 'axios';
import { API_BASE } from '../utils/constants.js';

/**
 * Fetch full research data for a company query.
 *
 * @param {string} query  Company name or ticker entered by the user
 * @returns {Promise<object>} Parsed research data from the backend
 * @throws  {Error}           With message from the server or a generic fallback
 */
export async function fetchCompanyResearch(query) {
  const response = await axios.post(`${API_BASE}/api/research`, { query });
  return response.data;
}
