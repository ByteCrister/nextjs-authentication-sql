import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/sign-in', '/sign-up', '/forgot-password', '/api/auth'];

export function middleware(req: NextRequest) {
    const url = new URL(req.url);
    const path = url.pathname;
    const sessionCookie = req.cookies.get('session_token')?.value;

    // Check if path is public
    const isPublic =
        PUBLIC_PATHS.some(p => p.endsWith('*') ? path.startsWith(p.replace('*', '')) : path === p) ||
        path.startsWith('/api/auth'); // if you want prefix matching

    // Redirect authenticated users away from sign-in/sign-up
    if (sessionCookie && (path === '/sign-in' || path === '/sign-up')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Allow public paths
    if (isPublic) return NextResponse.next();

    // Require auth for everything else
    if (!sessionCookie) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
