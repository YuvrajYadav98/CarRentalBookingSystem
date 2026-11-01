"use client";
import ResourceManager from "@/components/admin/ResourceManager";
import { Chip } from "@/components/admin/ui";
import { inr } from "@/lib/format";

const fields = [
  { name: "name", label: "Vehicle name", required: true }, { name: "image", type: "image" },
  { name: "seats", label: "Seats (excluding driver)", type: "number", required: true }, { name: "luggage", label: "Luggage (bags)", type: "number" },
  { name: "pricePerKm", label: "Price per km (₹)", type: "number", required: true }, { name: "description", label: "Description", type: "textarea" },
  { name: "ac", label: "Air conditioned", type: "checkbox" }, { name: "available", label: "Available for booking", type: "checkbox" }, { name: "isActive", label: "Show on website", type: "checkbox" },
];
export default function Page() {
  return <ResourceManager title="Vehicles" noun="vehicle" endpoint="/vehicles" plural="vehicles" fields={fields} empty="No vehicles yet. Add your first one."
    columns={[{ label: "Name", render: (v) => <span className="font-medium">{v.name}{v.isDemo && <span className="ml-2 rounded bg-amber-100 px-1.5 text-xs text-amber-800">demo</span>}</span> }, { label: "Seats", key: "seats" }, { label: "₹/km", render: (v) => inr(v.pricePerKm) },
      { label: "Available", render: (v) => <Chip ok={v.available} /> }, { label: "Visible", render: (v) => <Chip ok={v.isActive} /> }]} />;
}
