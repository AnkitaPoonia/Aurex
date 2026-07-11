import 'dotenv/config';
export const GEMINI_MODELS = [
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
  ];
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
export const HAS_GEMINI_KEY = !!(
  GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here'
);
export const YF_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
};
export const YF_TIMEOUT = 30000; // ms
export const PROXY_IP   = process.env.WEBSHARE_PROXY_IP   || '';
export const PROXY_PORT = process.env.WEBSHARE_PROXY_PORT  || '';
export const PROXY_USER = process.env.WEBSHARE_PROXY_USER  || '';
export const PROXY_PASS = process.env.WEBSHARE_PROXY_PASS  || '';
export const HAS_PROXY  = !!(PROXY_IP && PROXY_PORT);

export const PORT = process.env.PORT || 5000;
