const router = require("express").Router();
const c = require("../controllers/authController");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimit");
const { registerSchema, loginSchema, updateMeSchema } = require("../validators/auth");

router.post("/register", authLimiter, validate(registerSchema), c.register);
router.post("/login", authLimiter, validate(loginSchema), c.login);
router.post("/logout", c.logout);
router.get("/me", protect, c.me);
router.put("/me", protect, validate(updateMeSchema), c.updateMe);

module.exports = router;
