import { site } from "@/lib/siteConfig";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/dashboard", "/api/", "/login", "/register", "/track", "/booking/confirmation/"] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
