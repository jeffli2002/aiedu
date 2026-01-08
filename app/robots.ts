import type { MetadataRoute } from 'next';

const FALLBACK_APP_URL = 'http://localhost:3003';
const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? FALLBACK_APP_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/signin',
          '/signup',
          '/reset-password',
          '/dashboard',
          '/settings',
          '/assets',
          '/email-verified',
          '/*/signin',
          '/*/signup',
          '/*/reset-password',
          '/*/dashboard',
          '/*/settings',
          '/*/assets',
          '/*/email-verified',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
