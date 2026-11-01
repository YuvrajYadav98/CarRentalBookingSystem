const map = {
  pending: ["Pending", "bg-amber-100 text-amber-800"], confirmed: ["Confirmed", "bg-blue-100 text-blue-800"],
  driver_assigned: ["Driver assigned", "bg-indigo-100 text-indigo-800"], in_progress: ["In progress", "bg-sky-100 text-sky-800"],
  completed: ["Completed", "bg-green-100 text-green-800"], cancelled: ["Cancelled", "bg-red-100 text-red-800"],
};
export default function StatusBadge({ status }) {
  const [label, cls] = map[status] || [status, "bg-muted text-ink"];
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${cls}`}>{label}</span>;
}
