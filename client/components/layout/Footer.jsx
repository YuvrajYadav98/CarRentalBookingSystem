import Link from "next/link";
import { Car, Mail, MapPin, Phone } from "lucide-react";
import { destinations, nav, site } from "@/lib/siteConfig";

const services = [
  ["Airport Taxi", "/airport-taxi"], ["Local Taxi", "/local-taxi"], ["Outstation Taxi", "/outstation-taxi"],
  ["Corporate Travel", "/corporate-travel"], ["Wedding Transportation", "/wedding-transportation"],
];

function Col({ title, children }) {
  return (
    <div>
      <h3 className="font-heading text-base font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-white/70">{children}</ul>
    </div>
  );
}
const L = ({ href, children }) => <li><Link href={href} className="hover:text-white">{children}</Link></li>;

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <p className="flex items-center gap-2 font-heading text-lg font-semibold"><Car className="h-6 w-6 text-accent-500" aria-hidden />{site.name}</p>
          <p className="mt-4 text-sm leading-relaxed text-white/70">Cab, airport transfer and outstation taxi service in Indore.</p>
          {site.social.length > 0 && (
            <ul className="mt-4 flex gap-4 text-sm">
              {site.social.map((s) => <li key={s.href}><a href={s.href} rel="noopener noreferrer" target="_blank" className="text-white/70 hover:text-white">{s.label}</a></li>)}
            </ul>
          )}
        </div>
        <Col title="Quick links">{nav.map((n) => <L key={n.href} href={n.href}>{n.label}</L>)}<L href="/faq">FAQ</L></Col>
        <Col title="Services">{services.map(([t, h]) => <L key={h} href={h}>{t}</L>)}</Col>
        <Col title="Popular routes">{destinations.map((d) => <L key={d.slug} href={`/routes/${d.slug}`}>{d.name}</L>)}</Col>
        <Col title="Contact">
          <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /><a href={site.telHref} className="hover:text-white">{site.phone}</a></li>
          <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /><a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a></li>
          <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{site.address}</li>
        </Col>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p className="flex gap-4"><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link><Link href="/terms-and-conditions" className="hover:text-white">Terms &amp; Conditions</Link></p>
        </div>
      </div>
    </footer>
  );
}
