"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/States";
import { useAuth } from "@/context/AuthContext";

const tabs = [["/dashboard", "Profile"], ["/dashboard/bookings", "My bookings"], ["/dashboard/payments", "Payments"], ["/dashboard/support", "Support"]];

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => { if (!loading && !user) router.replace(`/login?next=${encodeURIComponent(path)}`); }, [loading, user, router, path]);
  if (loading || !user) return <div className="container-x section"><Skeleton className="h-64" /></div>;

  return (
    <section className="section">
      <div className="container-x max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><h1 className="text-2xl font-semibold md:text-3xl">My account</h1><p className="mt-1 text-sm text-ink-soft">Hello, {user.name}</p></div>
          <Button variant="outline" onClick={async () => { await logout(); router.replace("/"); router.refresh(); }}>Log out</Button>
        </div>
        <nav aria-label="Account" className="mt-6 flex gap-1 overflow-x-auto border-b border-line">
          {tabs.map(([href, label]) => {
            const active = href === "/dashboard" ? path === href : path.startsWith(href);
            return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium ${active ? "border-accent-500 text-navy-900" : "border-transparent text-ink-soft hover:text-navy-900"}`}>{label}</Link>;
          })}
        </nav>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
