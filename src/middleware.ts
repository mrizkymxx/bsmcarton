
import { type NextRequest, NextResponse } from 'next/server';

const LOGIN_PATH = '/login';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionToken = request.cookies.get('sessionToken')?.value;
    
    // If the user is logged in and trying to access the login page, redirect to home.
    if (sessionToken && pathname === LOGIN_PATH) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // If the user is not logged in and is trying to access any page other than login, redirect to login.
    if (!sessionToken && pathname !== LOGIN_PATH) {
        const loginUrl = new URL(LOGIN_PATH, request.url);
        // Optionally, you can add the intended destination as a query param
        // loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Otherwise, continue as normal.
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
