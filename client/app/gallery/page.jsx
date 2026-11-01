import PageHeader from "@/components/PageHeader";
import Image from "@/components/ui/SafeImage";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { safeFetch } from "@/lib/api";

export const revalidate = 300;
export const metadata = { title: "Gallery", description: "Photos of our cars and trips from Indore.", alternates: { canonical: "/gallery" } };

export default async function Gallery() {
  const { data, error } = await safeFetch("/settings/public");
  const list = data?.gallery || [];
  return (
    <>
      <PageHeader title="Gallery" />
      <section className="section"><div className="container-x">
        {error ? <ErrorState message={error} /> : list.length === 0 ? <EmptyState title="Photos coming soon" text="Photos added from the admin dashboard appear here." /> : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((g, i) => (
              <li key={g.url} className="overflow-hidden rounded-card border border-line">
                <div className="relative aspect-[4/3] bg-muted"><Image src={g.url} alt={g.caption || `${"Cab service photo"} ${i + 1}`} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover" loading="lazy" /></div>
                {g.caption && <p className="p-3 text-sm text-ink-soft">{g.caption}</p>}
              </li>
            ))}
          </ul>
        )}
      </div></section>
    </>
  );
}
