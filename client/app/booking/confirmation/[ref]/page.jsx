"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/StatusBadge";
import PayNow from "@/components/PayNow";
import { site, waLink } from "@/lib/siteConfig";

export default function Confirmation({ params }) {
  const { ref } = use(params);
  const [b, setB] = useState(undefined);
  useEffect(() => {
    try { const x = JSON.parse(sessionStorage.getItem("lastBooking") || "null"); setB(x?.ref === ref ? x : null); } catch { setB(null); }
  }, [ref]);

  if (b === undefined) return null;
  if (!b) return (
    <section className="section"><div className="container-x max-w-lg">
      <h1 className="text-2xl font-semibold">Booking {ref}</h1>
      <p className="mt-3 text-ink-soft">For privacy, booking details are shown only on the device that made the booking. Use your booking reference and mobile number to check the status.</p>
      <Button href="/track" className="mt-6">Track this booking</Button>
    </div></section>
  );

  const rows = [["Pickup", b.pickup], b.drop && ["Drop", b.drop], ["Date and time", new Date(b.pickupAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })], ["Vehicle", b.vehicle], ["Passengers", b.passengers]].filter(Boolean);
  return (
    <section className="section"><div className="container-x max-w-xl">
      <CheckCircle2 className="h-10 w-10 text-green-600" aria-hidden />
      <h1 className="mt-3 text-2xl font-semibold md:text-3xl">Booking request received</h1>
      <p className="mt-2 text-ink-soft">{site.name} will confirm your booking shortly. Save your reference: you need it to track the booking.</p>
      <div className="mt-6 rounded-card border border-line p-6">
        <div className="flex items-center justify-between gap-3"><p className="font-heading text-xl font-semibold">{b.ref}</p><StatusBadge status={b.status} /></div>
        <dl className="mt-4 space-y-2 text-sm">{rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-ink-soft">{k}</dt><dd className="text-right font-medium">{v}</dd></div>)}</dl>
        <div className="mt-4 border-t border-line pt-4">
          <p className="flex justify-between font-heading text-lg font-semibold"><span>Estimated fare</span><span>₹{Number(b.fare.total).toLocaleString("en-IN")}</span></p>
          <p className="mt-1 text-xs text-ink-soft">{(b.notes || []).join(" ")}</p>
        </div>
      </div>
      <div className="mt-6"><PayNow booking={b} mobile={b.mobile} onPaid={(ps) => setB({ ...b, paymentStatus: ps })} /></div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button href={waLink(`Hello, I booked a cab. Ref: ${b.ref}. ${b.pickup}${b.drop ? " to " + b.drop : ""} on ${new Date(b.pickupAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}.`)} variant="dark">Message us on WhatsApp</Button>
        <Button href="/track" variant="outline">Track booking</Button>
        <Link href="/" className="self-center text-sm underline">Back to home</Link>
      </div>
    </div></section>
  );
}
