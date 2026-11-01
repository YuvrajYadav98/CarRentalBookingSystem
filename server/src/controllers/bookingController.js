const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Driver = require("../models/Driver");
const Coupon = require("../models/Coupon");
const Notification = require("../models/Notification");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const Settings = require("../models/Settings");
const User = require("../models/User");
const email = require("../services/emailService");
const { computeQuote, FARE_NOTES } = require("../services/fareService");
const { buildInvoice } = require("../services/invoiceService");

const TRANSITIONS = {
  pending: ["confirmed", "cancelled"], confirmed: ["driver_assigned", "cancelled"],
  driver_assigned: ["in_progress", "cancelled"], in_progress: ["completed"], completed: [], cancelled: [],
};
const byKey = (k) => (mongoose.isValidObjectId(k) ? { _id: k } : { ref: String(k).toUpperCase() });
const isOwnerOrAdmin = (req, b) => req.user.role === "admin" || String(b.user) === String(req.user._id);
const publicView = (b) => ({ ref: b.ref, status: b.status, tripType: b.tripType, pickup: b.pickup, drop: b.drop, pickupAt: b.pickupAt, returnDate: b.returnDate, passengers: b.passengers, fare: b.fare, paymentStatus: b.paymentStatus, vehicle: b.vehicle?.name, createdAt: b.createdAt });

exports.estimate = asyncHandler(async (req, res) => {
  const q = await computeQuote(req.body);
  res.json({ total: q.fare.total, fare: q.fare, distanceKm: q.distanceKm, notes: FARE_NOTES });
});

exports.create = asyncHandler(async (req, res) => {
  const d = req.body;
  const q = await computeQuote(d); // fare is always recomputed here; the client's number is never trusted
  const booking = await Booking.create({
    user: req.user?.role === "admin" ? undefined : req.user?._id, customerName: d.name, customerMobile: d.mobile, tripType: d.tripType, pickup: d.pickup, drop: d.drop,
    pickupAt: new Date(`${d.date}T${d.time}:00+05:30`), returnDate: d.returnDate && new Date(`${d.returnDate}T00:00:00+05:30`),
    passengers: d.passengers, vehicle: q.vehicle._id, package: q.pkg?._id, distanceKm: q.distanceKm, fare: q.fare, coupon: q.coupon?.code, notes: d.notes,
  });
  if (q.coupon) await Coupon.updateOne({ _id: q.coupon._id }, { $inc: { usedCount: 1 } });
  await Notification.create({ type: "booking", title: "New booking request", message: `${booking.ref}: ${d.name}, ${d.pickup}${d.drop ? " to " + d.drop : ""}`, refId: booking._id });
  email.bookingCreated({ booking, vehicleName: q.vehicle.name, customerEmail: req.user?.role === "customer" ? req.user.email : undefined });
  res.status(201).json({ booking: { ...publicView({ ...booking.toObject(), vehicle: q.vehicle }), notes: FARE_NOTES } });
});

exports.list = asyncHandler(async (req, res) => {
  const admin = req.user.role === "admin";
  const filter = admin ? {} : { user: req.user._id };
  if (req.query.status) filter.status = String(req.query.status);
  if (admin && req.query.q) {
    const q = String(req.query.q).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [{ ref: new RegExp(q, "i") }, { customerMobile: new RegExp(q) }, { customerName: new RegExp(q, "i") }];
  }
  const page = Math.max(1, Number(req.query.page) || 1), limit = Math.min(100, Number(req.query.limit) || 20);
  const [bookings, total] = await Promise.all([
    Booking.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate("vehicle", "name").populate("driver", "name mobile").lean(),
    Booking.countDocuments(filter),
  ]);
  res.json({ bookings, total, page });
});

exports.track = asyncHandler(async (req, res) => {
  const b = await Booking.findOne({ ref: String(req.query.ref || "").toUpperCase(), customerMobile: String(req.query.mobile || "").replace(/\D/g, "").slice(-10) }).populate("vehicle", "name");
  if (!b) throw new ApiError(404, "No booking found for these details.");
  res.json({ booking: publicView(b) });
});

exports.getOne = asyncHandler(async (req, res) => {
  const b = await Booking.findOne(byKey(req.params.id)).populate("vehicle", "name").populate("driver", "name mobile");
  if (!b || !isOwnerOrAdmin(req, b)) throw new ApiError(404, "Booking not found.");
  res.json({ booking: b });
});

exports.update = asyncHandler(async (req, res) => {
  const b = await Booking.findOneAndUpdate(byKey(req.params.id), req.body, { new: true, runValidators: true });
  if (!b) throw new ApiError(404, "Booking not found.");
  res.json({ booking: b });
});

exports.setStatus = asyncHandler(async (req, res) => {
  const b = await Booking.findOne(byKey(req.params.id));
  if (!b || !isOwnerOrAdmin(req, b)) throw new ApiError(404, "Booking not found.");
  const { status, driver } = req.body;
  const admin = req.user.role === "admin";
  if (!admin && !(status === "cancelled" && ["pending", "confirmed"].includes(b.status))) throw new ApiError(403, "You can only cancel a booking that has not started.");
  if (!TRANSITIONS[b.status].includes(status)) throw new ApiError(409, `A ${b.status.replace("_", " ")} booking cannot be changed to ${status.replace("_", " ")}.`);

  if (status === "driver_assigned") {
    const dr = driver && (await Driver.findOne({ _id: driver, isActive: true, available: true }));
    if (!dr) throw new ApiError(422, "Select an available driver.");
    b.driver = dr._id;
    await Driver.updateOne({ _id: dr._id }, { available: false });
  }
  if (["completed", "cancelled"].includes(status) && b.driver) await Driver.updateOne({ _id: b.driver }, { available: true });
  b.status = status;
  await b.save();
  const u = b.user && (await User.findById(b.user).select("email"));
  email.statusChanged({ booking: b, email: u?.email });
  res.json({ booking: b });
});

exports.remove = asyncHandler(async (req, res) => {
  const b = await Booking.findOneAndDelete(byKey(req.params.id));
  if (!b) throw new ApiError(404, "Booking not found.");
  if (b.driver && !["completed", "cancelled"].includes(b.status)) await Driver.updateOne({ _id: b.driver }, { available: true });
  res.json({ message: "Booking deleted." });
});

exports.invoice = asyncHandler(async (req, res) => {
  const b = await Booking.findOne(byKey(req.params.id)).populate("vehicle", "name");
  if (!b || !isOwnerOrAdmin(req, b)) throw new ApiError(404, "Booking not found.");
  if (b.status !== "completed") throw new ApiError(409, "The invoice is available once the trip is completed.");
  const { company } = await Settings.get();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="invoice-${b.ref}.pdf"`);
  buildInvoice({ booking: b, company }).pipe(res);
});
