const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const { estimateLimiter } = require("../middleware/rateLimit");
const { autocomplete } = require("../services/mapsService");

router.get("/autocomplete", estimateLimiter, asyncHandler(async (req, res) => {
  const q = String(req.query.q || "").trim().slice(0, 100);
  res.json({ suggestions: q.length >= 3 ? await autocomplete(q) : [] });
}));
module.exports = router;
