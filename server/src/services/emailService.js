const nodemailer = require("nodemailer");
const Settings = require("../models/Settings");

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const inr = (n) => `Rs. ${Number(n || 0).toLocaleString("en-IN")}`;
const when = (d) => new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
const enabled = () => !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

let transport;
const getTransport = () => (transport ||= nodemailer.createTransport({
  host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT) || 587, secure: Number(process.env.SMTP_PORT) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
}));

// Never throws and never blocks a request: email problems must not break bookings or payments.
async function send(to, subject, html) {
  if (!enabled() || !to) return;
  try { await getTransport().sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to, subject, html }); }
  catch (e) { console.error("Email failed:", e.message); }
}
const adminTo = async () => process.env.ADMIN_NOTIFY_EMAIL || (await Settings.get()).company?.email;
const wrap = (title, rows) => `<div style="font-family:Arial,sans-serif;max-width:520px"><h2 style="color:#0B1B3A">${esc(title)}</h2><table style="width:100%;font-size:14px">${rows.filter(Boolean).map(([k, v]) => `<tr><td style="color:#5B6472;padding:4px 0">${esc(k)}</td><td style="text-align:right"><b>${esc(v)}</b></td></tr>`).join("")}</table></div>`;
const tripRows = (b, vehicle) => [["Reference", b.ref], ["Pickup", b.pickup], b.drop && ["Drop", b.drop], ["Pickup time", when(b.pickupAt)], vehicle && ["Vehicle", vehicle], ["Estimated fare", inr(b.fare?.total)]];

exports.bookingCreated = async ({ booking, vehicleName, customerEmail }) => {
  const rows = tripRows(booking, vehicleName);
  await Promise.all([
    send(await adminTo(), `New booking ${booking.ref}`, wrap("New booking request", [...rows, ["Customer", booking.customerName], ["Mobile", booking.customerMobile]])),
    send(customerEmail, `Booking request received (${booking.ref})`, wrap("We received your booking request", rows)),
  ]);
};
exports.statusChanged = ({ booking, email }) => send(email, `Booking ${booking.ref}: ${booking.status.replace("_", " ")}`, wrap(`Your booking is now ${booking.status.replace("_", " ")}`, tripRows(booking)));
exports.paymentReceived = async ({ booking, amount, email }) => {
  const rows = [["Reference", booking.ref], ["Amount paid", inr(amount)], ["Payment status", booking.paymentStatus]];
  await Promise.all([send(await adminTo(), `Payment received for ${booking.ref}`, wrap("Payment received", rows)), send(email, `Payment received for ${booking.ref}`, wrap("Thank you, payment received", rows))]);
};
exports.esc = esc;
