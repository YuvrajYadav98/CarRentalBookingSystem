"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calculator, CheckCircle2, MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import PlaceInput from "@/components/ui/PlaceInput";
import { ErrorState } from "@/components/ui/States";
import { api } from "@/lib/api";
import { TRIP_TYPES, validateBooking } from "@/lib/validators";
import { waLink } from "@/lib/siteConfig";

const init = { coupon: "", package: "", tripType: "one-way", pickup: "", drop: "", date: "", time: "", returnDate: "", passengers: "1", vehicle: "", name: "", mobile: "" };

export default function BookingForm({ initialVehicles }) {
  const router = useRouter();
  const [f, setF] = useState(init);
  const [booking, setBooking] = useState({ loading: false, error: null });
  const [errors, setErrors] = useState({});
  const [vehicles, setVehicles] = useState({ loading: !initialVehicles, list: initialVehicles || [], error: null });
  const [estimate, setEstimate] = useState({ loading: false, data: null, error: null });

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const pre = {};
    for (const k of ["vehicle", "package", "pickup", "drop", "tripType"]) if (q.get(k)) pre[k] = q.get(k);
    if (Object.keys(pre).length) setF((x) => ({ ...x, ...pre }));
    if (!initialVehicles) {
      api("/vehicles").then((d) => setVehicles({ loading: false, list: d.vehicles || [], error: null }))
        .catch(() => setVehicles({ loading: false, list: [], error: "Vehicles could not be loaded." }));
    }
  }, [initialVehicles]);

  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setEstimate({ loading: false, data: null, error: null }); };
  const today = new Date().toISOString().slice(0, 10);

  const check = () => { const e = validateBooking(f); setErrors(e); return Object.keys(e).length === 0; };

  async function getEstimate() {
    if (!check()) return;
    setEstimate({ loading: true, data: null, error: null });
    try {
      const d = await api("/bookings/estimate", { method: "POST", body: f });
      setEstimate({ loading: false, data: d, error: null });
    } catch (err) {
      setEstimate({ loading: false, data: null, error: err.message || "Fare estimate is unavailable right now." });
    }
  }

  async function confirmBooking() {
    if (!check()) return;
    setBooking({ loading: true, error: null });
    try {
      const d = await api("/bookings", { method: "POST", body: f });
      sessionStorage.setItem("lastBooking", JSON.stringify({ ...d.booking, mobile: f.mobile }));
      router.push(`/booking/confirmation/${d.booking.ref}`);
    } catch (err) {
      setBooking({ loading: false, error: err.message });
    }
  }

  function sendWhatsApp() {
    if (!check()) return;
    const v = vehicles.list.find((x) => x._id === f.vehicle)?.name || f.vehicle;
    const msg = [
      "New cab booking request", `Trip: ${TRIP_TYPES.find((t) => t.value === f.tripType)?.label}`,
      `Pickup: ${f.pickup}`, f.drop && `Drop: ${f.drop}`, `Date: ${f.date} ${f.time}`,
      f.returnDate && `Return: ${f.returnDate}`, `Passengers: ${f.passengers}`, `Vehicle: ${v}`,
      `Name: ${f.name}`, `Mobile: ${f.mobile}`,
    ].filter(Boolean).join("\n");
    window.open(waLink(msg), "_blank", "noopener,noreferrer");
  }

  const round = f.tripType === "round-trip";
  const local = f.tripType === "local";

 
