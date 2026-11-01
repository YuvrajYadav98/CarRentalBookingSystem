import PageHeader from "@/components/PageHeader";

export default function LegalPage({ title, updated = "October 2026", sections }) {
  return (
    <>
      <PageHeader title={title} sub={`Last updated: ${updated}`} />
      <section className="section"><div className="container-x max-w-3xl space-y-8">
        {sections.map(([h, ps]) => <div key={h}><h2 className="text-xl font-semibold">{h}</h2>{ps.map((p) => <p key={p} className="mt-3 leading-relaxed text-ink-soft">{p}</p>)}</div>)}
      </div></section>
    </>
  );
}
