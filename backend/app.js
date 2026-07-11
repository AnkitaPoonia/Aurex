// ─── app.js ───────────────────────────────────────────────────────────────────
// Express application setup.
// Configures middleware and mounts all routes.
// Separated from index.js so the app can be imported independently (e.g. tests).
// ─────────────────────────────────────────────────────────────────────────────

import express        from 'express';
import cors           from 'cors';
import researchRoutes from './routes/research.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

// ── Global Middleware ─────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api', researchRoutes);   // POST /api/research
app.use('/',    researchRoutes);   // GET  /health  (no /api prefix for health)

// ── Global Error Handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

export default app;
