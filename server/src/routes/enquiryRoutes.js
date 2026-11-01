const router = require("express").Router();
const Enquiry = require("../models/Enquiry");
const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const validate = require("../middleware/validate");
const { protect, restrictTo } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimit");
const { enquiry, enquiryUpdate } = require("../validators/resources");

router.post("/", authLimiter, validate(enquiry), asyncHandler(async (req, res) => {
  const doc = await Enquiry.create(req.body);
  await Notification.create({ type: "enquiry", title: "New enquiry", message: `${doc.name} (${doc.mobile})`, refId: doc._id });
  res.status(201).json({ message: "Enquiry received." });
}));

router.use(protect, restrictTo("admin"));
router.get("/", asyncHandler(async (req, res) => {
  const filter = req.query.status ? { status: String(req.query.status) } : {};
  res.json({ enquiries: await Enquiry.find(filter).sort({ createdAt: -1 }).limit(200).lean() });
}));
router.patch("/:id", validate(enquiryUpdate), asyncHandler(async (req, res) => {
  const doc = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doc) throw new ApiError(404, "Enquiry not found.");
  res.json({ enquiry: doc });
}));

module.exports = router;
