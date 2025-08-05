
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

    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
    
    if (isProtectedRoute && !sessionToken) {
        // If trying to access a protected route without a session, redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }
    
    if (isPublicRoute && sessionToken) {
        // If trying to access a public route (like login) with a session, redirect to dashboard
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
