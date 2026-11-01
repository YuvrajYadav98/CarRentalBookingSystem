const test = require("node:test");
const assert = require("node:assert");
const { calculateFare } = require("../src/services/fareService");

const base = { tripType: "one-way", distanceKm: 55, pricePerKm: 11, date: "2026-11-02", pickupHour: 10 };

test("one-way = km x rate with neutral defaults", () => assert.equal(calculateFare(base).subtotal, 605));
test("minimum fare lifts a short trip", () => assert.equal(calculateFare({ ...base, pricing: { minFare: 1000 } }).subtotal, 1000));
test("one-way multiplier applies to billed km", () => assert.equal(calculateFare({ ...base, pricing: { oneWayMultiplier: 2 } }).subtotal, 1210));
test("round trip: min km per day and driver allowance over 2 days", () => {
  const f = calculateFare({ ...base, tripType: "round-trip", returnDate: "2026-11-03", pricing: { minKmPerDay: 250, driverAllowancePerDay: 300 } });
  assert.equal(f.days, 2); assert.equal(f.billedKm, 500); assert.equal(f.subtotal, 5500 + 600);
});
test("round trip with no min km bills both ways", () => assert.equal(calculateFare({ ...base, tripType: "round-trip", returnDate: "2026-11-02" }).billedKm, 110));
test("night charge applies across midnight window only", () => {
  const p = { nightCharge: 200 };
  assert.equal(calculateFare({ ...base, pickupHour: 23, pricing: p }).nightCharge, 200);
  assert.equal(calculateFare({ ...base, pickupHour: 3, pricing: p }).nightCharge, 200);
  assert.equal(calculateFare({ ...base, pickupHour: 12, pricing: p }).nightCharge, 0);
});
test("package price replaces km-based fare", () => assert.equal(calculateFare({ ...base, packagePrice: 2750 }).subtotal, 2750));
test("local trip with no min km configured cannot be priced", () => assert.equal(calculateFare({ ...base, tripType: "local", distanceKm: 0 }).base, 0));
