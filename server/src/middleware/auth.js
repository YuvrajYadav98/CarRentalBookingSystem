const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { jwtSecret } = require("../config/env");

exports.protect = asyncHandler(async (req, _res, next) => {
  const bearer = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : null;
  const token = req.cookies?.token || bearer;
  if (!token) throw new ApiError(401, "Please log in to continue.");
  const payload = jwt.verify(token, jwtSecret); // JWT errors handled in errorHandler
  const user = await User.findById(payload.id);
  if (!user || !user.isActive) throw new ApiError(401, "Your session is no longer valid. Please log in again.");
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => (req, _res, next) =>
  roles.includes(req.user?.role) ? next() : next(new ApiError(403, "You do not have permission to do this."));

// Attaches req.user when a valid session exists; never blocks the request.
exports.optionalAuth = async (req, _res, next) => {
  try {
    const token = req.cookies?.token;
    if (token) { const u = await User.findById(jwt.verify(token, jwtSecret).id); if (u?.isActive) req.user = u; }
  } catch { /* ignore invalid token on public routes */ }
  next();
};
