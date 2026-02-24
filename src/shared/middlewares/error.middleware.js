function errorMiddleware(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  const message = err.message || "Internal server error";

  return res.status(status).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
}

module.exports = errorMiddleware;