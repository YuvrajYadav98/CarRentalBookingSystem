"use client";
import { useState } from "react";
import Link from "next/link";
import { Car, ChevronDown, Menu, Phone, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { nav, serviceLinks, site } from "@/lib/siteConfig";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const account = user ? { href: user.role === "admin" ? "/admin" : "/dashboard", label: user.role === "admin" ? "Admin" : "My Account" } : { href: "/login", label: "Login" };
  return (
    <header className="sticky top-0 z-40 bg-navy-900 text-white shadow-md">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-semibold" onClick={() => setOpen(false)}>
          <Car className="h-6 w-6 text-accent-500" aria-hidden />
          {site.name}
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 text-sm lg:flex">
          {nav.map((n) => n.label === "Services" ? (
            <div key={n.href} className="group relative">
              <Link href={n.href} className="flex items-center gap-1 text-white/80 hover:text-white">{n.label}<ChevronDown className="h-4 w-4" aria-hidden /></Link>
              <div className="invisible absolute left-0 top-full w-56 rounded-lg bg-white py-2 text-ink opacity-0 shadow-card transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                {serviceLinks.map((s) => <Link key={s.href} href={s.href} className="block px-4 py-2 text-sm hover:bg-muted">{s.label}</Link>)}
              </div>
            </div>
          ) : (
            <Link key={n.href} href={n.href} className="text-white/80 transition-colors hover:text-white">{n.label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a href={site.telHref} className="flex items-center gap-1 text-sm text-white/80 hover:text-white"><Phone className="h-4 w-4" aria-hidden />Call Now</a>
          <Link href={account.href} className="text-sm text-white/80 hover:text-white">{account.label}</Link>
          <Button href="/booking" className="!py-2">Book Now</Button>
        </div>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/10 lg:hidden"
          >
            <nav aria-label="Mobile" className="container-x flex flex-col gap-1 py-4">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-white/90 hover:bg-white/10">{n.label}</Link>
              ))}
              <Link href={account.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-white/90 hover:bg-white/10">{account.label}</Link>
              <Button href={site.telHref} variant="light" className="mt-2">Call Now</Button>
              <Button href="/booking" className="mt-2" onClick={() => setOpen(false)}>Book Now</Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
