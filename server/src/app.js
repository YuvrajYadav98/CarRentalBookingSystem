const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { clientOrigins } = require("./config/env");
const { apiLimiter } = require("./middleware/rateLimit");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
// Number of proxies in front of the API. 1 = Render only. 2 = Vercel rewrite + Render (so rate limits use the real visitor IP).
app.set("trust proxy", Number(process.env.TRUST_PROXY_HOPS) || 1);
app.use(helmet());
app.use(cors({ origin: clientOrigins, credentials: true }));
// Defence in depth against CSRF: browsers always send Origin on cross-site writes. Server-to-server calls (Razorpay webhook) send none.
app.use((req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  const origin = req.get("origin");
  return origin && !clientOrigins.includes(origin) ? res.status(403).json({ message: "Request blocked." }) : next();
});
app.use(express.json({ limit: "100kb", verify: (req, _res, buf) => { req.rawBody = buf; } })); // rawBody: needed to verify Razorpay webhooks
app.use(cookieParser());
app.use("/api", apiLimiter);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
const catalog = require("./routes/catalogRoutes");
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/vehicles", catalog.vehicles);
app.use("/api/packages", catalog.packages);
app.use("/api/drivers", catalog.drivers);
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/enquiries", require("./routes/enquiryRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/coupons", catalog.coupons);
app.use("/api/offers", require("./routes/offerRoutes"));
app.use("/api/uploads", require("./routes/uploadRoutes"));
app.use("/api/maps", require("./routes/mapsRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));

app.use(notFound);
app.use(errorHandler);
module.exports = app;
