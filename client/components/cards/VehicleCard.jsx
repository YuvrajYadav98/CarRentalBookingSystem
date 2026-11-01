import Image from "@/components/ui/SafeImage";
import Link from "next/link";
import { Luggage, Snowflake, Users } from "lucide-react";
import Button from "@/components/ui/Button";

export default function VehicleCard({ v }) {
  const available = v.available !== false;
  return (
    <article className="flex flex-col overflow-hidden rounded-card border border-line bg-white">
      <div className="relative aspect-[16/10] bg-muted">
        {v.image && <Image src={v.image} alt={`${v.name} cab for hire in Indore`} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" loading="lazy" />}
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${available ? "bg-green-600 text-white" : "bg-ink text-white"}`}>
          {available ? "Available" : "Unavailable"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold">{v.name}</h3>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
          <li className="flex items-center gap-1"><Users className="h-4 w-4" aria-hidden />{v.seats} + driver</li>
          {v.luggage != null && <li className="flex items-center gap-1"><Luggage className="h-4 w-4" aria-hidden />{v.luggage} bags</li>}
          <li className="flex items-center gap-1"><Snowflake className="h-4 w-4" aria-hidden />{v.ac ? "AC" : "Non-AC"}</li>
        </ul>
        <p className="mt-4 font-heading font-semibold">₹{Number(v.pricePerKm).toLocaleString("en-IN")}<span className="text-sm font-normal text-ink-soft"> / km</span></p>
        <div className="mt-auto flex gap-2 pt-4">
          <Link href={`/fleet#${v._id}`} className="flex-1 rounded-lg border border-line py-2.5 text-center text-sm font-medium hover:bg-muted">View details</Link>
          {available
            ? <Button href={`/booking?vehicle=${v._id}`} className="flex-1 !py-2.5">Book now</Button>
            : <span className="flex-1 rounded-lg bg-muted py-2.5 text-center text-sm text-ink-soft">Not available</span>}
        </div>
      </div>
    </article>
  );
}
