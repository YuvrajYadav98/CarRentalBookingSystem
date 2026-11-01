const mongoose = require("mongoose");
const { slugPlugin } = require("../utils/slug");

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  slug: { type: String, unique: true, index: true },
  image: { type: String, trim: true },
  imagePublicId: String, // Cloudinary id (Phase 7 upload)
  description: { type: String, trim: true, maxlength: 600 },
  seats: { type: Number, required: true, min: 1, max: 60 },
  luggage: { type: Number, min: 0 },
  ac: { type: Boolean, default: true },
  pricePerKm: { type: Number, required: true, min: 0 },
  available: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true, index: true },
  isDemo: { type: Boolean, default: false },
}, { timestamps: true });
schema.plugin(slugPlugin);
module.exports = mongoose.model("Vehicle", schema);
