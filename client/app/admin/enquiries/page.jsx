"use client";
import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import { PageTitle, Select } from "@/components/admin/ui";
import { api } from "@/lib/api";
import { dateTime } from "@/lib/format";
import { waLink } from "@/lib/siteConfig";

const ST = [["new", "New"], ["in_progress", "In progress"], ["resolved", "Resolved"]];

function Card({ e, onSaved }) {
  const [status, setStatus] = useState(e.status), [note, setNote] = useState(e.adminNote || "");
  const [s, setS] = useState({ loading: false, msg: null });
  async function save() {
    setS({ loading: true, msg: null });
    try { await api(`/enquiries/${e._id}`, { method: "PATCH", body: { status, adminNote: note } }); setS({ loading: false, msg: "Saved" }); onSaved(); } catch (err) { setS({ loading: false, msg: err.message }); }
  }
  const wa = `https://wa.me/91${e.mobile}?text=${encodeURIComponent(`Hello ${e.name}, thank you for contacting us.`)}`;
  return (
    <article className="rounded-card border border-line bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-heading font-semibold">{e.name}</p><span className="text-xs text-ink-soft">{dateTime(e.createdAt)}</span></div>
      <p className="mt-2 whitespace-pre-line text-sm">{e.message}</p>
      <div className="mt-3 flex flex-wrap gap-3 text-sm">
        <a className="underline" href={`tel:${e.mobile}`}>Call {e.mobile}</a><a className="underline" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>{e.email && <a className="underline" href={`mailto:${e.email}`}>Email</a>}
      </div>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <Select label="Status" value={status} onChange={(x) => setStatus(x.target.value)} options={ST} className="!py-2" />
        <input aria-label="Internal note" placeholder="Internal note" value={note} onChange={(x) => setNote(x.target.value)} className="min-w-[200px] flex-1 rounded-lg border border-line px-3 py-2 text-sm" />
        <Button variant="dark" className="!py-2" loading={s.loading} onClick={save}>Save</Button><span className="text-xs text-ink-soft">{s.msg}</span>
      </div>
    </article>
  );
}

export default function Enquiries() {
  const [filter, setFilter] = useState("");
  const [s, setS] = useState({ loading: true, error: null, rows: [] });
  const load = useCallback(() => { api(`/enquiries${filter ? `?status=${filter}` : ""}`).then((d) => setS({ loading: false, error: null, rows: d.enquiries })).catch((e) => setS({ loading: false, error: e.message, rows: [] })); }, [filter]);
  useEffect(load, [load]);
  return (
    <>
      <PageTitle title="Enquiries"><Select label="Filter" value={filter} onChange={(e) => setFilter(e.target.value)} options={[["", "All"], ...ST]} className="!py-2" /></PageTitle>
      <div className="space-y-4">{s.loading ? <Skeleton className="h-40" /> : s.error ? <ErrorState message={s.error} /> : s.rows.length === 0 ? <EmptyState title="No enquiries" /> : s.rows.map((e) => <Card key={e._id} e={e} onSaved={() => {}} />)}</div>
    </>
  );
}
