
import { NextResponse, type NextRequest } from 'next/server';
import { verifySession } from '@/lib/actions/auth';

const PROTECTED_ROUTES = ['/', '/customers', '/purchase-orders', '/production', '/deliveries', '/profile', '/settings'];
const PUBLIC_ROUTES = ['/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    const session = await verifySession();
    if (!session) {
      // Redirect to login if no session and trying to access a protected route
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Check if the user is logged in and trying to access a public route
  if (PUBLIC_ROUTES.includes(pathname)) {
     const session = await verifySession();
     if (session) {
        // Redirect to dashboard if logged in and trying to access login page
        return NextResponse.redirect(new URL('/', request.url));
     }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
