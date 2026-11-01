const PDFDocument = require("pdfkit");

const inr = (n) => `Rs. ${Number(n || 0).toLocaleString("en-IN")}`; // built-in PDF fonts have no rupee glyph
const when = (d) => new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

/** Returns a PDFKit document (a readable stream). Caller pipes it to the response. */
exports.buildInvoice = ({ booking, company = {} }) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const grey = "#5B6472";

  doc.fontSize(20).fillColor("#0B1B3A").text(company.name || "Invoice", { continued: false });
  doc.fontSize(9).fillColor(grey);
  [company.address, [company.phone, company.email].filter(Boolean).join("  |  ")].filter(Boolean).forEach((l) => doc.text(l));

  doc.moveDown(1.5).fontSize(16).fillColor("#0B1B3A").text("Trip Invoice");
  doc.fontSize(10).fillColor(grey).text(`Invoice no: ${booking.ref}`).text(`Date: ${when(booking.updatedAt)}`);

  doc.moveDown().fillColor("#1F2937").fontSize(11).text("Billed to", { underline: true });
  doc.fontSize(10).text(booking.customerName).text(`Mobile: ${booking.customerMobile}`);

  doc.moveDown().fontSize(11).text("Trip details", { underline: true });
  doc.fontSize(10)
    .text(`Pickup: ${booking.pickup}`)
    .text(booking.drop ? `Drop: ${booking.drop}` : "Local rental")
    .text(`Pickup time: ${when(booking.pickupAt)}`)
    .text(`Vehicle: ${booking.vehicle?.name || "-"}`)
    .text(`Passengers: ${booking.passengers}`);
  if (booking.distanceKm) doc.text(`Approx. distance: ${booking.distanceKm} km`);

  doc.moveDown().fontSize(11).text("Charges", { underline: true }).moveDown(0.3);
  const f = booking.fare || {};
  const lines = [["Base fare", f.base], ["Driver allowance", f.driverAllowance], ["Night charge", f.nightCharge], ["Parking", f.parking]].filter(([, v]) => v);
  if (f.discount) lines.push([`Discount${booking.coupon ? ` (${booking.coupon})` : ""}`, -f.discount]);
  lines.forEach(([k, v]) => {
    const y = doc.y;
    doc.fontSize(10).text(k, 50, y).text(v < 0 ? `- ${inr(-v)}` : inr(v), 350, y, { width: 195, align: "right" });
  });
  doc.moveTo(50, doc.y + 6).lineTo(545, doc.y + 6).strokeColor("#E2E6EC").stroke();
  const y = doc.y + 14;
  doc.fontSize(12).fillColor("#0B1B3A").text("Total", 50, y).text(inr(f.total), 350, y, { width: 195, align: "right" });
  doc.fontSize(10).fillColor(grey).text(`Payment status: ${booking.paymentStatus}`, 50, y + 28);

  doc.fontSize(8).fillColor(grey).text("Tolls, parking at stops and other charges not listed above are payable as per actuals. This invoice does not include GST details.", 50, 740, { width: 495 });
  doc.end();
  return doc;
};
