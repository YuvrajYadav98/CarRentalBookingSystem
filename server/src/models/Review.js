const mongoose = require("mongoose");

module.exports = mongoose.model("Review", new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  name: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true, minlength: 5, maxlength: 500 },
  approved: { type: Boolean, default: false, index: true }, // only approved reviews are public
}, { timestamps: true }));
