import { Mail, MessageCircle, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import { site, waLink } from "@/lib/siteConfig";

export default function Support() {
  return (
    <div className="max-w-lg space-y-4">
      <p className="text-ink-soft">Need help with a booking? Keep your booking reference ready and reach us any of these ways.</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button href={site.telHref} variant="dark"><Phone className="h-4 w-4" aria-hidden />{site.phone}</Button>
        <Button href={waLink("Hello, I need help with my booking.")} variant="outline"><MessageCircle className="h-4 w-4" aria-hidden />WhatsApp</Button>
        <Button href={`mailto:${site.email}`} variant="outline"><Mail className="h-4 w-4" aria-hidden />Email</Button>
      </div>
      <p className="text-sm text-ink-soft">You can also <a href="/contact" className="underline">send an enquiry</a>.</p>
    </div>
  );
}
