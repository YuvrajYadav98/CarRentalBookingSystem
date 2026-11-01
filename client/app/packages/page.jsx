import PageHeader from "@/components/PageHeader";
import PackageCard from "@/components/cards/PackageCard";
import Button from "@/components/ui/Button";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { safeFetch } from "@/lib/api";

export const revalidate = 300;
export const metadata = { title: "Tour Packages from Indore", description: "Taxi packages from Indore to Ujjain, Omkareshwar, Maheshwar, Mandu, Bhopal, Patalpani and local sightseeing.", alternates: { canonical: "/packages" } };

export default async function PackagesPage() {
  const { data, error } = await safeFetch("/packages");
  const list = data?.packages || [];
  return (
    <>
      <PageHeader title="Tour packages" sub="Starting prices, distance and travel time for popular trips from Indore." />
      <section className="section">
        <div className="container-x">
          {error ? <ErrorState message={error} /> : list.length === 0 ? (
            <EmptyState title="No packages published yet" action={<Button href="/contact" variant="dark">Ask about a custom package</Button>} />
          ) : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => <PackageCard key={p._id} p={p} />)}</div>}
        </div>
      </section>
    </>
  );
}
