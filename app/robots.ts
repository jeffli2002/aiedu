import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo/site-url';

const baseUrl = getSiteUrl();

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
