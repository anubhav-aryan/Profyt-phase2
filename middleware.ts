import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { isSuperAdminEmail } from "@/lib/superadmin";
import { NextResponse } from "next/server";

// Lightweight NextAuth instance — only JWT decode, no Prisma/bcrypt/MongoDB.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const session = req.auth;

  const isStatic =
    path.startsWith("/_next") ||
    path === "/favicon.ico" ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico)$/.test(path);

  if (isStatic) {
    return NextResponse.next();
  }

  const role = session?.user?.role ?? "analyst";
  const email = session?.user?.email?.toLowerCase() ?? "";

  if (path === "/login" || path === "/portal/login") {
    return NextResponse.next();
  }

  if (path.startsWith("/admin")) {
    if (!session) {
      const login = new URL("/login", req.nextUrl.origin);
      login.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(login);
    }
    if (role !== "analyst" || !isSuperAdminEmail(email)) {
      const login = new URL("/login", req.nextUrl.origin);
      login.searchParams.set("error", "AccessDenied");
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  if (path.startsWith("/portal")) {
    if (!session || role !== "client") {
      const login = new URL("/portal/login", req.nextUrl.origin);
      login.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  if (!session) {
    const login = new URL("/login", req.nextUrl.origin);
    login.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(login);
  }

  if (role === "client") {
    return NextResponse.redirect(
      new URL("/portal/dashboard", req.nextUrl.origin)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.ico).*)",
  ],
};
