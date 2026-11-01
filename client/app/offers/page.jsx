import PageHeader from "@/components/PageHeader";
import Button from "@/components/ui/Button";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { safeFetch } from "@/lib/api";
import { date, inr } from "@/lib/format";

export const revalidate = 300;
export const metadata = { title: "Offers and Discounts", description: "Current discount coupons for cab bookings in Indore.", alternates: { canonical: "/offers" } };

export default async function Offers() {
  const { data, error } = await safeFetch("/offers");
  const list = data?.offers || [];
  return (
    <>
      <PageHeader title="Offers" sub="Enter a coupon code in the booking form to apply it." />
      <section className="section"><div className="container-x">
        {error ? <ErrorState message={error} /> : list.length === 0 ? <EmptyState title="No offers right now" text="Check back soon." action={<Button href="/booking" variant="dark">Book a cab</Button>} /> : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((o) => (
              <article key={o.code} className="rounded-card border border-dashed border-accent-600 p-6">
                <p className="font-heading text-2xl font-bold">{o.type === "percent" ? `${o.value}% off` : `${inr(o.value)} off`}</p>
                <p className="mt-2 inline-block rounded bg-muted px-3 py-1 font-mono text-sm">{o.code}</p>
                <ul className="mt-3 space-y-1 text-sm text-ink-soft">
                  {o.minAmount > 0 && <li>On bookings of {inr(o.minAmount)} or more</li>}
                  {o.maxDiscount != null && <li>Up to {inr(o.maxDiscount)} off</li>}
                  <li>{o.expiresAt ? `Valid until ${date(o.expiresAt)}` : "No expiry date"}</li>
                </ul>
              </article>
            ))}
          </div>
        )}
      </div></section>
    </>
  );
}
