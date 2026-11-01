import PageHeader from "@/components/PageHeader";
import { Testimonials } from "@/components/home/DataSections";

export const revalidate = 300;
export const metadata = { title: "Customer Reviews", description: "Reviews from customers who travelled with us in Indore.", alternates: { canonical: "/testimonials" } };
export default function Page() { return <><PageHeader title="Customer reviews" sub="Reviews from customers who completed a trip with us." /><Testimonials /></>; }
