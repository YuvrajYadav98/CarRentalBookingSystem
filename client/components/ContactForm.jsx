"use client";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { ErrorState } from "@/components/ui/States";
import { api } from "@/lib/api";

export default function ContactForm() {
  const [f, setF] = useState({ name: "", mobile: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ loading: false, done: false, error: null });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = "Enter your name.";
    if (!/^[6-9]\d{9}$/.test(f.mobile.replace(/\D/g, "").slice(-10))) er.mobile = "Enter a valid 10-digit mobile number.";
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Enter a valid email address.";
    if (f.message.trim().length < 10) er.message = "Write at least 10 characters.";
    setErrors(er);
    if (Object.keys(er).length) return;
    setState({ loading: true, done: false, error: null });
    try { await api("/enquiries", { method: "POST", body: f }); setState({ loading: false, done: true, error: null }); }
    catch (err) { setState({ loading: false, done: false, error: err.message }); }
  }

  if (state.done) return (
    <div role="status" className="rounded-card bg-green-50 p-6 text-green-800">
      <CheckCircle2 className="h-6 w-6" aria-hidden /><p className="mt-2 font-semibold">Enquiry sent</p><p className="text-sm">We will contact you on the number you gave.</p>
    </div>
  );
  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Input id="c-name" label="Your name" value={f.name} onChange={set("name")} error={errors.name} autoComplete="name" />
      <Input id="c-mobile" type="tel" label="Mobile number" value={f.mobile} onChange={set("mobile")} error={errors.mobile} autoComplete="tel" />
      <Input id="c-email" type="email" label="Email (optional)" value={f.email} onChange={set("email")} error={errors.email} autoComplete="email" />
      <Field id="c-msg" label="Message" error={errors.message}>
        <textarea id="c-msg" rows={4} value={f.message} onChange={set("message")} className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm ${errors.message ? "border-red-500" : "border-line"}`} />
      </Field>
      {state.error && <ErrorState message={state.error} />}
      <Button type="submit" loading={state.loading} className="w-full">Send enquiry</Button>
    </form>
  );
}
