"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { ErrorState } from "@/components/ui/States";
import { useAuth } from "@/context/AuthContext";

const safeNext = (n) => (n && n.startsWith("/") && !n.startsWith("//") ? n : null);

export default function AuthForm({ mode }) {
  const isReg = mode === "register";
  const { login, register } = useAuth();
  const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", mobile: "", password: "" });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ loading: false, error: null });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  function validate() {
    const e = {};
    if (isReg && f.name.trim().length < 2) e.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address.";
    if (isReg && !/^[6-9]\d{9}$/.test(f.mobile.replace(/\D/g, "").slice(-10))) e.mobile = "Enter a valid 10-digit mobile number.";
    if (isReg ? !(f.password.length >= 8 && /[A-Za-z]/.test(f.password) && /\d/.test(f.password)) : !f.password) e.password = isReg ? "Use 8+ characters with a letter and a number." : "Enter your password.";
    return e;
  }

  async function submit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setState({ loading: true, error: null });
    try {
      const user = isReg ? await register(f) : await login({ email: f.email, password: f.password });
      const next = safeNext(new URLSearchParams(window.location.search).get("next"));
      router.replace(next || (user.role === "admin" ? "/admin" : "/dashboard"));
      router.refresh();
    } catch (err) {
      setState({ loading: false, error: err.message });
    }
  }

  return (
    <section className="section">
      <div className="container-x max-w-md">
        <h1 className="text-2xl font-semibold md:text-3xl">{isReg ? "Create your account" : "Log in"}</h1>
        <p className="mt-2 text-sm text-ink-soft">{isReg ? "Track your bookings and view your history." : "Welcome back. Log in to see your bookings."}</p>
        <form onSubmit={submit} noValidate className="mt-6 space-y-4 rounded-card border border-line p-6">
          {isReg && <Input id="name" label="Full name" autoComplete="name" value={f.name} onChange={set("name")} error={errors.name} />}
          <Input id="email" type="email" label="Email" autoComplete="email" value={f.email} onChange={set("email")} error={errors.email} />
          {isReg && <Input id="mobile" type="tel" inputMode="numeric" label="Mobile number" autoComplete="tel" value={f.mobile} onChange={set("mobile")} error={errors.mobile} />}
          <Input id="password" type="password" label="Password" autoComplete={isReg ? "new-password" : "current-password"} value={f.password} onChange={set("password")} error={errors.password} />
          {state.error && <ErrorState message={state.error} />}
          <Button type="submit" loading={state.loading} className="w-full">{isReg ? "Create account" : "Log in"}</Button>
        </form>
        <p className="mt-4 text-sm text-ink-soft">
          {isReg ? <>Already have an account? <Link href="/login" className="font-medium text-navy-900 underline">Log in</Link></> : <>New here? <Link href="/register" className="font-medium text-navy-900 underline">Create an account</Link></>}
        </p>
      </div>
    </section>
  );
}
