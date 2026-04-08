import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-only-secret");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/owner") && !pathname.startsWith("/staff")) return NextResponse.next();

  const token = request.cookies.get("session")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", request.url));

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as string;

    if (pathname.startsWith("/owner") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/staff/reports", request.url));
    }

    if (pathname.startsWith("/staff") && role !== "STAFF") {
      return NextResponse.redirect(new URL("/owner/dashboard", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/owner/:path*", "/staff/:path*"]
};
