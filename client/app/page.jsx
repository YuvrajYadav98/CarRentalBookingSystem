import Hero from "@/components/home/Hero";
import { WhyChooseUs, Services, Destinations, HowItWorks, Faq, Cta, LocalBusinessSchema } from "@/components/home/Static";
import { Fleet, Packages, Testimonials } from "@/components/home/DataSections";

export const revalidate = 300;
export const metadata = {
  title: { absolute: "Cab Service in Indore | Airport, Local & Outstation Taxi" },
  description: "Book a taxi in Indore: airport transfers, local rentals, one-way and round trips to Ujjain, Omkareshwar, Maheshwar and Mandu. Check your estimated fare online.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <Services />
      <Fleet />
      <Destinations />
      <Packages />
      <HowItWorks />
      <Testimonials />
      <Faq />
      <Cta />
      <LocalBusinessSchema />
    </>
  );
}
