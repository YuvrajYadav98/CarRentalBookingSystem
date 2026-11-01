import ServicePage, { serviceData } from "@/components/ServicePage";
export const metadata = { title: serviceData["local-taxi"].title, description: serviceData["local-taxi"].sub, alternates: { canonical: "/local-taxi" } };
export default function Page() { return <ServicePage slug="local-taxi" />; }
