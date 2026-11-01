"use client";
import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Download, Star } from "lucide-react";
import Button from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { ErrorState, Skeleton } from "@/components/ui/States";
import StatusBadge from "@/components/StatusBadge";
import PayNow from "@/components/PayNow";
import { api } from "@/lib/api";
import { dateTime, inr } from "@/lib/format";
import { site, waLink } from "@/lib/siteConfig";

const STEPS = [["pending", "Requested"], ["confirmed", "Confirmed"], ["driver_assigned", "Driver assigned"], ["in_progress", "In progress"], ["completed", "Completed"]];

function Review({ booking }) {
  const [r, setR] = useState({ rating: 0, comment: "" });
  const [s, setS] = useState({ loading: false, error: null, done: false });
  async function submit(e) {
    e.preventDefault();
    if (!r.rating) return setS({ loading: false, error: "Select a star rating.", done: false });
    if (r.comment.trim().length < 5) return setS({ loading: false, error: "Write at least 5 characters.", done: false });
    setS({ loading: true, error: null, done: false });
    try { await api("/reviews", { method: "POST", body: { ...r, booking: booking._id } }); setS({ loading: false, error: null, done: true }); }
    catch (err) { setS({ loading: false, error: err.message, done: false }); }
  }
  if (s.done) return <p role="status" className="text-sm text-green-700">Thank you. Your review will appear after approval.</p>;
  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      <div role="radiogroup" aria-label="Rating" className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={r.rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => setR({ ...r, rating: n })}>
            <Star className={`h-7 w-7 ${n <= r.rating ? "fill-accent-500 text-accent-500" : "text-line"}`} aria-hidden />
          </button>
        ))}
      </div>
      <Field id="rv" label="Your review"><textarea id="rv" rows={3} value={r.comment} onChange={(e) => setR({ ...r, comment: e.target.value })} className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm" /></Field>
      {s.error && <ErrorState message={s.error} />}
      <Button type="submit" loading={s.loading}>Submit review</Button>
    </form>
  );
}

