"use client";
import ResourceManager from "@/components/admin/ResourceManager";
import { Chip } from "@/components/admin/ui";

const fields = [{ name: "name", label: "Driver name", required: true }, { name: "mobile", label: "Mobile number", type: "tel", required: true }, { name: "licenseNumber", label: "Licence number" },
  { name: "available", label: "Available for trips", type: "checkbox" }, { name: "isActive", label: "Active", type: "checkbox" }];
export default function Page() {
  return <ResourceManager title="Drivers" noun="driver" endpoint="/drivers" plural="drivers" fields={fields} empty="No drivers yet."
    columns={[{ label: "Name", key: "name" }, { label: "Mobile", key: "mobile" }, { label: "Licence", render: (d) => d.licenseNumber || "-" }, { label: "Available", render: (d) => <Chip ok={d.available} /> }, { label: "Active", render: (d) => <Chip ok={d.isActive} /> }]} />;
}
