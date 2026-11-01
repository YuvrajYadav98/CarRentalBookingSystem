const ApiError = require("../utils/ApiError");
const Vehicle = require("../models/Vehicle");
const Package = require("../models/Package");
const Settings = require("../models/Settings");
const Coupon = require("../models/Coupon");
const { getDistanceKm } = require("./mapsService");

const DAY = 86400000;
const dayNumber = (ymd) => Date.UTC(...ymd.split("-").map((n, i) => (i === 1 ? n - 1 : +n)));

/** Pure fare calculation. All rates come from the arguments (vehicle + admin-set pricing); nothing is hardcoded. */
function calculateFare({ tripType, distanceKm = 0, pricePerKm, pricing = {}, date, returnDate, pickupHour = 12, packagePrice }) {
  const p = { minFare: 0, driverAllowancePerDay: 0, nightCharge: 0, nightStartHour: 22, nightEndHour: 6, oneWayMultiplier: 1, minKmPerDay: 0, parkingCharge: 0, ...pricing };
  const multiDay = (tripType === "round-trip" || tripType === "outstation") && returnDate;
  const days = multiDay ? Math.max(1, Math.round((dayNumber(returnDate) - dayNumber(date)) / DAY) + 1) : 1;

  let billedKm = 0, base;
  if (packagePrice != null) {
    base = packagePrice;
  } else {
    if (tripType === "round-trip") billedKm = Math.max(distanceKm * 2, p.minKmPerDay * days);
    else if (tripType === "local") billedKm = p.minKmPerDay;
    else if (tripType === "outstation" && returnDate) billedKm = Math.max(distanceKm * 2, p.minKmPerDay * days);
    else billedKm = distanceKm * p.oneWayMultiplier; // one-way, airport, outstation without return
    base = Math.max(billedKm * pricePerKm, billedKm > 0 ? p.minFare : 0);
  }

  const driverAllowance = multiDay ? p.driverAllowancePerDay * days : 0;
  const isNight = p.nightStartHour > p.nightEndHour ? pickupHour >= p.nightStartHour || pickupHour < p.nightEndHour : pickupHour >= p.nightStartHour && pickupHour < p.nightEndHour;
  const nightCharge = isNight ? p.nightCharge : 0;
  const parking = p.parkingCharge;
  const subtotal = Math.round(base + driverAllowance + nightCharge + parking);
  return { billedKm, days, base: Math.round(base), driverAllowance, nightCharge, parking, subtotal };
}

async function applyCoupon(code, subtotal) {
  const c = await Coupon.findOne({ code: String(code).trim().toUpperCase(), active: true });
  const bad = !c || (c.expiresAt && c.expiresAt < new Date()) || (c.usageLimit != null && c.usedCount >= c.usageLimit) || subtotal < c.minAmount;
  if (bad) throw new ApiError(422, "This coupon is not valid for this booking.");
  let discount = c.type === "percent" ? (subtotal * c.value) / 100 : c.value;
  if (c.maxDiscount != null) discount = Math.min(discount, c.maxDiscount);
  return { coupon: c, discount: Math.round(Math.min(discount, subtotal)) };
}

/** Loads vehicle/package/pricing, finds distance, and returns a full quote. Used by both estimate and booking. */
async function computeQuote(d) {
  const vehicle = await Vehicle.findOne({ _id: d.vehicle, isActive: true });
  if (!vehicle) throw new ApiError(404, "Vehicle not found.");
  if (!vehicle.available) throw new ApiError(422, "This vehicle is not available right now. Please choose another.");
  if (d.passengers > vehicle.seats) throw new ApiError(422, `${vehicle.name} seats ${vehicle.seats} passengers. Choose a larger vehicle.`);

  let pkg = null, distanceKm = 0;
  if (d.package) {
    pkg = await Package.findOne({ _id: d.package, isActive: true });
    if (!pkg) throw new ApiError(404, "Package not found.");
    distanceKm = pkg.distance || 0;
  } else if (d.tripType !== "local") {
    distanceKm = (await getDistanceKm(d.pickup, d.drop)).km;
  }

  const settings = await Settings.get();
  const f = calculateFare({
    tripType: d.tripType, distanceKm, pricePerKm: vehicle.pricePerKm, pricing: settings.pricing?.toObject?.() || {},
    date: d.date, returnDate: d.returnDate, pickupHour: Number(d.time.slice(0, 2)), packagePrice: pkg?.price,
  });
  if (!f.base) throw new ApiError(422, "We can't estimate this trip automatically. Please call or WhatsApp us for a quote.");

  let discount = 0, coupon = null;
  if (d.coupon) ({ coupon, discount } = await applyCoupon(d.coupon, f.subtotal));
  const fare = { base: f.base, driverAllowance: f.driverAllowance, nightCharge: f.nightCharge, parking: f.parking, discount, total: Math.max(0, f.subtotal - discount) };
  return { vehicle, pkg, distanceKm, billedKm: f.billedKm, fare, coupon };
}

const FARE_NOTES = ["Tolls and parking at stops are not included.", "This is an estimate. Final charges may vary with actual distance and company policy."];

module.exports = { calculateFare, computeQuote, FARE_NOTES };
