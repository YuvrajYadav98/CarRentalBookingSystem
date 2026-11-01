import ServicePage, { serviceData } from "@/components/ServicePage";
export const metadata = { title: serviceData["airport-taxi"].title, description: serviceData["airport-taxi"].sub, alternates: { canonical: "/airport-taxi" } };
export default function Page() { return <ServicePage slug="airport-taxi" />; }
