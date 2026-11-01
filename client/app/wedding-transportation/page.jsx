import ServicePage, { serviceData } from "@/components/ServicePage";
export const metadata = { title: serviceData["wedding-transportation"].title, description: serviceData["wedding-transportation"].sub, alternates: { canonical: "/wedding-transportation" } };
export default function Page() { return <ServicePage slug="wedding-transportation" />; }
