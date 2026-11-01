import { MessageCircle, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import BookingForm from "./BookingForm";
import { safeFetch } from "@/lib/api";
import { site, waLink } from "@/lib/siteConfig";

export default async function Hero() {
  const { data } = await safeFetch("/vehicles"); // server-side (cached): the form needs no extra request on load
  return (
    <section className="bg-navy-900 pb-16 pt-12 text-white md:pb-24 md:pt-20">
      <div className="container-x grid items-center gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h1 className="font-heading text-[clamp(2rem,5vw,3.25rem)] font-bold leading-tight !text-white">Your Journey, Our Responsibility.</h1>
          <p className="mt-4 max-w-md text-lg text-white/80">Reliable, Comfortable and Affordable Cab Services in Indore.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#book">Book Your Ride</Button>
            <Button href={site.telHref} variant="light"><Phone className="h-4 w-4" aria-hidden />Call Now</Button>
            <Button href={waLink()} variant="light"><MessageCircle className="h-4 w-4" aria-hidden />WhatsApp</Button>
          </div>
        </div>
        <div id="book" className="scroll-mt-24 lg:col-span-3"><BookingForm initialVehicles={data?.vehicles} /></div>
      </div>
    </section>
  );
}
