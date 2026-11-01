export default function PageHeader({ title, sub }) {
  return (
    <div className="bg-navy-900 py-12 text-white md:py-16">
      <div className="container-x">
        <h1 className="font-heading text-3xl font-bold !text-white md:text-4xl">{title}</h1>
        {sub && <p className="mt-3 max-w-2xl text-white/80">{sub}</p>}
      </div>
    </div>
  );
}
