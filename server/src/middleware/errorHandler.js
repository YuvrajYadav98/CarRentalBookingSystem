const { isProd } = require("../config/env");

exports.notFound = (req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, _req, res, _next) => {
  let status = err.status || 500;
  let message = err.isOperational ? err.message : "Something went wrong. Please try again.";

  if (err.name === "ValidationError") { status = 400; message = Object.values(err.errors)[0].message; }
  else if (err.code === 11000) { status = 409; message = "An account with these details already exists."; }
  else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") { status = 401; message = "Your session has expired. Please log in again."; }
  else if (err.code === "LIMIT_FILE_SIZE") { status = 400; message = "Image must be under 5 MB."; }
  else if (err.type === "entity.parse.failed") { status = 400; message = "Invalid request body."; }

  if (status >= 500 && !err.isOperational) console.error(err);
  res.status(status).json({ message, ...(err.details && { details: err.details }), ...(!isProd && !err.isOperational && status >= 500 && { stack: err.stack }) });
};
