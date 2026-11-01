"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try { setUser((await api("/auth/me")).user); } catch { setUser(null); }
    setLoading(false);
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const login = async (body) => { const d = await api("/auth/login", { method: "POST", body }); setUser(d.user); return d.user; };
  const register = async (body) => { const d = await api("/auth/register", { method: "POST", body }); setUser(d.user); return d.user; };
  const updateProfile = async (body) => { const d = await api("/auth/me", { method: "PUT", body }); setUser(d.user); return d.user; };
  const logout = async () => { try { await api("/auth/logout", { method: "POST" }); } finally { setUser(null); } };

  return <Ctx.Provider value={{ user, loading, login, register, updateProfile, logout }}>{children}</Ctx.Provider>;
}
