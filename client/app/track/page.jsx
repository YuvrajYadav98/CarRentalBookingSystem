"use client";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { ErrorState } from "@/components/ui/States";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/api";

export default function Track() {
  const [f, setF] = useState({ ref: "", mobile: "" });
  const [s, setS] = useState({ loading: false, error: null, booking: null });

  async function submit(e) {
    e.preventDefault();
    if (!f.ref.trim() || f.mobile.replace(/\D/g, "").length < 10) return setS({ loading: false, error: "Enter your booking reference and 10-digit mobile number.", booking: null });
    setS({ loading: true, error: null, booking: null });
    try { setS({ loading: false, error: null, booking: (await api(`/bookings/track?ref=${encodeURIComponent(f.ref.trim())}&mobile=${encodeURIComponent(f.mobile)}`)).booking }); }
    catch (err) { setS({ loading: false, error: err.message, booking: null }); }
  }
  const b = s.booking;
  return (
    <>
      <PageHeader title="Track your booking" sub="Use the reference from your confirmation and the mobile number you booked with." />
      <section className="section"><div className="container-x max-w-md">
        <form onSubmit={submit} noValidate className="space-y-4 rounded-card border border-line p-6">
          <Input id="ref" label="Booking reference" placeholder="e.g. BK261031ABC123" value={f.ref} onChange={(e) => setF({ ...f, ref: e.target.value })} />
          <Input id="tm" type="tel" label="Mobile number" value={f.mobile} onChange={(e) => setF({ ...f, mobile: e.target.value })} />
          {s.error && <ErrorState message={s.error} />}
          <Button type="submit" loading={s.loading} className="w-full">Check status</Button>
        </form>
        {b && (
          <div className="mt-6 rounded-card bg-muted p-6" aria-live="polite">
            <div className="flex items-center justify-between"><p className="font-heading font-semibold">{b.ref}</p><StatusBadge status={b.status} /></div>
            <p className="mt-3 text-sm text-ink-soft">{b.pickup}{b.drop ? ` to ${b.drop}` : ""}</p>
            <p className="text-sm text-ink-soft">{new Date(b.pickupAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })} · {b.vehicle}</p>
          </div>
        )}
      </div></section>
    </>
  );
}
