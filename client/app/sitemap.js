import { safeFetch } from "@/lib/api";
import { destinations, site } from "@/lib/siteConfig";

export const revalidate = 3600;

const pages = ["", "/about", "/services", "/fleet", "/packages", "/contact", "/faq", "/airport-taxi", "/local-taxi", "/outstation-taxi", "/corporate-travel", "/wedding-transportation", "/gallery", "/testimonials", "/offers", "/booking", "/privacy-policy", "/terms-and-conditions"];

export default async function sitemap() {
  const { data } = await safeFetch("/packages", 3600);
  const url = (p) => `${site.url}${p}`;
  return [
    ...pages.map((p) => ({ url: url(p), changeFrequency: p === "" ? "daily" : "weekly", priority: p === "" ? 1 : 0.7 })),
    ...destinations.map((d) => ({ url: url(`/routes/${d.slug}`), changeFrequency: "weekly", priority: 0.8 })),
    ...(data?.packages || []).map((p) => ({ url: url(`/packages/${p.slug}`), lastModified: p.updatedAt, changeFrequency: "weekly", priority: 0.6 })),
  ];
}
