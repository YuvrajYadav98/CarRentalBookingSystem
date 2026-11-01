"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { dateTime, inr } from "@/lib/format";

const FILTERS = [["", "All"], ["pending", "Pending"], ["confirmed", "Confirmed"], ["driver_assigned", "Driver assigned"], ["in_progress", "In progress"], ["completed", "Completed"], ["cancelled", "Cancelled"]];
const LIMIT = 10;

export default function Bookings() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [s, setS] = useState({ loading: true, error: null, list: [], total: 0 });

  useEffect(() => {
    setS((x) => ({ ...x, loading: true, error: null }));
    api(`/bookings?page=${page}&limit=${LIMIT}${status ? `&status=${status}` : ""}`)
      .then((d) => setS({ loading: false, error: null, list: d.bookings, total: d.total }))
      .catch((e) => setS({ loading: false, error: e.message, list: [], total: 0 }));
  }, [status, page]);

  return (
    <div>
      <label htmlFor="f" className="text-xs font-medium text-ink-soft">Filter by status</label>
      <select id="f" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="mt-1 block rounded-lg border border-line bg-white px-3 py-2 text-sm">
        {FILTERS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      <div className="mt-6 space-y-3">
        {s.loading ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-24" />)
          : s.error ? <ErrorState message={s.error} />
          : s.list.length === 0 ? <EmptyState title={status ? "No bookings with this status" : "No bookings yet"} text="Bookings you make while logged in appear here." action={<Button href="/booking" variant="dark">Book a cab</Button>} />
          : s.list.map((b) => (
            <Link key={b._id} href={`/dashboard/bookings/${b.ref}`} className="block rounded-card border border-line p-5 hover:bg-muted">
              <div className="flex items-center justify-between gap-3"><p className="font-heading font-semibold">{b.ref}</p><StatusBadge status={b.status} /></div>
              <p className="mt-2 text-sm">{b.pickup}{b.drop ? ` to ${b.drop}` : ""}</p>
              <p className="mt-1 flex justify-between text-sm text-ink-soft"><span>{dateTime(b.pickupAt)} · {b.vehicle?.name}</span><span className="font-medium text-ink">{inr(b.fare?.total)}</span></p>
            </Link>
          ))}
      </div>
      {s.total > LIMIT && (
        <div className="mt-6 flex items-center justify-between text-sm">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <span className="text-ink-soft">Page {page} of {Math.ceil(s.total / LIMIT)}</span>
          <Button variant="outline" disabled={page * LIMIT >= s.total} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
