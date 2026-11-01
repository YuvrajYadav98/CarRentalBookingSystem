const { z } = require("zod");

const istToday = () => new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
const oid = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");
const mobile = z.string().trim().transform((v) => v.replace(/\D/g, "").slice(-10)).pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"));

const base = z.object({
  tripType: z.enum(["one-way", "round-trip", "local", "airport", "outstation"]),
  pickup: z.string().trim().min(2, "Enter the pickup location").max(200),
  drop: z.string().trim().max(200).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Select the pickup date"),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Select the pickup time"),
  returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("").transform(() => undefined)),
  passengers: z.coerce.number().int().min(1, "Enter passengers").max(60),
  vehicle: oid,
  package: oid.optional().or(z.literal("").transform(() => undefined)),
  name: z.string().trim().min(2, "Enter your name").max(80),
  mobile,
  coupon: z.string().trim().max(30).optional().or(z.literal("").transform(() => undefined)),
  notes: z.string().trim().max(500).optional(),
});

const rules = (d, ctx) => {
  if (d.date < istToday()) ctx.addIssue({ code: "custom", path: ["date"], message: "Pickup date cannot be in the past" });
  if (d.tripType !== "local" && !d.package && !d.drop) ctx.addIssue({ code: "custom", path: ["drop"], message: "Enter the drop location" });
  if (d.tripType === "round-trip" && !d.returnDate) ctx.addIssue({ code: "custom", path: ["returnDate"], message: "Select the return date" });
  if (d.returnDate && d.returnDate < d.date) ctx.addIssue({ code: "custom", path: ["returnDate"], message: "Return date must be on or after pickup" });
};

exports.estimateSchema = base.partial({ name: true, mobile: true }).superRefine(rules);
exports.bookingSchema = base.superRefine(rules);
exports.statusSchema = z.object({ status: z.enum(["pending", "confirmed", "driver_assigned", "in_progress", "completed", "cancelled"]), driver: oid.optional() });
exports.adminUpdateSchema = z.object({
  customerName: z.string().trim().min(2).max(80), customerMobile: mobile, pickup: z.string().trim().min(2).max(200), drop: z.string().trim().max(200),
  passengers: z.coerce.number().int().min(1).max(60), notes: z.string().trim().max(500), paymentStatus: z.enum(["unpaid", "partial", "paid", "refunded"]),
}).partial();
