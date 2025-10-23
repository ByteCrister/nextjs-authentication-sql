import { NextResponse } from "next/server";
import { addDays } from "@/utils/dates";
import { cookies } from "next/headers";

/**
 * Set a session cookie on a NextResponse object
 */
export function setSessionCookie(
    res: NextResponse,
    token: string,
    remember: boolean
) {
    const expiryDays = remember
        ? Number(process.env.SESSION_REMEMBER_DAYS)
        : Number(process.env.SESSION_DEFAULT_DAYS);

    const expires = addDays(new Date(), expiryDays);

    res.cookies.set({
        name: "session_token",
        value: token,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires,
        path: "/",
    });
}

/**
 * Clear a session cookie on a NextResponse object
 */
export function clearSessionCookie(res: NextResponse) {
    res.cookies.set({
        name: "session_token",
        value: "",
        expires: new Date(0),
        path: "/",
    });
}


/**
 * Read the session token from request cookies
 * Can be used in server components or route handlers
 */
export async function getSessionToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get("session_token");
    return cookie?.value || null;
}
