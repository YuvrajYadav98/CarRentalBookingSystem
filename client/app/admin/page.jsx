"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import Button from "@/components/ui/Button";
import { ErrorState, Skeleton } from "@/components/ui/States";
import StatusBadge from "@/components/StatusBadge";
import { PageTitle, Table } from "@/components/admin/ui";
import { api } from "@/lib/api";
import { dateTime, inr } from "@/lib/format";

export default function Overview() {
  const [s, setS] = useState({ loading: true, error: null, stats: null, recent: [], notes: [], unread: 0 });
  const load = () => Promise.all([api("/admin/stats"), api("/bookings?limit=6"), api("/admin/notifications")])
    .then(([st, b, n]) => setS({ loading: false, error: null, stats: st, recent: b.bookings, notes: n.notifications, unread: n.unread }))
    .catch((e) => setS((x) => ({ ...x, loading: false, error: e.message })));
  useEffect(() => { load(); }, []);

  if (s.loading) return <Skeleton className="h-64" />;
  if (s.error) return <ErrorState message={s.error} />;
  const c = s.stats.counts;
  const cards = [["Total bookings", s.stats.total], ["Pending", c.pending || 0], ["Confirmed", c.confirmed || 0], ["Completed", c.completed || 0], ["Cancelled", c.cancelled || 0], ["Customers", s.stats.customers], ["Revenue (completed trips)", inr(s.stats.revenue)]];
  return (
    <>
      <PageTitle title="Overview"><Button href="/booking">Create booking</Button></PageTitle>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([k, v]) => <div key={k} className="rounded-card bg-white p-5 shadow-card"><p className="text-xs text-ink-soft">{k}</p><p className="mt-1 font-heading text-2xl font-semibold">{v}</p></div>)}
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <h2 className="mb-3 font-heading text-lg font-semibold">Recent bookings</h2>
          <Table rows={s.recent} empty="No bookings yet" cols={[
            { label: "Ref", render: (b) => <Link href="/admin/bookings" className="font-medium underline">{b.ref}</Link> },
            { label: "Customer", render: (b) => b.customerName },
            { label: "Pickup", render: (b) => dateTime(b.pickupAt) },
            { label: "Status", render: (b) => <StatusBadge status={b.status} /> }]} />
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between"><h2 className="flex items-center gap-2 font-heading text-lg font-semibold"><Bell className="h-4 w-4" aria-hidden />Notifications{s.unread > 0 && <span className="rounded-full bg-accent-500 px-2 text-xs">{s.unread}</span>}</h2>
            {s.unread > 0 && <button className="text-xs underline" onClick={async () => { await api("/admin/notifications/read", { method: "PATCH" }); load(); }}>Mark all read</button>}</div>
          <ul className="space-y-2">{s.notes.length === 0 ? <li className="text-sm text-ink-soft">No notifications yet.</li> : s.notes.map((n) => <li key={n._id} className={`rounded-lg bg-white p-3 text-sm ${n.read ? "text-ink-soft" : "border-l-4 border-accent-500"}`}><p className="font-medium">{n.title}</p><p className="text-xs">{n.message}</p></li>)}</ul>
        </div>
      </div>
    </>
  );
}
