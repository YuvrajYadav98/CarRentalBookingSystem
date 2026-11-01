import PageHeader from "@/components/PageHeader";
import { WhyChooseUs, Cta } from "@/components/home/Static";
import { site } from "@/lib/siteConfig";

export const metadata = { title: "About Us", description: `About ${site.name}, a cab and car rental service in Indore.`, alternates: { canonical: "/about" } };

export default function About() {
  return (
    <>
      <PageHeader title="About us" sub="A taxi and car rental service based in Indore." />
      <section className="section">
        <div className="container-x max-w-3xl space-y-4 leading-relaxed text-ink-soft">
          <p>{site.name} provides local taxis, airport transfers, outstation trips and tour packages from Indore. We focus on punctual pickups, clean cars and drivers who know the routes.</p>
          <p>{/* TODO: replace with the company's real story, founding year and licences before launch. */}You can book online, call us or message us on WhatsApp. Every booking shows an estimated fare before you confirm.</p>
        </div>
      </section>
      <WhyChooseUs />
      <Cta />
    </>
  );
}
