const crypto = require("crypto");
const Razorpay = require("razorpay");
const ApiError = require("../utils/ApiError");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const User = require("../models/User");
const Settings = require("../models/Settings");
const email = require("./emailService");

const isConfigured = () => !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
const hmac = (secret, data) => crypto.createHmac("sha256", secret).update(data).digest("hex");
const safeEqual = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };

// Razorpay Checkout signature: HMAC_SHA256(order_id + "|" + payment_id, key_secret)
const verifySignature = (orderId, paymentId, signature, secret = process.env.RAZORPAY_KEY_SECRET) => !!secret && safeEqual(hmac(secret, `${orderId}|${paymentId}`), signature);
const verifyWebhook = (rawBody, signature, secret = process.env.RAZORPAY_WEBHOOK_SECRET) => !!secret && !!rawBody && safeEqual(hmac(secret, rawBody), signature);

async function paidTotal(bookingId) {
  const r = await Payment.aggregate([{ $match: { booking: bookingId, status: "paid" } }, { $group: { _id: null, t: { $sum: "$amount" } } }]);
  return r[0]?.t || 0;
}

/** The amount is always computed here from the saved fare; the client never sends it. */
async function createOrder(booking, mode) {
  if (!isConfigured()) throw new ApiError(503, "Online payment is not available right now. Please pay the driver or contact us.");
  if (booking.status === "cancelled") throw new ApiError(409, "This booking was cancelled.");
  const total = booking.fare?.total || 0, paid = await paidTotal(booking._id), due = total - paid;
  if (due <= 0) throw new ApiError(409, "This booking is already paid.");
  let amount = due;
  if (mode === "advance") {
    const pct = (await Settings.get()).pricing?.advancePercent || 0;
    if (!pct) throw new ApiError(422, "Advance payment is not offered. Please pay the full amount.");
    if (paid > 0) throw new ApiError(422, "An advance has already been paid. Pay the remaining amount instead.");
    amount = Math.min(due, Math.ceil((total * pct) / 100));
  }
  if (amount < 1) throw new ApiError(422, "Nothing to pay for this booking.");
  const order = await new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
    .orders.create({ amount: amount * 100, currency: "INR", receipt: booking.ref, notes: { bookingRef: booking.ref } });
  await Payment.create({ booking: booking._id, user: booking.user, amount, razorpayOrderId: order.id, status: "created" });
  return { orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID };
}

/** Idempotent: the atomic update only succeeds once, so verify + webhook can both call it safely. */
async function markPaid(orderId, razorpayPaymentId) {
  const payment = await Payment.findOneAndUpdate({ razorpayOrderId: orderId, status: { $ne: "paid" } }, { status: "paid", razorpayPaymentId }, { new: true });
  const booking = await Booking.findById((payment || (await Payment.findOne({ razorpayOrderId: orderId })))?.booking);
  if (!booking) throw new ApiError(404, "Payment not found.");
  if (!payment) return booking; // already processed
  booking.paymentStatus = (await paidTotal(booking._id)) >= (booking.fare?.total || 0) ? "paid" : "partial";
  await booking.save();
  const user = booking.user && (await User.findById(booking.user).select("email"));
  email.paymentReceived({ booking, amount: payment.amount, email: user?.email });
  return booking;
}

module.exports = { isConfigured, verifySignature, verifyWebhook, createOrder, markPaid };
