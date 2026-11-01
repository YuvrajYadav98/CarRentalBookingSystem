"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Field } from "./Field";
import { api } from "@/lib/api";

// Text input with Google place suggestions (via our server). With no suggestions it behaves as a plain input.
export default function PlaceInput({ label, error, id, value, onChange, ...rest }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const justPicked = useRef(false);
  const listId = useId();

  useEffect(() => {
    if (justPicked.current) { justPicked.current = false; return; }
    if (value.trim().length < 3) { setItems([]); return; }
    const t = setTimeout(() => api(`/maps/autocomplete?q=${encodeURIComponent(value.trim())}`).then((d) => { setItems(d.suggestions || []); setOpen(true); setActive(-1); }).catch(() => setItems([])), 300);
    return () => clearTimeout(t);
  }, [value]);

  const pick = (v) => { justPicked.current = true; onChange({ target: { value: v } }); setOpen(false); setItems([]); };
  const onKey = (e) => {
    if (!open || !items.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % items.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a <= 0 ? items.length - 1 : a - 1)); }
    else if (e.key === "Enter" && active >= 0) { e.preventDefault(); pick(items[active]); }
    else if (e.key === "Escape") setOpen(false);
  };

  return (
    <Field label={label} error={error} id={id}>
      <div className="relative">
        <input id={id} role="combobox" aria-expanded={open && items.length > 0} aria-controls={listId} aria-autocomplete="list" autoComplete="off" aria-invalid={!!error}
          value={value} onChange={onChange} onKeyDown={onKey} onFocus={() => items.length && setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)}
          className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm ${error ? "border-red-500" : "border-line"}`} {...rest} />
        {open && items.length > 0 && (
          <ul id={listId} role="listbox" className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-line bg-white py-1 shadow-card">
            {items.map((it, i) => <li key={it} role="option" aria-selected={i === active} onMouseDown={(e) => { e.preventDefault(); pick(it); }} className={`cursor-pointer px-3 py-2 text-sm ${i === active ? "bg-muted" : ""}`}>{it}</li>)}
          </ul>
        )}
      </div>
    </Field>
  );
}
