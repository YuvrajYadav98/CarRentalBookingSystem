import PageHeader from "@/components/PageHeader";
import VehicleCard from "@/components/cards/VehicleCard";
import Button from "@/components/ui/Button";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { safeFetch } from "@/lib/api";

export const revalidate = 300;
export const metadata = { title: "Our Fleet: Cars for Hire in Indore", description: "Swift Dzire, Ertiga, Innova Crysta, Innova Hycross and more. Compare seats, luggage space and price per km.", alternates: { canonical: "/fleet" } };

export default async function FleetPage() {
  const { data, error } = await safeFetch("/vehicles");
  const list = data?.vehicles || [];
  return (
    <>
      <PageHeader title="Our fleet" sub="Compare cars by seats, luggage space and rate per km." />
      <section className="section">
        <div className="container-x">
          {error ? <ErrorState message={error} /> : list.length === 0 ? (
            <EmptyState title="No vehicles listed yet" text="Vehicles appear here once added from the admin dashboard." action={<Button href="/contact" variant="dark">Contact us</Button>} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((v) => <div key={v._id} id={v._id} className="scroll-mt-24"><VehicleCard v={v} /></div>)}
            </div>
          )}
          <p className="mt-8 text-sm text-ink-soft">Rates per km exclude tolls, parking and other charges. See the fare estimate when you book.</p>
        </div>
      </section>
    </>
  );
}
