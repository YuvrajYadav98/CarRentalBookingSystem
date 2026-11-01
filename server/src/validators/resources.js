const { z } = require("zod");

const mobile = z.string().trim().transform((v) => v.replace(/\D/g, "").slice(-10)).pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"));
const url = z.string().trim().url().refine((u) => u.startsWith("https://"), "Image URL must use https").optional();
const strs = z.array(z.string().trim().min(1).max(200)).max(30).optional();

exports.vehicle = z.object({
  name: z.string().trim().min(2).max(80), image: url, description: z.string().trim().max(600).optional(),
  seats: z.coerce.number().int().min(1).max(60), luggage: z.coerce.number().int().min(0).max(50).optional(),
  ac: z.boolean().optional(), pricePerKm: z.coerce.number().min(0).max(10000), available: z.boolean().optional(), isActive: z.boolean().optional(),
});
exports.package = z.object({
  name: z.string().trim().min(2).max(100), image: url, description: z.string().trim().max(1000).optional(),
  price: z.coerce.number().min(0), distance: z.coerce.number().min(0).optional(), travelTime: z.string().trim().max(40).optional(),
  duration: z.string().trim().max(40).optional(), vehicleOptions: strs, included: strs, excluded: strs, isActive: z.boolean().optional(),
});
exports.driver = z.object({
  name: z.string().trim().min(2).max(80), mobile, licenseNumber: z.string().trim().max(40).optional(),
  available: z.boolean().optional(), isActive: z.boolean().optional(),
});
exports.review = z.object({ rating: z.coerce.number().int().min(1).max(5), comment: z.string().trim().min(5, "Write at least 5 characters").max(500), booking: z.string().regex(/^[a-f\d]{24}$/i, "Select the trip to review") });
exports.enquiry = z.object({ name: z.string().trim().min(2).max(80), mobile, email: z.string().trim().email().optional().or(z.literal("").transform(() => undefined)), message: z.string().trim().min(10, "Write at least 10 characters").max(1000) });
exports.enquiryUpdate = z.object({ status: z.enum(["new", "in_progress", "resolved"]).optional(), adminNote: z.string().trim().max(1000).optional() });
exports.settings = z.object({
  gallery: z.array(z.object({ url: z.string().trim().url().refine((u) => u.startsWith("https://"), "Image link must use https"), caption: z.string().trim().max(100).optional() })).max(40).optional(),
  company: z.object({ name: z.string().max(100), logo: z.string().url(), phone: z.string().max(20), whatsapp: z.string().max(20), email: z.string().email(), address: z.string().max(300),
    social: z.array(z.object({ label: z.string().max(30), url: z.string().url() })).max(10) }).partial().optional(),
  pricing: z.object({ minFare: z.number().min(0), driverAllowancePerDay: z.number().min(0), nightCharge: z.number().min(0), nightStartHour: z.number().int().min(0).max(23),
    nightEndHour: z.number().int().min(0).max(23), oneWayMultiplier: z.number().min(0).max(5), minKmPerDay: z.number().min(0), parkingCharge: z.number().min(0), advancePercent: z.number().min(0).max(100) }).partial().optional(),
});

exports.coupon = z.object({
  code: z.string().trim().min(3).max(20).regex(/^[A-Za-z0-9_-]+$/, "Use letters, numbers, - or _ only"),
  type: z.enum(["percent", "flat"]), value: z.coerce.number().min(0),
  minAmount: z.coerce.number().min(0).optional(), maxDiscount: z.coerce.number().min(0).optional(),
  expiresAt: z.coerce.date().optional().or(z.literal("").transform(() => undefined)),
  usageLimit: z.coerce.number().int().min(1).optional(), active: z.boolean().optional(), showOnWebsite: z.boolean().optional(),
}).refine((d) => d.type !== "percent" || d.value <= 100, { path: ["value"], message: "Percent discount cannot exceed 100" });
