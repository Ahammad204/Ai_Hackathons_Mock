/**
 * Centralized Express error-handling middleware.
 * Catches all unhandled errors, logs them, and sends a structured response.
 */
export function errorHandler(err, req, res, _next) {
  const timestamp = new Date().toISOString();

  // Log the error (in production, use a proper logger)
  console.error(`[${timestamp}] ERROR: ${err.message}`);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: true,
    message:
      statusCode === 500 ? "Internal server error" : err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}

/**
 * Create an HTTP error with a status code.
 */
export function createError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}
