import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except:
  // - API routes
  // - Next.js internals (_next)
  // - Admin routes
  // - Static files with extensions
  matcher: ['/((?!api|_next|admin|.*\\.[\\w]+$).*)'],
};
