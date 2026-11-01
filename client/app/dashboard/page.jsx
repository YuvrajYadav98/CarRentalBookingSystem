"use client";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { ErrorState } from "@/components/ui/States";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [f, setF] = useState({ name: user.name, mobile: user.mobile });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ loading: false, saved: false, error: null });
  useEffect(() => setF({ name: user.name, mobile: user.mobile }), [user]);

  async function save(e) {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = "Enter your name.";
    if (!/^[6-9]\d{9}$/.test(f.mobile.replace(/\D/g, "").slice(-10))) er.mobile = "Enter a valid 10-digit mobile number.";
    setErrors(er);
    if (Object.keys(er).length) return;
    setState({ loading: true, saved: false, error: null });
    try { await updateProfile(f); setState({ loading: false, saved: true, error: null }); }
    catch (err) { setState({ loading: false, saved: false, error: err.message }); }
  }

  return (
    <form onSubmit={save} noValidate className="max-w-lg space-y-4 rounded-card border border-line p-6">
      <h2 className="text-lg font-semibold">Profile</h2>
      <Input id="p-name" label="Full name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} error={errors.name} />
      <Input id="p-mobile" type="tel" label="Mobile number" value={f.mobile} onChange={(e) => setF({ ...f, mobile: e.target.value })} error={errors.mobile} />
      <Input id="p-email" label="Email (cannot be changed)" value={user.email} disabled readOnly />
      {state.error && <ErrorState message={state.error} />}
      {state.saved && <p role="status" className="flex items-center gap-2 text-sm text-green-700"><CheckCircle2 className="h-4 w-4" aria-hidden />Profile saved.</p>}
      <Button type="submit" loading={state.loading}>Save changes</Button>
    </form>
  );
}
