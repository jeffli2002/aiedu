import { NextResponse, NextRequest } from 'next/server';

const SUPPORTED = ['en', 'zh'];
const DEFAULT = 'zh';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip API and static assets
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/favicon') ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const maybeLocale = segments[0];
  const res = NextResponse.next();

  // Helper to set the language cookie consistently
  const setLangCookie = (lang: string) => {
    res.cookies.set('language', lang, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  };

  // If URL is prefixed with a supported locale, strip it and set cookie.
  if (SUPPORTED.includes(maybeLocale)) {
    const rest = '/' + segments.slice(1).join('/');
    const locale = maybeLocale;
    const url = req.nextUrl.clone();
    url.pathname = rest || '/';
    setLangCookie(locale);
    return NextResponse.rewrite(url, { request: req, headers: res.headers });
  }

  // No prefix: ensure we have a language cookie. If missing, detect from headers
  const cookieLang = req.cookies.get('language')?.value;
  if (!cookieLang || !SUPPORTED.includes(cookieLang)) {
    const header = req.headers.get('accept-language') || '';
    const detected = header.toLowerCase().startsWith('en') ? 'en' : 'zh';
    setLangCookie(detected || DEFAULT);
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next|api|.*\.[\w-]+$).*)'],
};

