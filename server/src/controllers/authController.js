const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { jwtSecret, jwtExpiresIn, isProd } = require("../config/env");

const cookieOpts = { httpOnly: true, secure: isProd, sameSite: "lax", path: "/", maxAge: 7 * 24 * 60 * 60 * 1000 };

function sendAuth(res, user, status = 200) {
  const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn });
  res.cookie("token", token, cookieOpts).status(status).json({ user });
}

exports.register = asyncHandler(async (req, res) => {
  const { name, email, mobile, password } = req.body;
  if (await User.exists({ email })) throw new ApiError(409, "An account with this email already exists.");
  // role is never taken from the request: public sign-up always creates a customer
  const user = await User.create({ name, email, mobile, password, role: "customer" });
  sendAuth(res, user, 201);
});

exports.login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select("+password");
  if (!user || !(await user.comparePassword(req.body.password))) throw new ApiError(401, "Invalid email or password.");
  if (!user.isActive) throw new ApiError(403, "This account has been disabled. Please contact support.");
  sendAuth(res, user);
});

exports.logout = (_req, res) => {
  res.clearCookie("token", { ...cookieOpts, maxAge: undefined }).json({ message: "Logged out." });
};

exports.me = (req, res) => res.json({ user: req.user });

exports.updateMe = asyncHandler(async (req, res) => {
  Object.assign(req.user, req.body);
  await req.user.save();
  res.json({ user: req.user });
});
