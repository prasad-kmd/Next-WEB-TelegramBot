import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public routes
  const publicRoutes = ['/login', '/privacy', '/disclaimer', '/terms', '/about', '/contact'];
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

  // Check for NextAuth session token
  const nextAuthToken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // Check for existing custom tg_token JWT cookie (named 'token' in the original code)
  const tgToken = request.cookies.get('token');

  const isAuthenticated = !!nextAuthToken || !!tgToken;

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && path === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)'],
};
