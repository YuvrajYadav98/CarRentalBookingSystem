"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import { api } from "@/lib/api";
import { date, inr } from "@/lib/format";

export default function Payments() {
  const [s, setS] = useState({ loading: true, error: null, list: [] });
  useEffect(() => { api("/payments/history").then((d) => setS({ loading: false, error: null, list: d.payments })).catch((e) => setS({ loading: false, error: e.message, list: [] })); }, []);

  if (s.loading) return <Skeleton className="h-40" />;
  if (s.error) return <ErrorState message={s.error} />;
  if (!s.list.length) return <EmptyState title="No payments yet" text="Payments made online will be listed here with their booking reference." />;
  return (
    <div className="overflow-x-auto rounded-card border border-line">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead className="bg-muted text-xs text-ink-soft"><tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Booking</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Amount</th></tr></thead>
        <tbody className="divide-y divide-line">
          {s.list.map((p) => (
            <tr key={p._id}>
              <td className="px-4 py-3">{date(p.createdAt)}</td>
              <td className="px-4 py-3">{p.booking?.ref ? <Link href={`/dashboard/bookings/${p.booking.ref}`} className="underline">{p.booking.ref}</Link> : "-"}</td>
              <td className="px-4 py-3 capitalize">{p.status}</td>
              <td className="px-4 py-3 text-right font-medium">{inr(p.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
