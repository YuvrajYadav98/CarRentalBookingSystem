"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/States";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

const items = [["/admin", "Overview"], ["/admin/bookings", "Bookings"], ["/admin/vehicles", "Vehicles"], ["/admin/drivers", "Drivers"], ["/admin/packages", "Packages"], ["/admin/customers", "Customers"],
  ["/admin/pricing", "Pricing"], ["/admin/offers", "Offers"], ["/admin/reviews", "Reviews"], ["/admin/enquiries", "Enquiries"], ["/admin/settings", "Settings"]];

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();
  useEffect(() => { if (!loading && !user) router.replace(`/login?next=${encodeURIComponent(path)}`); }, [loading, user, router, path]);

  if (loading || !user) return <div className="container-x section"><Skeleton className="h-64" /></div>;
  if (user.role !== "admin") return <section className="section"><div className="container-x max-w-md text-center"><h1 className="text-2xl font-semibold">Admin access only</h1><p className="mt-2 text-ink-soft">Your account does not have permission to view this area.</p><Button href="/dashboard" className="mt-6">Go to my account</Button></div></section>;

  return (
    <div className="bg-muted/50">
      <div className="container-x grid gap-6 py-6 lg:grid-cols-[200px_1fr]">
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {items.map(([href, label]) => {
            const active = href === "/admin" ? path === href : path.startsWith(href);
            return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm ${active ? "bg-navy-900 font-medium text-white" : "text-ink hover:bg-white"}`}>{label}</Link>;
          })}
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
