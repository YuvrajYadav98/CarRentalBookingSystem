const { z } = require("zod");

const mobile = z.string().trim().transform((v) => v.replace(/\D/g, "").slice(-10)).pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"));
const password = z.string().min(8, "Password must be at least 8 characters").max(72).regex(/[A-Za-z]/, "Password needs a letter").regex(/\d/, "Password needs a number");

exports.registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  mobile,
  password,
});
exports.loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});
exports.updateMeSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  mobile: mobile.optional(),
}).strict();
