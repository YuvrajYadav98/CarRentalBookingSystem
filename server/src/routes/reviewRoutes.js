const router = require("express").Router();
const Review = require("../models/Review");
const Notification = require("../models/Notification");
const Booking = require("../models/Booking");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const validate = require("../middleware/validate");
const { protect, restrictTo, optionalAuth } = require("../middleware/auth");
const { review } = require("../validators/resources");

// Public: approved reviews only. Admin: ?all=true includes pending ones.
router.get("/", optionalAuth, asyncHandler(async (req, res) => {
  const filter = req.user?.role === "admin" && req.query.all === "true" ? {} : { approved: true };
  res.json({ reviews: await Review.find(filter).sort({ createdAt: -1 }).limit(100).lean() });
}));

// Logged-in customers only (keeps reviews genuine); starts unapproved.
router.post("/", protect, validate(review), asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.body.booking, user: req.user._id });
  if (!booking) throw new ApiError(404, "Booking not found.");
  if (booking.status !== "completed") throw new ApiError(422, "You can review a trip after it is completed.");
  if (await Review.exists({ booking: booking._id })) throw new ApiError(409, "You have already reviewed this trip.");
  const doc = await Review.create({ ...req.body, user: req.user._id, name: req.user.name, approved: false });
  await Notification.create({ type: "review", title: "New review awaiting approval", message: `${req.user.name} left a ${doc.rating}-star review.`, refId: doc._id });
  res.status(201).json({ review: doc, message: "Thanks! Your review will appear after approval." });
}));

router.patch("/:id/approve", protect, restrictTo("admin"), asyncHandler(async (req, res) => {
  const doc = await Review.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
  if (!doc) throw new ApiError(404, "Review not found.");
  res.json({ review: doc });
}));
router.delete("/:id", protect, restrictTo("admin"), asyncHandler(async (req, res) => {
  if (!(await Review.findByIdAndDelete(req.params.id))) throw new ApiError(404, "Review not found.");
  res.json({ message: "Review deleted." });
}));

module.exports = router;
