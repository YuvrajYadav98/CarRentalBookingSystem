const router = require("express").Router();
const { z } = require("zod");
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const Settings = require("../models/Settings");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");
const { protect, optionalAuth } = require("../middleware/auth");
const { estimateLimiter } = require("../middleware/rateLimit");
const pay = require("../services/paymentService");

const orderSchema = z.object({ ref: z.string().trim().min(5).max(30), mobile: z.string().trim().optional(), mode: z.enum(["full", "advance"]).default("full") });
const verifySchema = z.object({ razorpay_order_id: z.string(), razorpay_payment_id: z.string(), razorpay_signature: z.string() });

// Public, non-secret info the checkout UI needs.
router.get("/config", asyncHandler(async (_req, res) => {
  res.json({ enabled: pay.isConfigured(), keyId: pay.isConfigured() ? process.env.RAZORPAY_KEY_ID : null, advancePercent: (await Settings.get()).pricing?.advancePercent || 0 });
}));

router.post("/create-order", estimateLimiter, optionalAuth, validate(orderSchema), asyncHandler(async (req, res) => {
  const b = await Booking.findOne({ ref: req.body.ref.toUpperCase() });
  const owner = req.user && (req.user.role === "admin" || String(b?.user) === String(req.user._id));
  const guest = b && req.body.mobile && b.customerMobile === req.body.mobile.replace(/\D/g, "").slice(-10);
  if (!b || !(owner || guest)) throw new ApiError(404, "Booking not found.");
  res.status(201).json(await pay.createOrder(b, req.body.mode));
}));

router.post("/verify", estimateLimiter, validate(verifySchema), asyncHandler(async (req, res) => {
  const { razorpay_order_id: o, razorpay_payment_id: p, razorpay_signature: s } = req.body;
  if (!pay.verifySignature(o, p, s)) throw new ApiError(400, "Payment could not be verified. If money was deducted, contact us with your booking reference.");
  const booking = await pay.markPaid(o, p);
  res.json({ paymentStatus: booking.paymentStatus });
}));

// Razorpay -> server backup so a payment is recorded even if the customer closes the browser. Uses the raw body for the signature.
router.post("/webhook", asyncHandler(async (req, res) => {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) throw new ApiError(503, "Webhook not configured.");
  if (!pay.verifyWebhook(req.rawBody, req.get("x-razorpay-signature"))) throw new ApiError(400, "Invalid signature.");
  if (req.body.event === "payment.captured") {
    const e = req.body.payload?.payment?.entity;
    const payment = e && (await Payment.findOne({ razorpayOrderId: e.order_id }));
    if (payment && e.amount === payment.amount * 100) await pay.markPaid(e.order_id, e.id);
  }
  res.json({ received: true });
}));

router.get("/history", protect, asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin" && req.query.all === "true" ? {} : { user: req.user._id };
  res.json({ payments: await Payment.find({ ...filter, status: { $in: ["paid", "refunded"] } }).sort({ createdAt: -1 }).limit(100).populate("booking", "ref").lean() });
}));

module.exports = router;
