require("dotenv").config();

const required = ["MONGO_URI", "JWT_SECRET"];
for (const k of required) if (!process.env[k]) throw new Error(`Missing required env var: ${k}`);
if (process.env.JWT_SECRET.length < 32) throw new Error("JWT_SECRET must be at least 32 characters");

module.exports = {
  port: Number(process.env.PORT) || 5000,
  isProd: process.env.NODE_ENV === "production",
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientOrigins: (process.env.CLIENT_ORIGIN || "http://localhost:3000").split(",").map((s) => s.trim()).filter(Boolean),
};
