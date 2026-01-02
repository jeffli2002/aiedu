import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Canonicalize the domain so auth cookies are set on one host consistently.
// This avoids losing the session when verifying on futurai.org and landing on www.futurai.org (or vice versa).
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get('host') || '';

  // Only enforce in production to avoid dev friction
  if (process.env.NODE_ENV === 'production') {
    // Force apex to www for the futurai.org domain
    if (host === 'futurai.org') {
      url.host = 'www.futurai.org';
      return NextResponse.redirect(url, 308);
    }
  }

  return NextResponse.next();
}

// Apply to all routes except static assets and Next internals
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};

