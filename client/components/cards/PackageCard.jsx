import Image from "@/components/ui/SafeImage";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function PackageCard({ p }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-card bg-white shadow-card">
      <div className="relative aspect-[16/10] bg-navy-900/5">
        {p.image && <Image src={p.image} alt={`${p.name} taxi package`} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" loading="lazy" />}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold"><Link href={`/packages/${p.slug}`} className="hover:underline">{p.name}</Link></h3>
        <p className="mt-1 text-sm text-ink-soft">{[p.duration, p.distance && `${p.distance} km`, p.travelTime].filter(Boolean).join(" · ")}</p>
        {p.description && <p className="mt-3 line-clamp-3 text-sm text-ink-soft">{p.description}</p>}
        <div className="mt-auto flex items-center justify-between pt-4">
          <p className="font-heading font-semibold"><span className="text-xs font-normal text-ink-soft">From </span>₹{Number(p.price).toLocaleString("en-IN")}</p>
          <Button href={`/packages/${p.slug}`} className="!py-2">View &amp; book</Button>
        </div>
      </div>
    </article>
  );
}
