import { Skeleton, ErrorState, EmptyState } from "@/components/ui/States";

export const PageTitle = ({ title, children }) => <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-semibold">{title}</h1><div className="flex gap-2">{children}</div></div>;

export function Table({ cols, rows, loading, error, empty, rowKey = (r) => r._id }) {
  if (loading) return <Skeleton className="h-48" />;
  if (error) return <ErrorState message={error} />;
  if (!rows.length) return <EmptyState title={empty || "Nothing here yet"} />;
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-muted text-xs text-ink-soft"><tr>{cols.map((c) => <th key={c.label} className="px-4 py-3 font-medium">{c.label}</th>)}</tr></thead>
        <tbody className="divide-y divide-line">{rows.map((r) => <tr key={rowKey(r)}>{cols.map((c) => <td key={c.label} className="px-4 py-3 align-top">{c.render ? c.render(r) : r[c.key]}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export const Select = ({ value, onChange, options, label, className = "" }) => (
  <select aria-label={label} value={value} onChange={onChange} className={`rounded-lg border border-line bg-white px-2 py-1.5 text-sm ${className}`}>{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
);

export const Chip = ({ ok, yes = "Yes", no = "No" }) => <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ok ? "bg-green-100 text-green-800" : "bg-muted text-ink-soft"}`}>{ok ? yes : no}</span>;
