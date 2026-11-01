const mongoose = require("mongoose");

module.exports = mongoose.model("Notification", new mongoose.Schema({
  forRole: { type: String, enum: ["admin", "customer"], default: "admin", index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["booking", "enquiry", "payment", "review", "system"], required: true },
  title: { type: String, required: true },
  message: String,
  refId: mongoose.Schema.Types.ObjectId,
  read: { type: Boolean, default: false, index: true },
}, { timestamps: true }));
