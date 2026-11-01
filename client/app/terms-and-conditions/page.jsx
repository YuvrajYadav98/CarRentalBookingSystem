import LegalPage from "@/components/LegalPage";
import { site } from "@/lib/siteConfig";

export const metadata = { title: "Terms & Conditions", description: `Terms for booking and travelling with ${site.name}.`, alternates: { canonical: "/terms-and-conditions" } };

export default function Page() {
  return <LegalPage title="Terms & Conditions" sections={[
    ["Bookings", ["A booking made on this website is a request. It is confirmed when we confirm it to you, and its status is shown in your account or on the tracking page."]],
    ["Fares", ["Fares shown online are estimates based on distance and the vehicle you choose. Tolls, parking at stops, and charges for changes to the trip are not included unless stated. The final amount may differ with actual distance and our published rates."]],
    ["Payment", ["You may pay online where available, or pay the driver as agreed. Advance payments, where offered, count towards the final fare."]],
    ["Cancellation", ["You can cancel a booking from your account before the trip starts. Any cancellation charges that apply are as communicated to you by us at the time of booking."]],
    ["Your responsibilities", ["Please give accurate pickup details and be ready at the agreed time. Passengers must follow the driver's reasonable safety instructions. Damage to a vehicle caused by a passenger may be charged."]],
    ["Our responsibilities", ["We will provide the booked vehicle with a driver for the agreed trip. In case of vehicle breakdown or unforeseen events, we will try to arrange an alternative where possible."]],
    ["Liability", ["To the extent permitted by law, we are not liable for delays caused by traffic, weather, road closures or events outside our control."]],
    ["Governing law", ["These terms are governed by the laws of India."]],
    ["Contact", [`Questions about these terms: ${site.email} or ${site.phone}.`]],
  ]} />;
}
