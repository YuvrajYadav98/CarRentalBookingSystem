import ServicePage, { serviceData } from "@/components/ServicePage";
export const metadata = { title: serviceData["corporate-travel"].title, description: serviceData["corporate-travel"].sub, alternates: { canonical: "/corporate-travel" } };
export default function Page() { return <ServicePage slug="corporate-travel" />; }
