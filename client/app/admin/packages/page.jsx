"use client";
import ResourceManager from "@/components/admin/ResourceManager";
import { Chip } from "@/components/admin/ui";
import { inr } from "@/lib/format";

const fields = [
  { name: "name", label: "Package name", required: true }, { name: "image", type: "image" }, { name: "price", label: "Starting price (₹)", type: "number", required: true },
  { name: "distance", label: "Distance (km)", type: "number" }, { name: "travelTime", label: "Travel time (e.g. 2 hrs)" }, { name: "duration", label: "Tour duration (e.g. 1 day)" },
  { name: "description", label: "Description", type: "textarea" }, { name: "vehicleOptions", label: "Vehicle options", type: "list" },
  { name: "included", label: "Included", type: "list" }, { name: "excluded", label: "Not included", type: "list" }, { name: "isActive", label: "Show on website", type: "checkbox" },
];
export default function Page() {
  return <ResourceManager title="Packages" noun="package" endpoint="/packages" plural="packages" fields={fields} empty="No packages yet."
    columns={[{ label: "Name", render: (p) => <span className="font-medium">{p.name}{p.isDemo && <span className="ml-2 rounded bg-amber-100 px-1.5 text-xs text-amber-800">demo</span>}</span> }, { label: "Price", render: (p) => inr(p.price) }, { label: "Distance", render: (p) => (p.distance ? `${p.distance} km` : "-") }, { label: "Visible", render: (p) => <Chip ok={p.isActive} /> }]} />;
}
