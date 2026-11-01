import { Star } from "lucide-react";
import Button from "@/components/ui/Button";
import { EmptyState, ErrorState } from "@/components/ui/States";
import VehicleCard from "@/components/cards/VehicleCard";
import PackageCard from "@/components/cards/PackageCard";
import { safeFetch } from "@/lib/api";
import { Section } from "./Static";

export async function Fleet() {
  const { data, error } = await safeFetch("/vehicles");
  const list = data?.vehicles || [];
  return (
    <Section title="Our fleet" sub="Rates are set by the company and shown as they are today.">
      {error ? <ErrorState message={error} /> : list.length === 0 ? (
        <EmptyState title="Fleet details are coming soon" text="Vehicles appear here once added from the admin dashboard." action={<Button href="/contact" variant="dark">Contact us for rates</Button>} />
      ) : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.slice(0, 6).map((v) => <VehicleCard key={v._id} v={v} />)}</div>}
    </Section>
  );
}

export async function Packages() {
  const { data, error } = await safeFetch("/packages");
  const list = data?.packages || [];
  return (
    <Section title="Tour packages" muted>
      {error ? <ErrorState message={error} /> : list.length === 0 ? (
        <EmptyState title="No packages published yet" text="Packages appear here once added by the company." action={<Button href="/contact" variant="dark">Ask about a custom package</Button>} />
      ) : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.slice(0, 6).map((p) => <PackageCard key={p._id} p={p} />)}</div>}
      {list.length > 0 && <div className="mt-8"><Button href="/packages" variant="dark">View all packages</Button></div>}
    </Section>
  );
}

export async function Testimonials() {
  const { data, error } = await safeFetch("/reviews");
  const list = (data?.reviews || []).slice(0, 6);
  return (
    <Section title="What our customers say">
      {error ? <ErrorState message={error} /> : list.length === 0 ? (
        <EmptyState title="No reviews yet" text="Reviews appear here after the company approves them." />
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {list.map((r) => (
            <figure key={r._id} className="rounded-card border border-line p-6">
              <div className="flex gap-0.5 text-accent-500" role="img" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" aria-hidden />)}
              </div>
              <blockquote className="mt-3 text-sm">{r.comment}</blockquote>
              <figcaption className="mt-4 text-xs text-ink-soft">{r.name} · {new Date(r.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </Section>
  );
}
