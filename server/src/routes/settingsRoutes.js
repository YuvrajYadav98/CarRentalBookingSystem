const router = require("express").Router();
const Settings = require("../models/Settings");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");
const { protect, restrictTo } = require("../middleware/auth");
const { settings } = require("../validators/resources");

// Public: company details only. Pricing is never exposed here (the fare engine reads it server-side).
router.get("/public", asyncHandler(async (_req, res) => { const s = await Settings.get(); res.set("Cache-Control", "public, max-age=60"); res.json({ company: s.company, gallery: s.gallery }); }));

router.get("/", protect, restrictTo("admin"), asyncHandler(async (_req, res) => res.json({ settings: await Settings.get() })));
router.put("/", protect, restrictTo("admin"), validate(settings), asyncHandler(async (req, res) => {
  const s = await Settings.get();
  for (const k of ["company", "pricing"]) if (req.body[k]) s.set(k, { ...s.get(k)?.toObject?.(), ...req.body[k] });
  if (req.body.gallery) s.gallery = req.body.gallery;
  await s.save();
  res.json({ settings: s });
}));

module.exports = router;
