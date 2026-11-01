// Browser: same-origin /api (proxied). Server components: backend URL directly.
const BASE = typeof window === "undefined"
  ? `${process.env.API_ORIGIN || "https://api.sanwariyatourtravels.com"}/api`
  : "/api";

export async function api(path, { method = "GET", body, revalidate } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
    ...(revalidate !== undefined ? { next: { revalidate } } : { cache: "no-store" }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong. Please try again.");
  return data;
}

// Server-side helper: never throws, so pages can render empty/error states.
export async function safeFetch(path, revalidate = 300) {
  try {
    return { data: await api(path, { revalidate }), error: null };
  } catch (e) {
    return { data: null, error: "We couldn't load this right now. Please try again shortly." };
  }
}
