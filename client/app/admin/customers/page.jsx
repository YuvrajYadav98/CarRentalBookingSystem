"use client";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/admin/Modal";
import { PageTitle, Table } from "@/components/admin/ui";
import { api } from "@/lib/api";
import { date, dateTime, inr } from "@/lib/format";

export default function Customers() {
  const [q, setQ] = useState(""), [page, setPage] = useState(1);
  const [s, setS] = useState({ loading: true, error: null, rows: [], total: 0 });
  const [hist, setHist] = useState(null); // { customer, loading, error, rows }

  useEffect(() => {
    const t = setTimeout(() => api(`/admin/customers?page=${page}${q ? `&q=${encodeURIComponent(q)}` : ""}`).then((d) => setS({ loading: false, error: null, rows: d.customers, total: d.total })).catch((e) => setS({ loading: false, error: e.message, rows: [], total: 0 })), q ? 300 : 0);
    return () => clearTimeout(t);
  }, [q, page]);

  async function open(c) {
    setHist({ customer: c, loading: true, error: null, rows: [] });
    try { setHist({ customer: c, loading: false, error: null, rows: (await api(`/admin/customers/${c._id}/bookings`)).bookings }); } catch (e) { setHist({ customer: c, loading: false, error: e.message, rows: [] }); }
  }
  return (
    <>
      <PageTitle title="Customers" />
      <input aria-label="Search customers" placeholder="Search name, email or mobile" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="mb-4 w-72 rounded-lg border border-line px-3 py-2 text-sm" />
      <Table loading={s.loading} error={s.error} rows={s.rows} empty="No customers found" cols={[
        { label: "Name", render: (c) => <span className="font-medium">{c.name}</span> }, { label: "Email", key: "email" }, { label: "Mobile", key: "mobile" },
        { label: "Joined", render: (c) => date(c.createdAt) }, { label: "Bookings", key: "bookingCount" },
        { label: "History", render: (c) => <button className="text-sm underline" onClick={() => open(c)}>View</button> }]} />
      {s.total > 20 && <div className="mt-4 flex items-center justify-between text-sm"><Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button><span>Page {page} of {Math.ceil(s.total / 20)}</span><Button variant="outline" disabled={page * 20 >= s.total} onClick={() => setPage(page + 1)}>Next</Button></div>}
      {hist && (
        <Modal wide title={`${hist.customer.name}: booking history`} onClose={() => setHist(null)}>
          <Table loading={hist.loading} error={hist.error} rows={hist.rows} empty="No bookings yet" cols={[{ label: "Ref", key: "ref" }, { label: "Trip", render: (b) => `${b.pickup}${b.drop ? ` → ${b.drop}` : ""}` }, { label: "Date", render: (b) => dateTime(b.pickupAt) }, { label: "Fare", render: (b) => inr(b.fare?.total) }, { label: "Status", render: (b) => <StatusBadge status={b.status} /> }]} />
        </Modal>
      )}
    </>
  );
}
