import PageHeader from "@/components/PageHeader";
import { Faq, Cta } from "@/components/home/Static";

export const metadata = { title: "FAQ: Booking, Fares and Cancellations", description: "Answers to common questions about booking a cab in Indore, estimated fares, one-way trips and cancellations.", alternates: { canonical: "/faq" } };
export default function Page() { return <><PageHeader title="Frequently asked questions" /><Faq /><Cta /></>; }
