/** @type {import('next').NextConfig} */
const API_ORIGIN = process.env.API_ORIGIN || "http://localhost:5000";
const isDev = process.env.NODE_ENV !== "production";

// Report-Only first: payments and third-party scripts can break under a strict CSP.
// Test a full booking + Razorpay payment, check the browser console for violations, then rename the header
// to "Content-Security-Policy" to enforce it.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://checkout.razorpay.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com",
  "frame-src https://api.razorpay.com https://checkout.razorpay.com",
  "form-action 'self'", "base-uri 'self'", "frame-ancestors 'none'", "object-src 'none'",
].join("; ");

module.exports = {
  poweredByHeader: false,
  images: { remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }], formats: ["image/avif", "image/webp"] },
  experimental: { optimizePackageImports: ["lucide-react", "framer-motion"] },
  // Proxy /api/* to the backend so the auth cookie is first-party (works with middleware on Vercel).
  async rewrites() { return [{ source: "/api/:path*", destination: `${API_ORIGIN}/api/:path*` }]; },
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
      { key: "Content-Security-Policy-Report-Only", value: csp },
    ] }];
  },
};
