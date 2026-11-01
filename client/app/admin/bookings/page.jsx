"use client";
import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { ErrorState } from "@/components/ui/States";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/admin/Modal";
import { PageTitle, Select, Table } from "@/components/admin/ui";
import { api } from "@/lib/api";
import { dateTime, inr } from "@/lib/format";
import { site } from "@/lib/siteConfig";

const NEXT = { pending: ["confirmed", "cancelled"], confirmed: ["driver_assigned", "cancelled"], driver_assigned: ["in_progress", "cancelled"], in_progress: ["completed"], completed: [], cancelled: [] };
const L = { pending: "Pending", confirmed: "Confirmed", driver_assigned: "Driver assigned", in_progress: "In progress", completed: "Completed", cancelled: "Cancelled" };
const LIMIT = 20;

export default function AdminBookings() {
  const [q, setQ] = useState(""), [status, setStatus] = useState(""), [page, setPage] = useState(1);
  const [s, setS] = useState({ loading: true, error: null, rows: [], total: 0 });
  const [msg, setMsg] = useState(null);
  const [assign, setAssign] = useState(null); // booking awaiting a driver
  const [drivers, setDrivers] = useState([]); const [driver, setDriver] = useState("");
  const [edit, setEdit] = useState(null); const [form, setForm] = useState({}); const [save, setSave] = useState({ loading: false, error: null });

  const load = useCallback(() => {
    api(`/bookings?page=${page}&limit=${LIMIT}${status ? `&status=${status}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`)
      .then((d) => setS({ loading: false, error: null, rows: d.bookings, total: d.total })).catch((e) => setS({ loading: false, error: e.message, rows: [], total: 0 }));
  }, [page, status, q]);
  useEffect(() => { const t = setTimeout(load, q ? 300 : 0); return () => clearTimeout(t); }, [load, q]);

  async function setStatusTo(b, next) {
    setMsg(null);
    if (next === "driver_assigned") {
      try { const d = await api("/drivers?all=true"); setDrivers(d.drivers.filter((x) => x.available && x.isActive)); setDriver(""); setAssign(b); } catch (e) { setMsg(e.message); }
      return;
    }
    try { await api(`/bookings/${b._id}/status`, { method: "PATCH", body: { status: next } }); load(); } catch (e) { setMsg(e.message); }
  }
  async function confirmAssign() {
    try { await api(`/bookings/${assign._id}/status`, { method: "PATCH", body: { status: "driver_assigned", driver } }); setAssign(null); load(); } catch (e) { setMsg(e.message); setAssign(null); }
  }
  async function remove(b) {
    if (!window.confirm(`Delete booking ${b.ref}? This cannot be undone.`)) return;
    try { await api(`/bookings/${b._id}`, { method: "DELETE" }); load(); } catch (e) { setMsg(e.message); }
  }
  const openEdit = (b) => { setEdit(b); setForm({ customerName: b.customerName, customerMobile: b.customerMobile, pickup: b.pickup, drop: b.drop || "", passengers: b.passengers, notes: b.notes || "", paymentStatus: b.paymentStatus }); setSave({ loading: false, error: null }); };
  async function submitEdit(e) {
    e.preventDefault(); setSave({ loading: true, error: null });
    try { await api(`/bookings/${edit._id}`, { method: "PUT", body: { ...form, passengers: Number(form.passengers) } }); setEdit(null); load(); } catch (err) { setSave({ loading: false, error: err.message }); }
  }
  const f = (k) => ({ id: `e-${k}`, value: form[k], onChange: (e) => setForm({ ...form, [k]: e.target.value }) });

  return (
    <>
      <PageTitle title="Bookings"><Button href="/booking">Create booking</Button></PageTitle>
      <div className="mb-4 flex flex-wrap gap-3">
        <input aria-label="Search bookings" placeholder="Search ref, name or mobile" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="w-64 rounded-lg border border-line px-3 py-2 text-sm" />
        <Select label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} options={[["", "All statuses"], ...Object.entries(L)]} className="!py-2" />
      </div>
      {msg && <div className="mb-4"><ErrorState message={msg} /></div>}
      <Table loading={s.loading} error={s.error} rows={s.rows} empty="No bookings found" cols={[
        { label: "Ref", render: (b) => <span className="font-medium">{b.ref}</span> },
        { label: "Customer", render: (b) => <>{b.customerName}<br /><a href={`tel:${b.customerMobile}`} className="text-xs text-ink-soft underline">{b.customerMobile}</a> · <a href={`https://wa.me/91${b.customerMobile}?text=${encodeURIComponent(`Hello ${b.customerName}, this is ${site.name} about your booking ${b.ref}.`)}`} target="_blank" rel="noopener noreferrer" className="text-xs text-ink-soft underline">WhatsApp</a></> },
        { label: "Trip", render: (b) => <>{b.pickup}{b.drop ? ` → ${b.drop}` : ""}<br /><span className="text-xs text-ink-soft">{dateTime(b.pickupAt)} · {b.vehicle?.name}</span></> },
        { label: "Fare", render: (b) => <>{inr(b.fare?.total)}<br /><span className="text-xs capitalize text-ink-soft">{b.paymentStatus}</span></> },
        { label: "Driver", render: (b) => b.driver?.name || "-" },
        { label: "Status", render: (b) => (
          <div className="space-y-1"><StatusBadge status={b.status} />
            {NEXT[b.status].length > 0 && <Select label={`Change status of ${b.ref}`} value="" onChange={(e) => e.target.value && setStatusTo(b, e.target.value)} options={[["", "Change…"], ...NEXT[b.status].map((n) => [n, L[n]])]} className="block" />}
          </div>) },
        { label: "Actions", render: (b) => <div className="flex gap-3"><button onClick={() => openEdit(b)} aria-label={`Edit ${b.ref}`}><Pencil className="h-4 w-4" /></button><button onClick={() => remove(b)} aria-label={`Delete ${b.ref}`} className="text-red-600"><Trash2 className="h-4 w-4" /></button></div> },
      ]} />
      {s.total > LIMIT && <div className="mt-4 flex items-center justify-between text-sm"><Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button><span>Page {page} of {Math.ceil(s.total / LIMIT)}</span><Button variant="outline" disabled={page * LIMIT >= s.total} onClick={() => setPage(page + 1)}>Next</Button></div>}

      {assign && (
        <Modal title={`Assign driver to ${assign.ref}`} onClose={() => setAssign(null)}>
          {drivers.length === 0 ? <p className="text-sm text-ink-soft">No available drivers. Add a driver or mark one as available in Drivers.</p> : (
            <div className="space-y-4"><Select label="Driver" value={driver} onChange={(e) => setDriver(e.target.value)} options={[["", "Select driver"], ...drivers.map((d) => [d._id, `${d.name} (${d.mobile})`])]} className="w-full !py-2.5" /><Button onClick={confirmAssign} disabled={!driver}>Assign driver</Button></div>)}
        </Modal>
      )}
      {edit && (
        <Modal title={`Edit ${edit.ref}`} onClose={() => setEdit(null)}>
          <form onSubmit={submitEdit} className="space-y-4">
            <Input label="Customer name" {...f("customerName")} /><Input label="Mobile" type="tel" {...f("customerMobile")} />
            <Input label="Pickup" {...f("pickup")} /><Input label="Drop" {...f("drop")} /><Input label="Passengers" type="number" min="1" {...f("passengers")} /><Input label="Notes" {...f("notes")} />
            <div><label htmlFor="e-pay" className="mb-1 block text-xs font-medium text-ink-soft">Payment status</label><Select label="Payment status" value={form.paymentStatus} onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })} options={[["unpaid", "Unpaid"], ["partial", "Partial"], ["paid", "Paid"], ["refunded", "Refunded"]]} className="w-full !py-2.5" /></div>
            <p className="text-xs text-ink-soft">Editing details does not recalculate the fare saved with the booking.</p>
            {save.error && <ErrorState message={save.error} />}
            <div className="flex gap-3"><Button type="submit" loading={save.loading}>Save</Button><Button type="button" variant="outline" onClick={() => setEdit(null)}>Cancel</Button></div>
          </form>
        </Modal>
      )}
    </>
  );
}
