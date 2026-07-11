// ─── routes/research.routes.js ────────────────────────────────────────────────
// Route definitions for the research feature.
// Routes only: no business logic, no validation beyond what Express provides.
// ─────────────────────────────────────────────────────────────────────────────

import { Router }                              from 'express';
import { researchController, healthController } from '../controllers/research.controller.js';
import { searchController } from '../controllers/search.controller.js';

const router = Router();

// POST /api/research — main company research endpoint
router.post('/research', researchController);

// GET /api/search — search endpoint
router.get('/search', searchController);

// GET /health — server health check
router.get('/health', healthController);

export default router;
