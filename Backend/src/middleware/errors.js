
export function notFound(req, res) { res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` }); }
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const status = err.status || (err.name === 'ValidationError' ? 400 : err.code === 11000 ? 409 : 500);
  const message = status === 500 && process.env.NODE_ENV === 'production' ? 'An unexpected server error occurred.' : err.message || 'Request failed.';
  if (status === 500) console.error(err);
  res.status(status).json({ message, ...(err.errors ? { errors: err.errors } : {}) });
}
