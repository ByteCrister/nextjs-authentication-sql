import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

const AUTH_ONLY_PATHS = ["/sign-in", "/sign-up", "/forgot-password"];
const PUBLIC_API_PATHS = ["/api/auth"];

function isAuthOnlyPath(path: string) {
  path = path.replace(/\/+$/, "");
  return AUTH_ONLY_PATHS.some((p) => path === p || path.startsWith(p + "/"));
}

function isPublicApi(path: string) {
  path = path.replace(/\/+$/, "");
  return PUBLIC_API_PATHS.some((p) => path === p || path.startsWith(p + "/"));
}

export async function proxy(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname.replace(/\/+$/, "");

  const token = await getToken({
    req,
    secret,
    secureCookie: process.env.NODE_ENV === "production",
  });

  // ✅ Allow API auth routes
  if (isPublicApi(path)) return NextResponse.next();

  // ✅ If user is authenticated and tries to access sign-in/up pages → redirect home
  if (token && isAuthOnlyPath(path)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ If user is unauthenticated and tries to access public auth pages → allow
  if (!token && isAuthOnlyPath(path)) {
    return NextResponse.next();
  }

  // ✅ If user is unauthenticated and tries to access any other page → redirect to sign-in
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // ✅ Otherwise allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
