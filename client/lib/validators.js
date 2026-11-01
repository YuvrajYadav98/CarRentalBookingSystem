export const TRIP_TYPES = [
  { value: "one-way", label: "One Way" },
  { value: "round-trip", label: "Round Trip" },
  { value: "local", label: "Local Rental" },
  { value: "airport", label: "Airport Transfer" },
  { value: "outstation", label: "Outstation" },
];

export function validateBooking(f) {
  const e = {};
  const today = new Date().toISOString().slice(0, 10);
  if (!f.tripType) e.tripType = "Select a trip type.";
  if (!f.pickup.trim()) e.pickup = "Enter the pickup location.";
  if (f.tripType !== "local" && !f.drop.trim()) e.drop = "Enter the drop location.";
  if (!f.date) e.date = "Select the pickup date.";
  else if (f.date < today) e.date = "Pickup date cannot be in the past.";
  if (!f.time) e.time = "Select the pickup time.";
  if (f.tripType === "round-trip") {
    if (!f.returnDate) e.returnDate = "Select the return date.";
    else if (f.date && f.returnDate < f.date) e.returnDate = "Return date must be on or after pickup.";
  }
  const p = Number(f.passengers);
  if (!p || p < 1 || p > 20) e.passengers = "Enter 1 to 20 passengers.";
  if (!f.vehicle) e.vehicle = "Select a vehicle.";
  if (f.name.trim().length < 2) e.name = "Enter your name.";
  if (!/^[6-9]\d{9}$/.test(f.mobile.replace(/\D/g, "").slice(-10))) e.mobile = "Enter a valid 10-digit mobile number.";
  return e;
}
