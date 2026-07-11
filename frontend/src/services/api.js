import axios from 'axios';
import { API_BASE } from '../utils/constants.js';

export async function fetchCompanyResearch(query) {
  const response = await axios.post(`${API_BASE}/api/research`, { query });
  return response.data;
}
