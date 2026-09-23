import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, expectedAdminSessionToken } from '@/lib/adminSession';

/**
 * Public surface: Privacy Policy only.
 * Staff UI (/admin) requires a session cookie set via /console.
 * App APIs under /api remain available (they use their own auth).
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  if (pathname === '/privacy' || pathname.startsWith('/privacy/')) {
    return NextResponse.next();
  }

  if (pathname === '/console' || pathname.startsWith('/console/')) {
    return NextResponse.next();
  }

  if (pathname === '/' || pathname === '') {
    return NextResponse.redirect(new URL('/privacy', request.url));
  }

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const expected = await expectedAdminSessionToken();
    if (!expected || !token || token !== expected) {
      // Do not advertise that an admin UI exists.
      return NextResponse.redirect(new URL('/privacy', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/privacy', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
