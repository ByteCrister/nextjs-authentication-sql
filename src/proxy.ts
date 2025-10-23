import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

const PUBLIC_PATHS = ["/sign-in", "/sign-up", "/forgot-password", "/api/auth"];

function isPublicPath(path: string) {
  path = path.replace(/\/+$/, ""); // remove trailing slashes
  return PUBLIC_PATHS.some((p) => path === p || path.startsWith(p + "/"));
}

export async function proxy(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname.replace(/\/+$/, ""); // normalize

  // 1️⃣ Allow public paths immediately
  if (isPublicPath(path)) {
    return NextResponse.next();
  }

  // 2️⃣ Check token for protected pages
  const token = await getToken({
    req,
    secret,
    secureCookie: process.env.NODE_ENV === "production",
  });

  // 3️⃣ If not authenticated, redirect to sign-in
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // 4️⃣ Authenticated user accessing sign-in/sign-up? redirect home
  if (token && (path === "/sign-in" || path === "/sign-up")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
