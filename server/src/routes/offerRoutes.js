const router = require("express").Router();
const Coupon = require("../models/Coupon");
const asyncHandler = require("../utils/asyncHandler");

// Only coupons the admin chose to publish. Private coupon codes are never listed.
router.get("/", asyncHandler(async (_req, res) => {
  const offers = await Coupon.find({ active: true, showOnWebsite: true, $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }] })
    .select("code type value minAmount maxDiscount expiresAt -_id").sort({ createdAt: -1 }).lean();
  res.set("Cache-Control", "public, max-age=60").json({ offers });
}));
module.exports = router;
