import type { MetadataRoute } from 'next';
import { locales, type Locale } from '@/i18n/routing';
import { blogPosts } from '@/lib/blog/posts';
import { TRAINING_SYSTEM } from '@/lib/training-system';

const FALLBACK_APP_URL = 'http://localhost:3003';
const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? FALLBACK_APP_URL;

// Marketing/SEO pages that exist for all locales
const marketingPages = [
  '/about',
  '/apply',
  '/blog',
  '/camp',
  '/image-generation',
  '/pricing',
  '/privacy',
  '/projects',
  '/terms',
  '/training',
  '/video-generation',
];

const trainingCourseIds = Array.from(
  new Set(
    Object.values(TRAINING_SYSTEM).flatMap((system) => [
      ...system.foundations,
      ...system.creation,
      ...system.efficiency,
      ...system.vibe,
    ]).map((course) => course.id)
  )
);

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

  // Marketing/SEO pages
  for (const page of marketingPages) {
    entries.push(...createSitemapEntry(page, 0.8, 'weekly'));
  }

  // Training course pages
  for (const courseId of trainingCourseIds) {
    entries.push(...createSitemapEntry(`/training/${courseId}`, 0.7, 'weekly'));
  }

  // Blog pages
  for (const post of blogPosts) {
    entries.push(
      ...createSitemapEntry(`/blog/${post.slug}`, 0.7, 'weekly')
    );
  }

  return entries;
}
