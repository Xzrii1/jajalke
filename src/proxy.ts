import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import type { Role } from "@/lib/types";

const PUBLIC_PATHS = ["/login", "/daftar"];

function dashboardFor(role: Role): string {
  return role === "siswa" ? "/siswa/dashboard" : "/admin/dashboard";
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isProtected = pathname.startsWith("/admin") || pathname.startsWith("/siswa");

  if (isProtected) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (
      pathname.startsWith("/admin") &&
      session.role !== "admin" &&
      session.role !== "petugas"
    ) {
      return NextResponse.redirect(new URL("/siswa/dashboard", request.url));
    }
    if (pathname.startsWith("/siswa") && session.role !== "siswa") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (session && PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL(dashboardFor(session.role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|ico|webp)$).*)",
  ],
};