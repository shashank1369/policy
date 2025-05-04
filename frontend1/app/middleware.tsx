import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value || localStorage.getItem("token");
  const { pathname } = request.nextUrl;

  if (!token && pathname.startsWith("/prominence")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      // Optionally verify token with backend
      fetch("http://127.0.0.1:5000/api/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return NextResponse.redirect(new URL("/login", request.url));
      });
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/prominence", "/company-dashboard"],
};