"use client";
import { useCallback, useEffect, useState } from "react";
import { Star } from "lucide-react";
import Button from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/States";
import { Chip, PageTitle, Table } from "@/components/admin/ui";
import { api } from "@/lib/api";
import { date } from "@/lib/format";

export default function Reviews() {
  const [s, setS] = useState({ loading: true, error: null, rows: [] });
  const [msg, setMsg] = useState(null);
  const load = useCallback(() => { api("/reviews?all=true").then((d) => setS({ loading: false, error: null, rows: d.reviews })).catch((e) => setS({ loading: false, error: e.message, rows: [] })); }, []);
  useEffect(load, [load]);
  const act = (fn) => async () => { setMsg(null); try { await fn(); load(); } catch (e) { setMsg(e.message); } };

  return (
    <>
      <PageTitle title="Reviews" />
      {msg && <div className="mb-4"><ErrorState message={msg} /></div>}
      <Table loading={s.loading} error={s.error} rows={s.rows} empty="No reviews yet" cols={[
        { label: "Customer", render: (r) => <><span className="font-medium">{r.name}</span><br /><span className="text-xs text-ink-soft">{date(r.createdAt)}</span></> },
        { label: "Rating", render: (r) => <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-accent-500 text-accent-500" aria-hidden />{r.rating}</span> },
        { label: "Review", render: (r) => <p className="max-w-md">{r.comment}</p> },
        { label: "Status", render: (r) => <Chip ok={r.approved} yes="Approved" no="Pending" /> },
        { label: "Actions", render: (r) => (
          <div className="flex gap-2">
            {!r.approved && <Button className="!px-3 !py-1.5" onClick={act(() => api(`/reviews/${r._id}/approve`, { method: "PATCH" }))}>Approve</Button>}
            <Button variant="outline" className="!px-3 !py-1.5 !text-red-700" onClick={act(async () => { if (window.confirm("Delete this review?")) await api(`/reviews/${r._id}`, { method: "DELETE" }); })}>Delete</Button>
          </div>) }]} />
    </>
  );
}
