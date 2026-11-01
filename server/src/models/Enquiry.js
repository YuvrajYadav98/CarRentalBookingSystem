const mongoose = require("mongoose");

module.exports = mongoose.model("Enquiry", new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  mobile: { type: String, required: true, match: /^[6-9]\d{9}$/ },
  email: { type: String, trim: true, lowercase: true },
  message: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
  status: { type: String, enum: ["new", "in_progress", "resolved"], default: "new", index: true },
  adminNote: { type: String, maxlength: 1000 },
}, { timestamps: true }));
