import PageHeader from "@/components/PageHeader";
import { Services, Cta } from "@/components/home/Static";

export const metadata = { title: "Taxi Services in Indore", description: "Airport transfers, local taxi, outstation, one-way, round-trip, corporate and wedding travel from Indore.", alternates: { canonical: "/services" } };

export default function ServicesPage() {
  return (
    <>
      <PageHeader title="Our services" sub="Taxi and car rental services for every kind of trip from Indore." />
      <Services />
      <Cta />
    </>
  );
}