return (
  <form
    onSubmit={(e) => e.preventDefault()}
    noValidate
    aria-label="Cab booking form"
    className="w-full min-w-0 overflow-visible rounded-card bg-white p-4 shadow-card sm:p-6 lg:p-7"
  >
    {/* Form Header */}
    <div className="mb-5">
      <h2 className="font-heading text-lg font-semibold text-gray-900 sm:text-xl">
        Book your ride
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Enter your trip details to book your cab.
      </p>
    </div>

    {/* Booking Fields */}
    <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

      {/* Trip Type */}
      <div className="min-w-0">
        <Select
          id="tripType"
          label="Trip type"
          value={f.tripType}
          onChange={set("tripType")}
          options={TRIP_TYPES}
          error={errors.tripType}
        />
      </div>

      {/* Pickup */}
      <div className="min-w-0">
        <PlaceInput
          id="pickup"
          label="Pickup location"
          placeholder="e.g. Indore Airport"
          value={f.pickup}
          onChange={set("pickup")}
          error={errors.pickup}
        />
      </div>

      {/* Drop */}
      {!local && (
        <div className="min-w-0">
          <PlaceInput
            id="drop"
            label="Drop location"
            placeholder="e.g. Ujjain"
            value={f.drop}
            onChange={set("drop")}
            error={errors.drop}
          />
        </div>
      )}

      {/* Pickup Date */}
      <div className="min-w-0">
        <Input
          id="date"
          type="date"
          min={today}
          label="Pickup date"
          value={f.date}
          onChange={set("date")}
          error={errors.date}
        />
      </div>

      {/* Pickup Time */}
      <div className="min-w-0">
        <Input
          id="time"
          type="time"
          label="Pickup time"
          value={f.time}
          onChange={set("time")}
          error={errors.time}
        />
      </div>

      {/* Return Date */}
      {round && (
        <div className="min-w-0">
          <Input
            id="returnDate"
            type="date"
            min={f.date || today}
            label="Return date"
            value={f.returnDate}
            onChange={set("returnDate")}
            error={errors.returnDate}
          />
        </div>
      )}

      {/* Passengers */}
      <div className="min-w-0">
        <Input
          id="passengers"
          type="number"
          min="1"
          max="20"
          label="Passengers"
          value={f.passengers}
          onChange={set("passengers")}
          error={errors.passengers}
        />
      </div>

      {/* Vehicle */}
      <div className="min-w-0">
        <Select
          id="vehicle"
          label="Vehicle"
          placeholder={
            vehicles.loading
              ? "Loading vehicles…"
              : "Select vehicle"
          }
          value={f.vehicle}
          onChange={set("vehicle")}
          options={vehicles.list.map((v) => ({
            value: v._id,
            label: v.name,
          }))}
          error={errors.vehicle}
        />
      </div>

      {/* Customer Name */}
      <div className="min-w-0">
        <Input
          id="name"
          label="Your name"
          autoComplete="name"
          value={f.name}
          onChange={set("name")}
          error={errors.name}
        />
      </div>

      {/* Coupon */}
      <div className="min-w-0">
        <Input
          id="coupon"
          label="Coupon code (optional)"
          value={f.coupon}
          onChange={set("coupon")}
        />
      </div>

      {/* Mobile */}
      <div className="min-w-0">
        <Input
          id="mobile"
          type="tel"
          inputMode="numeric"
          label="Mobile number"
          autoComplete="tel"
          placeholder="10-digit number"
          value={f.mobile}
          onChange={set("mobile")}
          error={errors.mobile}
        />
      </div>

    </div>

    {/* Vehicle Loading Error */}
    {vehicles.error && (
      <div className="mt-4">
        <ErrorState message={vehicles.error} />
      </div>
    )}

    {/* Fare Estimate */}
    {estimate.data && (
      <div
        className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5"
        aria-live="polite"
      >
        <p className="text-sm text-gray-500">
          Estimated fare
        </p>

        <p className="mt-1 font-heading text-2xl font-bold text-navy-900 sm:text-3xl">
          ₹{Number(estimate.data.total).toLocaleString("en-IN")}
        </p>

        {estimate.data.notes?.length > 0 && (
          <p className="mt-2 text-xs leading-relaxed text-gray-500">
            {estimate.data.notes.join(" ")}
          </p>
        )}
      </div>
    )}

    {/* Estimate Error */}
    {estimate.error && (
      <div className="mt-4">
        <ErrorState message={estimate.error} />
      </div>
    )}

    {/* Booking Error */}
    {booking.error && (
      <div className="mt-4">
        <ErrorState message={booking.error} />
      </div>
    )}

    {/* Action Buttons */}
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

      <Button
        type="button"
        variant="outline"
        onClick={getEstimate}
        loading={estimate.loading}
        className="w-full justify-center"
      >
        <Calculator className="h-4 w-4" aria-hidden />
        Get fare estimate
      </Button>

      <Button
        type="button"
        onClick={confirmBooking}
        loading={booking.loading}
        className="w-full justify-center"
      >
        <CheckCircle2 className="h-4 w-4" aria-hidden />
        Confirm booking
      </Button>

      <Button
        type="button"
        variant="dark"
        onClick={sendWhatsApp}
        className="w-full justify-center sm:col-span-2 lg:col-span-1"
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
        WhatsApp
      </Button>

    </div>
  </form>
);
}
