import type { MetadataRoute } from 'next';
import { locales, type Locale } from '@/i18n/routing';

const FALLBACK_APP_URL = 'http://localhost:3003';
const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? FALLBACK_APP_URL;

// Static pages that exist for all locales
const staticPages = [
  '',
  '/signin',
  '/reset-password',
  '/training',
];

// Training course IDs (add more as courses are added)
const courseIds = ['f101', 'f102', 'c201', 'c202', 'e301', 'v401'];

type SitemapEntry = MetadataRoute.Sitemap[number];

function generateAlternates(path: string): Record<Locale | 'x-default', string> {
  const alternates: Record<string, string> = {};

  for (const locale of locales) {
    const localePath = path === '' ? `/${locale}` : `/${locale}${path}`;
    alternates[locale] = `${baseUrl}${localePath}`;
  }

  // x-default points to the default locale (zh)
  const defaultPath = path === '' ? '/zh' : `/zh${path}`;
  alternates['x-default'] = `${baseUrl}${defaultPath}`;

  return alternates as Record<Locale | 'x-default', string>;
}

function createSitemapEntry(
  path: string,
  priority: number,
  changeFrequency: SitemapEntry['changeFrequency']
): SitemapEntry[] {
  const alternates = generateAlternates(path);

  return locales.map((locale) => ({
    url: alternates[locale],
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: alternates,
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: SitemapEntry[] = [];

  // Homepage - highest priority
  entries.push(...createSitemapEntry('', 1.0, 'daily'));

  // Static pages
  for (const page of staticPages.slice(1)) {
    entries.push(...createSitemapEntry(page, 0.8, 'weekly'));
  }

  // Training course pages
  for (const courseId of courseIds) {
    entries.push(...createSitemapEntry(`/training/${courseId}`, 0.7, 'weekly'));
  }

  return entries;
}
