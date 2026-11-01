import Image from "@/components/ui/SafeImage";
import { notFound } from "next/navigation";
import { Check, X } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/States";
import { safeFetch } from "@/lib/api";
import { site, waLink } from "@/lib/siteConfig";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data } = await safeFetch(`/packages/${slug}`);
  const p = data?.package;
  return p ? { title: `${p.name} Taxi Package`, description: (p.description || "").slice(0, 155), alternates: { canonical: `/packages/${slug}` } } : { title: "Package" };
}

const List = ({ items, icon: Icon, color }) => (
  <ul className="space-y-2 text-sm">{items.map((i) => <li key={i} className="flex gap-2"><Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} aria-hidden />{i}</li>)}</ul>
);

export default async function PackageDetail({ params }) {
  const { slug } = await params;
  const { data, error } = await safeFetch(`/packages/${slug}`);
  if (error) return <section className="section"><div className="container-x"><ErrorState message={error} /></div></section>;
  const p = data?.package;
  if (!p) notFound();
  const facts = [["Starting price", `₹${Number(p.price).toLocaleString("en-IN")}`], ["Distance", p.distance && `${p.distance} km`], ["Travel time", p.travelTime], ["Duration", p.duration]].filter((f) => f[1]);
  return (
    <>
      <PageHeader title={p.name} sub={p.description} />
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {p.image && <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-muted"><Image src={p.image} alt={`${p.name} destination`} fill priority sizes="(min-width:1024px) 66vw, 100vw" className="object-cover" /></div>}
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {facts.map(([k, v]) => <div key={k} className="rounded-card bg-muted p-4"><dt className="text-xs text-ink-soft">{k}</dt><dd className="mt-1 font-heading font-semibold">{v}</dd></div>)}
            </dl>
            {p.vehicleOptions?.length > 0 && <div><h2 className="text-xl font-semibold">Vehicle options</h2><p className="mt-2 text-sm text-ink-soft">{p.vehicleOptions.join(", ")}</p></div>}
            <div className="grid gap-8 sm:grid-cols-2">
              {p.included?.length > 0 && <div><h2 className="mb-3 text-xl font-semibold">Included</h2><List items={p.included} icon={Check} color="text-green-600" /></div>}
              {p.excluded?.length > 0 && <div><h2 className="mb-3 text-xl font-semibold">Not included</h2><List items={p.excluded} icon={X} color="text-red-600" /></div>}
            </div>
          </div>
          <aside className="h-fit rounded-card border border-line p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold">Book this package</h2>
            <p className="mt-2 text-sm text-ink-soft">Listed price is a starting price. Final charges depend on vehicle and trip details.</p>
            <div className="mt-4 flex flex-col gap-3">
              <Button href={`/booking?package=${p._id}`}>Book now</Button>
              <Button href={site.telHref} variant="outline">Call now</Button>
              <Button href={waLink(`Hello, I want to book the "${p.name}" package.`)} variant="dark">WhatsApp us</Button>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
