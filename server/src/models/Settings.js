const mongoose = require("mongoose");

// Single document (key "main"). Pricing fields are used by the Phase 5 fare engine; 0 = not set yet.
const schema = new mongoose.Schema({
  key: { type: String, default: "main", unique: true },
  company: {
    name: String, logo: String, phone: String, whatsapp: String, email: String, address: String,
    social: [{ label: String, url: String }],
  },
  gallery: [{ url: String, caption: String }],
  pricing: {
    minFare: { type: Number, default: 0 },
    driverAllowancePerDay: { type: Number, default: 0 },
    nightCharge: { type: Number, default: 0 },
    nightStartHour: { type: Number, default: 22 },
    nightEndHour: { type: Number, default: 6 },
    oneWayMultiplier: { type: Number, default: 1 },
    minKmPerDay: { type: Number, default: 0 },
    parkingCharge: { type: Number, default: 0 },
    advancePercent: { type: Number, default: 0, min: 0, max: 100 }, // 0 = advance payment not offered
  },
}, { timestamps: true });
schema.statics.get = async function () { return (await this.findOne({ key: "main" })) || this.create({ key: "main" }); };
module.exports = mongoose.model("Settings", schema);
