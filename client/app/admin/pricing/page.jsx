"use client";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { ErrorState, Skeleton } from "@/components/ui/States";
import { PageTitle, Table } from "@/components/admin/ui";
import { api } from "@/lib/api";

const RULES = [
  ["minFare", "Minimum fare (₹)", "Lowest fare charged for a km-based trip. 0 = none."], ["minKmPerDay", "Minimum km per day", "Used for round trips and local rentals. Local rentals need this to be set."],
  ["driverAllowancePerDay", "Driver allowance per day (₹)", "Added for each day of a round or outstation trip."], ["nightCharge", "Night charge (₹)", "Added when pickup falls in the night window."],
  ["nightStartHour", "Night starts at (hour, 0-23)", "e.g. 22 for 10 PM"], ["nightEndHour", "Night ends at (hour, 0-23)", "e.g. 6 for 6 AM"],
  ["oneWayMultiplier", "One-way km multiplier", "1 = bill only the one-way distance. 2 = bill both ways."], ["parkingCharge", "Parking charge (₹)", "Flat amount added to every estimate. 0 = none."],
  ["advancePercent", "Advance payment (%)", "Share of the fare customers can pay upfront. 0 = only full payment is offered."],
];

export default function Pricing() {
  const [s, setS] = useState({ loading: true, error: null });
  const [p, setP] = useState({}); const [vehicles, setVehicles] = useState([]);
  const [save, setSave] = useState({ loading: false, error: null, ok: false });
  const [rowMsg, setRowMsg] = useState({});

  useEffect(() => {
    Promise.all([api("/settings"), api("/vehicles?all=true")]).then(([st, v]) => { setP(st.settings.pricing || {}); setVehicles(v.vehicles); setS({ loading: false, error: null }); }).catch((e) => setS({ loading: false, error: e.message }));
  }, []);

  async function saveRules(e) {
    e.preventDefault(); setSave({ loading: true, error: null, ok: false });
    try { await api("/settings", { method: "PUT", body: { pricing: Object.fromEntries(RULES.map(([k]) => [k, Number(p[k] || 0)])) } }); setSave({ loading: false, error: null, ok: true }); }
    catch (err) { setSave({ loading: false, error: err.message, ok: false }); }
  }
  async function saveRate(v) {
    try { await api(`/vehicles/${v._id}`, { method: "PUT", body: { pricePerKm: Number(v.pricePerKm) } }); setRowMsg((m) => ({ ...m, [v._id]: "Saved" })); } catch (e) { setRowMsg((m) => ({ ...m, [v._id]: e.message })); }
  }

  if (s.loading) return <Skeleton className="h-64" />;
  if (s.error) return <ErrorState message={s.error} />;
  return (
    <>
      <PageTitle title="Pricing" />
      <p className="mb-6 max-w-2xl text-sm text-ink-soft">These values drive every fare estimate and booking. Rules left at 0 are not applied. New bookings use the new values; existing bookings keep the fare they were booked at.</p>
      <h2 className="mb-3 font-heading text-lg font-semibold">Per-km rates</h2>
      <Table rows={vehicles} empty="Add vehicles first" cols={[
        { label: "Vehicle", key: "name" },
        { label: "₹ per km", render: (v) => <input aria-label={`Rate for ${v.name}`} type="number" min="0" step="any" value={v.pricePerKm} onChange={(e) => setVehicles(vehicles.map((x) => (x._id === v._id ? { ...x, pricePerKm: e.target.value } : x)))} className="w-24 rounded-lg border border-line px-2 py-1.5 text-sm" /> },
        { label: "", render: (v) => <div className="flex items-center gap-3"><Button variant="outline" className="!py-1.5" onClick={() => saveRate(v)}>Save</Button><span className="text-xs text-ink-soft">{rowMsg[v._id]}</span></div> }]} />
      <h2 className="mb-3 mt-10 font-heading text-lg font-semibold">Fare rules</h2>
      <form onSubmit={saveRules} className="grid max-w-3xl gap-4 sm:grid-cols-2">
        {RULES.map(([k, label, hint]) => (<div key={k}><Input id={k} type="number" min="0" step="any" label={label} value={p[k] ?? 0} onChange={(e) => setP({ ...p, [k]: e.target.value })} /><p className="mt-1 text-xs text-ink-soft">{hint}</p></div>))}
        <div className="sm:col-span-2">{save.error && <ErrorState message={save.error} />}{save.ok && <p role="status" className="mb-3 flex items-center gap-2 text-sm text-green-700"><CheckCircle2 className="h-4 w-4" aria-hidden />Pricing saved.</p>}<Button type="submit" loading={save.loading}>Save fare rules</Button></div>
      </form>
    </>
  );
}
