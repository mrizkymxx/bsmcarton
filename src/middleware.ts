
import { type NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = [
    '/',
    '/customers',
    '/purchase-orders',
    '/production',
    '/deliveries',
    '/settings',
    '/profile',
];
const PUBLIC_ROUTES = ['/login'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionToken = request.cookies.get('sessionToken')?.value;
    
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    // If there's no session token and the user is trying to access a protected route, redirect to login.
    if (!sessionToken && !isPublicRoute) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If there's a session token and the user is on a public route (like /login), redirect to the dashboard.
    if (sessionToken && isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
