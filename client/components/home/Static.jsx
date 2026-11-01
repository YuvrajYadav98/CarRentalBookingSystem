import Link from "next/link";
import { Headphones, UserCheck, IndianRupee, SprayCan, Clock, ShieldCheck, Plane, MapPin, Route, ArrowRightLeft, Briefcase, Car, Clock3 } from "lucide-react";
import Button from "@/components/ui/Button";
import Accordion from "@/components/ui/Accordion";
import JsonLd from "@/components/JsonLd";
import { destinations, site } from "@/lib/siteConfig";

export const Section = ({ id, title, sub, muted, children }) => (
  <section id={id} className={`section ${muted ? "bg-muted" : ""}`}>
    <div className="container-x">
      <h2 className="section-title">{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
      <div className="mt-10">{children}</div>
    </div>
  </section>
);

const why = [
  [Headphones, "24/7 Customer Support", "Reach us any time for bookings, changes or help on the road."],
  [UserCheck, "Experienced Drivers", "Drivers who know Indore and the highways beyond it."],
  [IndianRupee, "Affordable Pricing", "See an estimated fare before you confirm."],
  [SprayCan, "Clean Vehicles", "Cars cleaned and checked before every trip."],
  [Clock, "On-Time Pickup", "We plan around your pickup time, not ours."],
  [ShieldCheck, "Safe & Comfortable Journey", "Well-maintained cars and careful driving."],
];
export const WhyChooseUs = () => (
  <Section title="Why choose us" muted>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {why.map(([Icon, t, d]) => (
        <div key={t} className="rounded-card bg-white p-6 shadow-card">
          <Icon className="h-7 w-7 text-accent-600" aria-hidden />
          <h3 className="mt-4 text-lg font-semibold">{t}</h3>
          <p className="mt-2 text-sm text-ink-soft">{d}</p>
        </div>
      ))}
    </div>
  </Section>
);

const services = [
  [Plane, "Airport Transfer", "On-time pickup and drop at Indore airport.", "/airport-taxi"],
  [MapPin, "Local Taxi", "Hourly and daily rentals within the city.", "/local-taxi"],
  [Route, "Outstation Taxi", "Trips to nearby cities and tourist places.", "/outstation-taxi"],
  [Car, "One-Way Taxi", "Pay for a single drop instead of a return trip.", "/outstation-taxi"],
  [ArrowRightLeft, "Round-Trip Taxi", "Go and return with the same driver and car.", "/outstation-taxi"],
  [Briefcase, "Corporate Travel", "Reliable cars for staff and client travel.", "/corporate-travel"],
];
export const Services = () => (
  <Section title="Our services" sub="Pick the kind of trip you need. Each one can be booked online.">
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map(([Icon, t, d, h]) => (
        <article key={t} className="flex flex-col rounded-card border border-line p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy-900 text-accent-500"><Icon className="h-6 w-6" aria-hidden /></div>
          <h3 className="mt-4 text-lg font-semibold">{t}</h3>
          <p className="mt-2 flex-1 text-sm text-ink-soft">{d}</p>
          <Link href={h} className="mt-4 text-sm font-semibold text-navy-900 underline decoration-accent-500 underline-offset-4">Explore more</Link>
        </article>
      ))}
    </div>
  </Section>
);

export const Destinations = () => (
  <Section title="Popular destinations" sub="Distances are approximate. Get the fare for your date and vehicle in the booking form." muted>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {destinations.map((d) => (
        <article key={d.slug} className="rounded-card bg-white p-6 shadow-card">
          <h3 className="text-lg font-semibold"><Link href={`/routes/${d.slug}`} className="hover:underline">{d.name}</Link></h3>
          <dl className="mt-3 flex gap-6 text-sm text-ink-soft">
            <div><dt className="text-xs">Distance</dt><dd className="font-medium text-ink">~{d.km} km</dd></div>
            <div><dt className="text-xs">Travel time</dt><dd className="flex items-center gap-1 font-medium text-ink"><Clock3 className="h-3.5 w-3.5" aria-hidden />~{d.time}</dd></div>
          </dl>
          <Button href="/#book" variant="outline" className="mt-4 w-full">Book now</Button>
        </article>
      ))}
    </div>
  </Section>
);

const steps = [
  ["Choose your destination", "Enter pickup, drop and travel date."],
  ["Select your vehicle", "Compare cars by seats, luggage space and rate."],
  ["Confirm your booking", "Review the estimated fare and send your request."],
  ["Enjoy your journey", "Your driver arrives at the agreed time."],
];
export const HowItWorks = () => (
  <Section title="How it works">
    <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map(([t, d], i) => (
        <li key={t} className="rounded-card border border-line p-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 font-heading font-semibold text-navy-900">{i + 1}</span>
          <h3 className="mt-4 text-lg font-semibold">{t}</h3>
          <p className="mt-2 text-sm text-ink-soft">{d}</p>
        </li>
      ))}
    </ol>
  </Section>
);

const faqs = [
  { q: "How do I book a cab?", a: "Fill in the booking form on this page, check the estimated fare and send your request. You can also call or message us on WhatsApp." },
  { q: "Is the fare shown final?", a: "It is an estimate based on distance and the vehicle you choose. Tolls, parking, night charges and actual distance can change the final amount." },
  { q: "Do you offer one-way trips?", a: "Yes. Choose One Way as the trip type to get a one-way estimate." },
  { q: "Can I cancel a booking?", a: "Logged-in customers can cancel from their dashboard. Cancellation terms are listed on the Terms & Conditions page." },
  { q: "Which places can I travel to from Indore?", a: "Popular trips include Ujjain, Omkareshwar, Maheshwar, Mandu, Bhopal and Patalpani. Other destinations are available on request." },
];
export const Faq = () => (
  <Section title="Frequently asked questions" muted>
    <div className="max-w-3xl"><Accordion items={faqs} /></div>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
  </Section>
);

export const Cta = () => (
  <section className="bg-navy-900 py-16 text-center text-white">
    <div className="container-x">
      <h2 className="section-title !text-white">Ready for Your Next Journey?</h2>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/#book">Book Your Cab</Button>
        <Button href="/contact" variant="light">Contact Us</Button>
      </div>
    </div>
  </section>
);

export const LocalBusinessSchema = () => (
  <JsonLd data={{ "@context": "https://schema.org", "@type": "TaxiService", name: site.name, url: site.url, telephone: site.phone, email: site.email,
    areaServed: "Indore, Madhya Pradesh", openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], opens: "00:00", closes: "23:59" }, address: { "@type": "PostalAddress", addressLocality: "Indore", addressRegion: "Madhya Pradesh", addressCountry: "IN" } }} />
);
