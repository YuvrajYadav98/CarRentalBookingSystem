import PageHeader from "@/components/PageHeader";
import BookingForm from "@/components/home/BookingForm";

export const metadata = { title: "Book a Cab in Indore", description: "Choose your trip, check the estimated fare and confirm your cab booking online.", alternates: { canonical: "/booking" } };

export default function BookingPage() {
  return (
    <>
      <PageHeader title="Book your cab" sub="Enter your trip details, check the estimated fare and confirm." />
      <section className="section"><div className="container-x max-w-4xl"><BookingForm /></div></section>
    </>
  );
}
