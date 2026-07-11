# Aurex (FinChatBot)

Stocks analysis AI based project that provides in-depth financial analysis using data from Yahoo Finance, analyzed with LangChain and Google Gemini.

## Project Structure

- `frontend/` - React frontend (Vite)
- `backend/` - Node.js / Express backend

## Environment Variables

### Backend (`backend/.env`)
- `PORT` - Server port (default 5000)
- `GEMINI_API_KEY` - Google Gemini API Key
- `WEBSHARE_PROXY_IP` - Webshare proxy IP for Yahoo Finance
- `WEBSHARE_PROXY_PORT` - Webshare proxy port
- `WEBSHARE_PROXY_USER` - Webshare proxy username
- `WEBSHARE_PROXY_PASS` - Webshare proxy password

## Running Locally

1. Install dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. Start the backend:
   ```bash
   cd backend && npm run dev
   ```

3. Start the frontend:
   ```bash
   cd frontend && npm run dev
   ```

## Deployment

### Render (Backend)
- Build Command: `npm install`
- Start Command: `npm start`
- Ensure all environment variables are set.

### Vercel (Frontend)
- Build Command: `npm run build`
- Output Directory: `dist`
