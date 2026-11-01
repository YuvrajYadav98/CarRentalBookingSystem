import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import { site, waLink } from "@/lib/siteConfig";

export const metadata = { title: "Contact Us", description: "Call, WhatsApp or send an enquiry to book a cab in Indore.", alternates: { canonical: "/contact" } };

export default function Contact() {
  const rows = [[Phone, "Phone", site.phone, site.telHref], [MessageCircle, "WhatsApp", "Chat with us", waLink()], [Mail, "Email", site.email, `mailto:${site.email}`], [MapPin, "Address", site.address]];
  return (
    <>
      <PageHeader title="Contact us" sub="Call, message or send an enquiry. We reply on the number you provide." />
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <ul className="space-y-5">
            {rows.map(([Icon, t, v, h]) => (
              <li key={t} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-accent-500"><Icon className="h-5 w-5" aria-hidden /></span>
                <div><p className="text-sm text-ink-soft">{t}</p>{h ? <a href={h} className="font-medium hover:underline">{v}</a> : <p className="font-medium">{v}</p>}</div>
              </li>
            ))}
          </ul>
          <div className="rounded-card border border-line p-6"><ContactForm /></div>
        </div>
      </section>
    </>
  );
}
