import { AlertCircle, Inbox } from "lucide-react";

export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-card bg-muted ${className}`} aria-hidden />;
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="rounded-card border border-dashed border-line bg-muted/50 px-6 py-10 text-center">
      <Inbox className="mx-auto h-8 w-8 text-ink-soft" aria-hidden />
      <p className="mt-3 font-heading font-semibold text-navy-900">{title}</p>
      {text && <p className="mx-auto mt-1 max-w-md text-sm text-ink-soft">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-card border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <p>{message}</p>
    </div>
  );
}
