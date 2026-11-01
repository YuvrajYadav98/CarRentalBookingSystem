import Link from "next/link";
import { Loader2 } from "lucide-react";

const styles = {
  primary: "bg-accent-500 text-navy-900 hover:bg-accent-600 font-semibold",
  dark: "bg-navy-900 text-white hover:bg-navy-700",
  outline: "border border-line bg-white text-navy-900 hover:bg-muted",
  light: "border border-white/40 text-white hover:bg-white/10",
};

export default function Button({ href, variant = "primary", loading, className = "", children, external, ...rest }) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`;
  if (href) {
    return external || href.startsWith("http") || href.startsWith("tel:") ? (
      <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" {...rest}>{children}</a>
    ) : (
      <Link href={href} className={cls} {...rest}>{children}</Link>
    );
  }
  return (
    <button className={cls} disabled={loading || rest.disabled} {...rest}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
