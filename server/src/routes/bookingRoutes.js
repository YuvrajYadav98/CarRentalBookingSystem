const router = require("express").Router();
const c = require("../controllers/bookingController");
const validate = require("../middleware/validate");
const { protect, restrictTo, optionalAuth } = require("../middleware/auth");
const { authLimiter, estimateLimiter } = require("../middleware/rateLimit");
const { estimateSchema, bookingSchema, statusSchema, adminUpdateSchema } = require("../validators/booking");

router.post("/estimate", estimateLimiter, validate(estimateSchema), c.estimate);
router.get("/track", authLimiter, c.track); // guests: booking ref + mobile
router.post("/", estimateLimiter, optionalAuth, validate(bookingSchema), c.create); // guests and customers; admins use it to create bookings
router.get("/", protect, c.list);
router.get("/:id", protect, c.getOne);
router.get("/:id/invoice", protect, c.invoice);
router.patch("/:id/status", protect, validate(statusSchema), c.setStatus);
router.put("/:id", protect, restrictTo("admin"), validate(adminUpdateSchema), c.update);
router.delete("/:id", protect, restrictTo("admin"), c.remove);

module.exports = router;
