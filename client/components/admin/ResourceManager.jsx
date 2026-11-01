"use client";
import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { ErrorState } from "@/components/ui/States";
import Modal from "./Modal";
import { PageTitle, Table } from "./ui";
import { api } from "@/lib/api";

const toForm = (fields, doc = {}) => Object.fromEntries(fields.map((f) => {
  const v = doc[f.name];
  if (f.type === "checkbox") return [f.name, v ?? f.default ?? true];
  if (f.type === "list") return [f.name, (v || []).join("\n")];
  if (f.type === "date") return [f.name, v ? String(v).slice(0, 10) : ""];
  return [f.name, v ?? f.default ?? ""];
}));

function toPayload(fields, form) {
  const out = {};
  for (const f of fields) {
    const v = form[f.name];
    if (f.type === "checkbox") out[f.name] = !!v;
    else if (f.type === "list") out[f.name] = v.split("\n").map((x) => x.trim()).filter(Boolean);
    else if (v === "" || v == null) { if (f.required) out[f.name] = v; }
    else out[f.name] = f.type === "number" ? Number(v) : v;
  }
  return out;
}

export function ImageField({ value, onChange, id = "img-url" }) {
  const [state, setState] = useState({ loading: false, error: null });
  async function pick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setState({ loading: true, error: null });
    const fd = new FormData(); fd.append("image", file);
    try {
      const res = await fetch("/api/uploads", { method: "POST", body: fd, credentials: "include" });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.message || "Upload failed.");
      onChange(d.url); setState({ loading: false, error: null });
    } catch (err) { setState({ loading: false, error: err.message }); }
  }
  return (
    <div className="space-y-2">
      <Input id={id} label="Image link (https)" value={value} onChange={(e) => onChange(e.target.value)} />
      <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-navy-900 underline">
        <Upload className="h-4 w-4" aria-hidden />{state.loading ? "Uploading…" : "Upload image"}
        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={pick} />
      </label>
      {state.error && <p role="alert" className="text-xs text-red-600">{state.error}</p>}
      {value && <img src={value} alt="Preview" className="h-24 rounded-lg border border-line object-cover" />}
    </div>
  );
}

export default function ResourceManager({ title, endpoint, plural, noun, fields, columns, empty }) {
  const [s, setS] = useState({ loading: true, error: null, rows: [] });
  const [edit, setEdit] = useState(null); // null | {} (new) | doc
  const [form, setForm] = useState({});
  const [save, setSave] = useState({ loading: false, error: null });

  const load = useCallback(() => {
    api(`${endpoint}?all=true`).then((d) => setS({ loading: false, error: null, rows: d[plural] })).catch((e) => setS({ loading: false, error: e.message, rows: [] }));
  }, [endpoint, plural]);
  useEffect(load, [load]);

  const open = (doc = {}) => { setEdit(doc); setForm(toForm(fields, doc)); setSave({ loading: false, error: null }); };
  async function submit(e) {
    e.preventDefault();
    setSave({ loading: true, error: null });
    try {
      await api(edit._id ? `${endpoint}/${edit._id}` : endpoint, { method: edit._id ? "PUT" : "POST", body: toPayload(fields, form) });
      setEdit(null); load();
    } catch (err) { setSave({ loading: false, error: err.message }); }
  }
  async function remove(doc) {
    if (!window.confirm(`Delete this ${noun}? This cannot be undone.`)) return;
    try { await api(`${endpoint}/${doc._id}`, { method: "DELETE" }); load(); } catch (err) { setS((x) => ({ ...x, error: err.message })); }
  }
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  return (
    <>
      <PageTitle title={title}><Button onClick={() => open()}><Plus className="h-4 w-4" aria-hidden />Add {noun}</Button></PageTitle>
      <Table loading={s.loading} error={s.error} rows={s.rows} empty={empty}
        cols={[...columns, { label: "Actions", render: (r) => (
          <div className="flex gap-3"><button onClick={() => open(r)} aria-label={`Edit ${noun}`} className="text-navy-900"><Pencil className="h-4 w-4" /></button><button onClick={() => remove(r)} aria-label={`Delete ${noun}`} className="text-red-600"><Trash2 className="h-4 w-4" /></button></div>) }]} />
      {edit && (
        <Modal title={`${edit._id ? "Edit" : "Add"} ${noun}`} onClose={() => setEdit(null)}>
          <form onSubmit={submit} className="space-y-4">
            {fields.map((f) => f.type === "checkbox" ? (
              <label key={f.name} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form[f.name]} onChange={set(f.name)} />{f.label}</label>
            ) : f.type === "image" ? <ImageField key={f.name} value={form[f.name]} onChange={(v) => setForm({ ...form, [f.name]: v })} />
            : f.type === "textarea" || f.type === "list" ? (
              <Field key={f.name} id={f.name} label={f.label + (f.type === "list" ? " (one per line)" : "")}><textarea id={f.name} rows={f.type === "list" ? 4 : 3} value={form[f.name]} onChange={set(f.name)} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm" /></Field>
            ) : f.type === "select" ? (
              <Field key={f.name} id={f.name} label={f.label}><select id={f.name} value={form[f.name]} onChange={set(f.name)} className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm">{f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
            ) : <Input key={f.name} id={f.name} label={f.label} type={f.type || "text"} step={f.type === "number" ? "any" : undefined} required={f.required} value={form[f.name]} onChange={set(f.name)} />)}
            {save.error && <ErrorState message={save.error} />}
            <div className="flex gap-3"><Button type="submit" loading={save.loading}>Save</Button><Button type="button" variant="outline" onClick={() => setEdit(null)}>Cancel</Button></div>
          </form>
        </Modal>
      )}
    </>
  );
}
