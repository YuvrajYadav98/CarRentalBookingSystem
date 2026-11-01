"use client";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { ErrorState, Skeleton } from "@/components/ui/States";
import { PageTitle } from "@/components/admin/ui";
import { ImageField } from "@/components/admin/ResourceManager";
import { api } from "@/lib/api";

const FIELDS = [["name", "Company name"], ["logo", "Logo link (https)"], ["phone", "Phone number"], ["whatsapp", "WhatsApp number (with country code, e.g. 91…)"], ["email", "Email"], ["address", "Address"]];

export default function Settings() {
  const [s, setS] = useState({ loading: true, error: null });
  const [c, setC] = useState({}); const [social, setSocial] = useState([]); const [gallery, setGallery] = useState([]);
  const [save, setSave] = useState({ loading: false, error: null, ok: false });

  useEffect(() => { api("/settings").then((d) => { setC(d.settings.company || {}); setSocial(d.settings.company?.social || []); setGallery(d.settings.gallery || []); setS({ loading: false, error: null }); }).catch((e) => setS({ loading: false, error: e.message })); }, []);

  async function submit(e) {
    e.preventDefault(); setSave({ loading: true, error: null, ok: false });
    const company = Object.fromEntries(FIELDS.filter(([k]) => c[k]).map(([k]) => [k, c[k]]));
    company.social = social.filter((x) => x.label && x.url).map(({ label, url }) => ({ label, url }));
    try { await api("/settings", { method: "PUT", body: { company, gallery: gallery.filter((g) => g.url).map(({ url, caption }) => ({ url, caption: caption || undefined })) } }); setSave({ loading: false, error: null, ok: true }); } catch (err) { setSave({ loading: false, error: err.message, ok: false }); }
  }
  if (s.loading) return <Skeleton className="h-64" />;
  if (s.error) return <ErrorState message={s.error} />;
  return (
    <>
      <PageTitle title="Website settings" />
      <form onSubmit={submit} className="max-w-xl space-y-4">
        {FIELDS.map(([k, label]) => <Input key={k} id={k} label={label} value={c[k] || ""} onChange={(e) => setC({ ...c, [k]: e.target.value })} />)}
        <fieldset className="space-y-2"><legend className="text-sm font-medium">Social media links</legend>
          {social.map((x, i) => (
            <div key={i} className="flex gap-2">
              <input aria-label="Platform" placeholder="Platform" value={x.label || ""} onChange={(e) => setSocial(social.map((y, j) => (j === i ? { ...y, label: e.target.value } : y)))} className="w-32 rounded-lg border border-line px-3 py-2 text-sm" />
              <input aria-label="Link" placeholder="https://…" value={x.url || ""} onChange={(e) => setSocial(social.map((y, j) => (j === i ? { ...y, url: e.target.value } : y)))} className="flex-1 rounded-lg border border-line px-3 py-2 text-sm" />
              <button type="button" className="text-sm text-red-600" onClick={() => setSocial(social.filter((_, j) => j !== i))}>Remove</button>
            </div>))}
          {social.length < 10 && <button type="button" className="text-sm underline" onClick={() => setSocial([...social, { label: "", url: "" }])}>Add link</button>}
        </fieldset>
        <fieldset className="space-y-4"><legend className="text-sm font-medium">Gallery photos</legend>
          {gallery.map((g, i) => (
            <div key={i} className="space-y-2 rounded-card border border-line p-4">
              <ImageField id={`g-${i}`} value={g.url || ""} onChange={(url) => setGallery(gallery.map((x, j) => (j === i ? { ...x, url } : x)))} />
              <input aria-label="Caption" placeholder="Caption (optional)" value={g.caption || ""} onChange={(e) => setGallery(gallery.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x)))} className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
              <button type="button" className="text-sm text-red-600" onClick={() => setGallery(gallery.filter((_, j) => j !== i))}>Remove photo</button>
            </div>))}
          {gallery.length < 40 && <button type="button" className="text-sm underline" onClick={() => setGallery([...gallery, { url: "", caption: "" }])}>Add photo</button>}
        </fieldset>
        {save.error && <ErrorState message={save.error} />}
        {save.ok && <p role="status" className="flex items-center gap-2 text-sm text-green-700"><CheckCircle2 className="h-4 w-4" aria-hidden />Settings saved.</p>}
        <p className="text-xs text-ink-soft">Saved details are used on invoices. The public site header and footer still read the values in the site configuration until they are connected to these settings.</p>
        <Button type="submit" loading={save.loading}>Save settings</Button>
      </form>
    </>
  );
}
