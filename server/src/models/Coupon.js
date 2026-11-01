const mongoose = require("mongoose");

module.exports = mongoose.model("Coupon", new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ["percent", "flat"], required: true },
  value: { type: Number, required: true, min: 0 },
  minAmount: { type: Number, default: 0 },
  maxDiscount: Number,
  expiresAt: Date,
  usageLimit: Number,
  usedCount: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  showOnWebsite: { type: Boolean, default: false }, // listed on the public Offers page
}, { timestamps: true }));
