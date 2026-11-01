import { NextResponse } from "next/server";

// Fast gate only (Next 16 "proxy", formerly middleware): checks that a session cookie exists. The API verifies the JWT and role on every request,
// and /admin additionally checks the role in its layout (Phase 7).
export function proxy(req) {
  if (!req.cookies.get("token")) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/admin/:path*"] };
