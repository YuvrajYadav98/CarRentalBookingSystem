const mongoose = require("mongoose");

module.exports = mongoose.model("Driver", new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  mobile: { type: String, required: true, match: /^[6-9]\d{9}$/, unique: true },
  licenseNumber: { type: String, trim: true },
  photo: String,
  available: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true }));
