const mongoose = require("mongoose");
const crypto = require("crypto");

const STATUSES = ["pending", "confirmed", "driver_assigned", "in_progress", "completed", "cancelled"];

const schema = new mongoose.Schema({
  ref: { type: String, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true }, // optional: guests can book
  customerName: { type: String, required: true, trim: true },
  customerMobile: { type: String, required: true, match: /^[6-9]\d{9}$/, index: true },
  tripType: { type: String, required: true, enum: ["one-way", "round-trip", "local", "airport", "outstation"] },
  pickup: { type: String, required: true, trim: true },
  drop: { type: String, trim: true },
  pickupAt: { type: Date, required: true, index: true },
  returnDate: Date,
  passengers: { type: Number, required: true, min: 1, max: 60 },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
  distanceKm: Number,
  // Fare breakdown is copied at booking time so later price edits never change old bookings/invoices.
  fare: { base: Number, driverAllowance: Number, nightCharge: Number, tolls: Number, parking: Number, discount: Number, total: Number },
  coupon: String,
  status: { type: String, enum: STATUSES, default: "pending", index: true },
  paymentStatus: { type: String, enum: ["unpaid", "partial", "paid", "refunded"], default: "unpaid" },
  notes: { type: String, maxlength: 500 },
}, { timestamps: true });
schema.index({ user: 1, createdAt: -1 });
schema.index({ status: 1, createdAt: -1 });

schema.pre("validate", function (next) {
  if (!this.ref) this.ref = `BK${new Date().toISOString().slice(2, 10).replace(/-/g, "")}${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  next();
});
schema.statics.STATUSES = STATUSES;
module.exports = mongoose.model("Booking", schema);
