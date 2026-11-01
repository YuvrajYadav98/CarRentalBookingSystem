// Creates the first admin from env vars. Run once: npm run seed:admin
require("../config/env");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

(async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_MOBILE, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_MOBILE || !ADMIN_PASSWORD) throw new Error("Set ADMIN_EMAIL, ADMIN_MOBILE and ADMIN_PASSWORD in .env");
  await connectDB();
  if (await User.exists({ email: ADMIN_EMAIL.toLowerCase() })) console.log("Admin already exists. Nothing changed.");
  else { await User.create({ name: ADMIN_NAME || "Admin", email: ADMIN_EMAIL, mobile: ADMIN_MOBILE, password: ADMIN_PASSWORD, role: "admin" }); console.log("Admin created."); }
  await mongoose.disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });
