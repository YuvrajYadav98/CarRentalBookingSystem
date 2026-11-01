"use client";
import ResourceManager from "@/components/admin/ResourceManager";
import { Chip } from "@/components/admin/ui";
import { date } from "@/lib/format";

const fields = [
  { name: "code", label: "Coupon code", required: true }, { name: "type", label: "Discount type", type: "select", default: "percent", options: [["percent", "Percent (%)"], ["flat", "Flat amount (₹)"]] },
  { name: "value", label: "Discount value", type: "number", required: true }, { name: "minAmount", label: "Minimum booking amount (₹)", type: "number" },
  { name: "maxDiscount", label: "Maximum discount (₹)", type: "number" }, { name: "expiresAt", label: "Expires on", type: "date" }, { name: "usageLimit", label: "Total uses allowed", type: "number" },
  { name: "active", label: "Active", type: "checkbox" }, { name: "showOnWebsite", label: "Show on the public Offers page", type: "checkbox", default: false },
];
export default function Page() {
  return <ResourceManager title="Offers and coupons" noun="coupon" endpoint="/coupons" plural="coupons" fields={fields} empty="No coupons yet."
    columns={[{ label: "Code", render: (c) => <span className="font-medium">{c.code}</span> }, { label: "Discount", render: (c) => (c.type === "percent" ? `${c.value}%` : `₹${c.value}`) },
      { label: "Used", render: (c) => `${c.usedCount}${c.usageLimit ? ` / ${c.usageLimit}` : ""}` }, { label: "Expires", render: (c) => (c.expiresAt ? date(c.expiresAt) : "Never") }, { label: "Active", render: (c) => <Chip ok={c.active} /> }]} />;
}
