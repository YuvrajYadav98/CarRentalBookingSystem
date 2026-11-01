"use client";
import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import Button from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/States";
import { api } from "@/lib/api";
import { inr } from "@/lib/format";
import { site } from "@/lib/siteConfig";

const loadCheckout = () => new Promise((resolve, reject) => {
  if (window.Razorpay) return resolve();
  const s = document.createElement("script");
  s.src = "https://checkout.razorpay.com/v1/checkout.js"; s.onload = resolve; s.onerror = () => reject(new Error("Could not load the payment window. Check your connection and try again."));
  document.body.appendChild(s);
});

export default function PayNow({ booking, mobile, onPaid }) {
  const [cfg, setCfg] = useState(null);
  const [s, setS] = useState({ loading: null, error: null, done: false });
  useEffect(() => { api("/payments/config").then(setCfg).catch(() => setCfg({ enabled: false })); }, []);

  if (!cfg || booking.status === "cancelled") return null;
  if (booking.paymentStatus === "paid" || s.done) return <p role="status" className="rounded-lg bg-green-50 p-4 text-sm text-green-800">Payment received. Thank you.</p>;
  if (!cfg.enabled) return <p className="rounded-lg bg-muted p-4 text-sm text-ink-soft">Online payment is not available yet. You can pay the driver or contact us.</p>;

  async function pay(mode) {
    setS({ loading: mode, error: null, done: false });
    try {
      await loadCheckout();
      const o = await api("/payments/create-order", { method: "POST", body: { ref: booking.ref, mobile, mode } });
      new window.Razorpay({
        key: o.keyId, amount: o.amount, currency: o.currency, order_id: o.orderId, name: site.name, description: `Booking ${booking.ref}`, prefill: { contact: mobile },
        handler: async (r) => {
          try { const v = await api("/payments/verify", { method: "POST", body: r }); setS({ loading: null, error: null, done: v.paymentStatus === "paid" }); onPaid?.(v.paymentStatus); if (v.paymentStatus !== "paid") setS({ loading: null, error: null, done: false }); }
          catch (e) { setS({ loading: null, error: e.message, done: false }); }
        },
        modal: { ondismiss: () => setS((x) => ({ ...x, loading: null })) },
      }).open();
    } catch (e) { setS({ loading: null, error: e.message, done: false }); }
  }

  const total = booking.fare?.total || 0;
  const showAdvance = cfg.advancePercent > 0 && booking.paymentStatus === "unpaid";
  return (
    <div className="space-y-3 rounded-card border border-line p-5">
      <h3 className="font-heading font-semibold">Pay online</h3>
      <p className="text-sm text-ink-soft">Secure payment by Razorpay. You can also pay the driver.</p>
      {s.error && <ErrorState message={s.error} />}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => pay("full")} loading={s.loading === "full"}><CreditCard className="h-4 w-4" aria-hidden />{booking.paymentStatus === "partial" ? "Pay remaining amount" : `Pay ${inr(total)}`}</Button>
        {showAdvance && <Button variant="outline" onClick={() => pay("advance")} loading={s.loading === "advance"}>Pay {cfg.advancePercent}% advance ({inr(Math.ceil((total * cfg.advancePercent) / 100))})</Button>}
      </div>
    </div>
  );
}
