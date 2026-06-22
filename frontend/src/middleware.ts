import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export function middleware(request: NextRequest) {
  const hasAdminSession = request.cookies.has('tda_session') || request.cookies.has('admin_refresh_token');

  // If user is already authenticated and tries to access /admin/login, redirect to dashboard
  if (request.nextUrl.pathname.startsWith('/admin/login')) {
    if (hasAdminSession) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // We only want to protect /admin routes, excluding /admin/login
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!hasAdminSession) {
      // Return a strict 404 Not Found by rewriting to a non-existent route
      // This completely hides the existence of the admin dashboard
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
