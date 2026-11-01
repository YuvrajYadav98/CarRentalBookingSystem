const router = require("express").Router();
const Booking = require("../models/Booking");
const User = require("../models/User");
const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { protect, restrictTo } = require("../middleware/auth");

router.use(protect, restrictTo("admin"));

// Revenue = sum of fare totals of COMPLETED bookings (not estimates of open ones).
router.get("/stats", asyncHandler(async (_req, res) => {
  const [byStatus, customers, revenue] = await Promise.all([
    Booking.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    User.countDocuments({ role: "customer" }),
    Booking.aggregate([{ $match: { status: "completed" } }, { $group: { _id: null, total: { $sum: "$fare.total" } } }]),
  ]);
  const counts = Object.fromEntries(byStatus.map((s) => [s._id, s.count]));
  res.json({ total: byStatus.reduce((n, s) => n + s.count, 0), counts, customers, revenue: revenue[0]?.total || 0 });
}));

router.get("/customers", asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1), limit = 20;
  const filter = { role: "customer" };
  if (req.query.q) {
    const q = new RegExp(String(req.query.q).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: q }, { email: q }, { mobile: q }];
  }
  const [users, total] = await Promise.all([User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), User.countDocuments(filter)]);
  const counts = await Booking.aggregate([{ $match: { user: { $in: users.map((u) => u._id) } } }, { $group: { _id: "$user", n: { $sum: 1 } } }]);
  const map = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));
  res.json({ customers: users.map(({ password, ...u }) => ({ ...u, bookingCount: map[String(u._id)] || 0 })), total, page, limit });
}));

router.get("/customers/:id/bookings", asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, role: "customer" });
  if (!user) throw new ApiError(404, "Customer not found.");
  res.json({ bookings: await Booking.find({ user: user._id }).sort({ createdAt: -1 }).limit(100).populate("vehicle", "name").lean() });
}));

router.get("/notifications", asyncHandler(async (_req, res) => {
  const [items, unread] = await Promise.all([Notification.find({ forRole: "admin" }).sort({ createdAt: -1 }).limit(15).lean(), Notification.countDocuments({ forRole: "admin", read: false })]);
  res.json({ notifications: items, unread });
}));
router.patch("/notifications/read", asyncHandler(async (_req, res) => { await Notification.updateMany({ forRole: "admin", read: false }, { read: true }); res.json({ message: "Marked as read." }); }));

module.exports = router;
