import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Pages that can be opened without being signed in.
const PUBLIC_PATHS = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
  "/verify-email",
];

const ADMIN_ROLES = ["admin", "superadmin", "super_admin"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "purebullion-secret-key",
  });

  const role = String(token?.role ?? "").trim().toLowerCase();
  const isAuthenticated =
    !!token &&
    typeof token.accessToken === "string" &&
    token.accessToken.length > 0 &&
    ADMIN_ROLES.includes(role);

  // Signed-in admins have no reason to see the auth pages again.
  if (isPublicPath(pathname)) {
    if (isAuthenticated && pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Everything except NextAuth's own endpoints, Next internals and static assets.
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|fonts/|images/|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff2?)$).*)",
  ],
};
