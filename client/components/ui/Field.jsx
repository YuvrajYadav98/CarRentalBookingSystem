const base = "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft/70";

export function Field({ label, error, id, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-ink-soft">{label}</label>
      {children}
      {error && <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Input({ label, error, id, ...p }) {
  return (
    <Field label={label} error={error} id={id}>
      <input id={id} aria-invalid={!!error} className={`${base} ${error ? "border-red-500" : "border-line"}`} {...p} />
    </Field>
  );
}

export function Select({ label, error, id, options, placeholder, ...p }) {
  return (
    <Field label={label} error={error} id={id}>
      <select id={id} aria-invalid={!!error} className={`${base} ${error ? "border-red-500" : "border-line"}`} {...p}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Field>
  );
}
