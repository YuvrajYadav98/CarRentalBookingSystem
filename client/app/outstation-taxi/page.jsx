import ServicePage, { serviceData } from "@/components/ServicePage";
export const metadata = { title: serviceData["outstation-taxi"].title, description: serviceData["outstation-taxi"].sub, alternates: { canonical: "/outstation-taxi" } };
export default function Page() { return <ServicePage slug="outstation-taxi" />; }
