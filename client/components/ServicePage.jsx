import { Check } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/ui/Button";
import { Cta } from "@/components/home/Static";
import { site, waLink } from "@/lib/siteConfig";

export const serviceData = {
  "airport-taxi": { title: "Airport Taxi in Indore", sub: "Pickup and drop for Indore airport.", points: ["Pickup and drop at the airport", "Driver follows your flight timing when you share the flight number", "Choose a car by seats and luggage space", "Estimated fare shown before you book"] },
  "local-taxi": { title: "Local Taxi in Indore", sub: "Cars with a driver for city travel.", points: ["Rentals for local sightseeing and errands", "Choose a car that fits your group", "Pickup from your home, hotel or office", "Estimated fare shown before you book"] },
  "outstation-taxi": { title: "Outstation Taxi from Indore", sub: "One-way and round trips from Indore.", points: ["Trips to Ujjain, Omkareshwar, Maheshwar, Mandu, Bhopal and more", "One-way and round-trip options", "Same driver and car on round trips", "Tolls, parking and night charges are explained in the estimate"] },
  "corporate-travel": { title: "Corporate Travel", sub: "Cars for staff, guests and client visits.", points: ["Pickups for employees and visiting guests", "Airport and railway station transfers", "Contact us to agree billing and invoices"] },
  "wedding-transportation": { title: "Wedding Transportation", sub: "Cars and travellers for wedding events.", points: ["Cars for family and guest transfers", "Tempo Traveller for larger groups", "Contact us with your dates for availability and rates"] },
};

export default function ServicePage({ slug }) {
  const d = serviceData[slug];
  return (
    <>
      <PageHeader title={d.title} sub={d.sub} />
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-3">
          <ul className="space-y-3 lg:col-span-2">
            {d.points.map((p) => <li key={p} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden />{p}</li>)}
          </ul>
          <aside className="h-fit rounded-card bg-muted p-6">
            <h2 className="text-lg font-semibold">Book this service</h2>
            <div className="mt-4 flex flex-col gap-3">
              <Button href="/#book">Get fare estimate</Button>
              <Button href={site.telHref} variant="outline">Call now</Button>
              <Button href={waLink(`Hello, I need: ${d.title}`)} variant="dark">WhatsApp us</Button>
            </div>
          </aside>
        </div>
      </section>
      <Cta />
    </>
  );
}