export default function BookingDetail({ params }) {
  const { ref } = use(params);
  const [s, setS] = useState({ loading: true, error: null, b: null });
  const [cancel, setCancel] = useState({ confirm: false, loading: false, error: null });

  const load = useCallback(() => {
    api(`/bookings/${ref}`).then((d) => setS({ loading: false, error: null, b: d.booking })).catch((e) => setS({ loading: false, error: e.message, b: null }));
  }, [ref]);
  useEffect(load, [load]);

  async function doCancel() {
    setCancel({ confirm: true, loading: true, error: null });
    try { await api(`/bookings/${ref}/status`, { method: "PATCH", body: { status: "cancelled" } }); setCancel({ confirm: false, loading: false, error: null }); load(); }
    catch (e) { setCancel({ confirm: true, loading: false, error: e.message }); }
  }

  if (s.loading) return <Skeleton className="h-64" />;
  if (s.error) return <div className="space-y-4"><ErrorState message={s.error} /><Link href="/dashboard/bookings" className="text-sm underline">Back to my bookings</Link></div>;
  const b = s.b, f = b.fare || {};
  const idx = STEPS.findIndex(([k]) => k === b.status);
  const canCancel = ["pending", "confirmed"].includes(b.status);
  const lines = [["Base fare", f.base], ["Driver allowance", f.driverAllowance], ["Night charge", f.nightCharge], ["Parking", f.parking]].filter(([, v]) => v);

  return (
    <div className="space-y-6">
      <Link href="/dashboard/bookings" className="text-sm text-ink-soft underline">All bookings</Link>
      <div className="flex items-center justify-between gap-3"><h2 className="font-heading text-xl font-semibold">{b.ref}</h2><StatusBadge status={b.status} /></div>

      {b.status === "cancelled" ? <p className="rounded-lg bg-red-50 p-4 text-sm text-red-800">This booking was cancelled.</p> : (
        <ol className="grid grid-cols-5 gap-1 text-center text-xs" aria-label="Booking progress">
          {STEPS.map(([k, label], i) => (
            <li key={k} aria-current={i === idx ? "step" : undefined}>
              <div className={`h-1.5 rounded-full ${i <= idx ? "bg-accent-500" : "bg-line"}`} />
              <span className={`mt-2 block ${i <= idx ? "font-medium text-navy-900" : "text-ink-soft"}`}>{label}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <dl className="space-y-2 rounded-card border border-line p-5 text-sm">
          {[["Trip type", b.tripType], ["Pickup", b.pickup], b.drop && ["Drop", b.drop], ["Pickup time", dateTime(b.pickupAt)], b.returnDate && ["Return date", dateTime(b.returnDate)], ["Vehicle", b.vehicle?.name], ["Passengers", b.passengers], b.distanceKm && ["Approx. distance", `${b.distanceKm} km`]]
            .filter(Boolean).map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-ink-soft">{k}</dt><dd className="text-right font-medium capitalize">{v}</dd></div>)}
          {b.driver && <div className="mt-3 border-t border-line pt-3"><dt className="text-ink-soft">Your driver</dt><dd className="font-medium">{b.driver.name} · <a href={`tel:${b.driver.mobile}`} className="underline">{b.driver.mobile}</a></dd></div>}
        </dl>
        <div className="rounded-card border border-line p-5 text-sm">
          <h3 className="font-heading font-semibold">Fare</h3>
          <dl className="mt-3 space-y-2">
            {lines.map(([k, v]) => <div key={k} className="flex justify-between"><dt className="text-ink-soft">{k}</dt><dd>{inr(v)}</dd></div>)}
            {f.discount > 0 && <div className="flex justify-between"><dt className="text-ink-soft">Discount{b.coupon ? ` (${b.coupon})` : ""}</dt><dd>- {inr(f.discount)}</dd></div>}
            <div className="flex justify-between border-t border-line pt-2 font-heading text-base font-semibold"><dt>Total</dt><dd>{inr(f.total)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-soft">Payment</dt><dd className="capitalize">{b.paymentStatus}</dd></div>
          </dl>
          <p className="mt-3 text-xs text-ink-soft">Tolls and parking at stops are not included. Final charges may vary with actual distance.</p>
        </div>
      </div>

      <PayNow booking={b} onPaid={load} />

      <div className="flex flex-wrap gap-3">
        {b.status === "completed" && <Button href={`/api/bookings/${b.ref}/invoice`} variant="dark" download><Download className="h-4 w-4" aria-hidden />Download invoice</Button>}
        <Button href={waLink(`Hello, I need help with booking ${b.ref}.`)} variant="outline">Contact support on WhatsApp</Button>
        <Button href={site.telHref} variant="outline">Call us</Button>
        {canCancel && !cancel.confirm && <Button variant="outline" onClick={() => setCancel({ ...cancel, confirm: true })} className="!border-red-300 !text-red-700">Cancel booking</Button>}
      </div>
      {cancel.confirm && (
        <div role="alertdialog" aria-label="Confirm cancellation" className="rounded-card border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-900">Cancel booking {b.ref}? This cannot be undone.</p>
          {cancel.error && <p role="alert" className="mt-2 text-sm text-red-700">{cancel.error}</p>}
          <div className="mt-3 flex gap-3">
            <Button onClick={doCancel} loading={cancel.loading} className="!bg-red-600 !text-white hover:!bg-red-700">Yes, cancel booking</Button>
            <Button variant="outline" onClick={() => setCancel({ confirm: false, loading: false, error: null })}>Keep booking</Button>
          </div>
        </div>
      )}

      {b.status === "completed" && <div className="rounded-card border border-line p-5"><h3 className="mb-3 font-heading font-semibold">How was your trip?</h3><Review booking={b} /></div>}
    </div>
  );
}
