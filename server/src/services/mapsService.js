const ApiError = require("../utils/ApiError");

// Approximate road distances from Indore (km) for popular routes. Used before calling Google (saves cost, works without a key).
const known = { ujjain: 55, omkareshwar: 78, maheshwar: 91, mandu: 95, bhopal: 190, patalpani: 35 };
const norm = (s) => String(s || "").toLowerCase();
const fromIndore = (s) => /indore|airport/.test(s);

function knownRoute(a, b) {
  const A = norm(a), B = norm(b);
  for (const [place, km] of Object.entries(known)) {
    if ((A.includes(place) && fromIndore(B)) || (B.includes(place) && fromIndore(A))) return km;
  }
  return null;
}

const key = () => process.env.GOOGLE_MAPS_API_KEY;
const post = (url, mask, body) => fetch(url, {
  method: "POST", signal: AbortSignal.timeout(8000),
  headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key(), "X-Goog-FieldMask": mask }, body: JSON.stringify(body),
});

exports.getDistanceKm = async (pickup, drop) => {
  const km = knownRoute(pickup, drop);
  if (km) return { km, source: "approximate" };
  if (!key()) throw new ApiError(422, "We can't calculate the distance for this route automatically yet. Please call or WhatsApp us for a quote.");
  try {
    const res = await post("https://routes.googleapis.com/directions/v2:computeRoutes", "routes.distanceMeters",
      { origin: { address: pickup }, destination: { address: drop }, travelMode: "DRIVE", regionCode: "IN" });
    const meters = (await res.json()).routes?.[0]?.distanceMeters;
    if (res.ok && meters) return { km: Math.round(meters / 100) / 10, source: "google" };
  } catch (e) { console.error("Routes API error:", e.message); }
  throw new ApiError(422, "We couldn't work out that route. Check the locations, or call us for a quote.");
};

// Place suggestions for the booking form. Degrades to an empty list (plain text input) on any problem.
exports.autocomplete = async (input) => {
  if (!key()) return [];
  try {
    const res = await post("https://places.googleapis.com/v1/places:autocomplete", "suggestions.placePrediction.text.text", {
      input, includedRegionCodes: ["in"], locationBias: { circle: { center: { latitude: 22.7196, longitude: 75.8577 }, radius: 50000 } },
    });
    if (!res.ok) return [];
    return ((await res.json()).suggestions || []).map((s) => s.placePrediction?.text?.text).filter(Boolean).slice(0, 6);
  } catch { return []; }
};
