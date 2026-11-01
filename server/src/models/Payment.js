const mongoose = require("mongoose");

module.exports = mongoose.model("Payment", new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  amount: { type: Number, required: true, min: 0 }, // rupees
  currency: { type: String, default: "INR" },
  razorpayOrderId: { type: String, index: true },
  razorpayPaymentId: String,
  status: { type: String, enum: ["created", "paid", "failed", "refunded"], default: "created" },
}, { timestamps: true }));
