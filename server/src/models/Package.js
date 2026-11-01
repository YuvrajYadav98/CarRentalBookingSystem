const mongoose = require("mongoose");
const { slugPlugin } = require("../utils/slug");

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  slug: { type: String, unique: true, index: true },
  image: { type: String, trim: true },
  imagePublicId: String,
  description: { type: String, trim: true, maxlength: 1000 },
  price: { type: Number, required: true, min: 0 }, // starting price
  distance: { type: Number, min: 0 },
  travelTime: String,
  duration: String,
  vehicleOptions: [String],
  included: [String],
  excluded: [String],
  isActive: { type: Boolean, default: true, index: true },
  isDemo: { type: Boolean, default: false },
}, { timestamps: true });
schema.plugin(slugPlugin);
module.exports = mongoose.model("Package", schema);
