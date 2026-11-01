import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock3, Route } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/ui/Button";
import JsonLd from "@/components/JsonLd";
import { Cta } from "@/components/home/Static";
import { safeFetch } from "@/lib/api";
import { destinations, site, waLink } from "@/lib/siteConfig";

export const revalidate = 300;
export const dynamicParams = false;
export const generateStaticParams = () => destinations.map((d) => ({ slug: d.slug }));
const find = (slug) => destinations.find((d) => d.slug === slug);

export async function generateMetadata({ params }) {
  const d = find((await params).slug);
  return {
    title: `${d.title} | Fare, Distance & Booking`,
    description: `Book a taxi from Indore to ${d.to}: about ${d.km} km, around ${d.time}. Choose your car, see the estimated fare and confirm online.`,
    alternates: { canonical: `/routes/${d.slug}` },
    openGraph: { title: d.title, description: d.blurb, url: `/routes/${d.slug}` },
  };
}

export default async function RoutePage({ params }) {
  const d = find((await params).slug);
  if (!d) notFound();
  const { data } = await safeFetch(`/packages/${d.slug.replace(/-(cab|taxi)$/, "")}`); // e.g. indore-to-ujjain package, if published
  const pkg = data?.package;
  const book = `/booking?pickup=Indore&drop=${encodeURIComponent(d.to)}&tripType=one-way`;
  const others = destinations.filter((x) => x.slug !== d.slug);
  return (
    <>
      <PageHeader title={d.title} sub={`Taxi from Indore to ${d.to}, with an estimated fare before you confirm.`} />
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <p className="leading-relaxed text-ink-soft">{d.blurb}</p>
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-card bg-muted p-4"><dt className="flex items-center gap-1 text-xs text-ink-soft"><Route className="h-3.5 w-3.5" aria-hidden />Distance</dt><dd className="mt-1 font-heading font-semibold">~{d.km} km</dd></div>
              <div className="rounded-card bg-muted p-4"><dt className="flex items-center gap-1 text-xs text-ink-soft"><Clock3 className="h-3.5 w-3.5" aria-hidden />Travel time</dt><dd className="mt-1 font-heading font-semibold">~{d.time}</dd></div>
              {pkg && <div className="rounded-card bg-muted p-4"><dt className="text-xs text-ink-soft">Package from</dt><dd className="mt-1 font-heading font-semibold">₹{Number(pkg.price).toLocaleString("en-IN")}</dd></div>}
            </dl>
            <p className="text-sm text-ink-soft">Distance and time are approximate and depend on traffic and your exact pickup point. Tolls and parking are not included in estimates.</p>
            <div>
              <h2 className="text-xl font-semibold">Other popular routes from Indore</h2>
              <ul className="mt-3 flex flex-wrap gap-2">{others.map((o) => <li key={o.slug}><Link href={`/routes/${o.slug}`} className="inline-block rounded-full border border-line px-4 py-2 text-sm hover:bg-muted">{o.title}</Link></li>)}</ul>
              <p className="mt-4 text-sm text-ink-soft">See all <Link href="/packages" className="underline">tour packages</Link>, our <Link href="/fleet" className="underline">fleet</Link> or <Link href="/outstation-taxi" className="underline">outstation taxi service</Link>.</p>
            </div>
          </div>
          <aside className="h-fit rounded-card border border-line p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold">Book this trip</h2>
            <div className="mt-4 flex flex-col gap-3">
              <Button href={book}>Get fare and book</Button>
              <Button href={site.telHref} variant="outline">Call now</Button>
              <Button href={waLink(`Hello, I want a cab from Indore to ${d.to}.`)} variant="dark">WhatsApp us</Button>
            </div>
          </aside>
        </div>
      </section>
      <Cta />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url }, { "@type": "ListItem", position: 2, name: "Outstation taxi", item: `${site.url}/outstation-taxi` }, { "@type": "ListItem", position: 3, name: d.title, item: `${site.url}/routes/${d.slug}` }] }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", name: d.title, serviceType: "Taxi service", areaServed: ["Indore", d.to], provider: { "@type": "TaxiService", name: site.name, telephone: site.phone, url: site.url } }} />
    </>
  );
}
