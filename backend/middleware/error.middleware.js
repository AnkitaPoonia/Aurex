// ─── middleware/error.middleware.js ───────────────────────────────────────────
// Global Express error handler.
// Must have 4 parameters (err, req, res, next) to be treated as error middleware.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Express global error handler.
 * Catches any error passed via next(err) or thrown inside async handlers.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status  = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${req.method} ${req.path} → ${status}: ${message}`);

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
}
