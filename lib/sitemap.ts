import type { MetadataRoute } from 'next';
import { locales, type Locale } from '@/i18n/routing';
import { blogPosts } from '@/lib/blog/posts';
import { TRAINING_SYSTEM } from '@/lib/training-system';
import { getSiteUrl } from '@/lib/seo/site-url';

const baseUrl = getSiteUrl();
const sitemapLastModified = getSitemapLastModified();

// Marketing/SEO pages that exist for all locales
const marketingPages = [
  '/about',
  '/apply',
  '/blog',
  '/camp',
  '/contact',
  '/image-generation',
  '/pricing',
  '/privacy',
  '/projects',
  '/refund',
  '/terms',
  '/training',
  '/video-generation',
];

const trainingCourseIds = Array.from(
  new Set(
    Object.values(TRAINING_SYSTEM)
      .flatMap((system) => [
        ...system.foundations,
        ...system.creation,
        ...system.efficiency,
        ...system.vibe,
      ])
      .map((course) => course.id)
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

  return locales.map((locale) => {
    const entry: SitemapEntry = {
      url: alternates[locale],
      changeFrequency,
      priority,
      alternates: {
        languages: alternates,
      },
    };

    if (sitemapLastModified) {
      entry.lastModified = sitemapLastModified;
    }

    return entry;
  });
}

function getSitemapLastModified(): Date | undefined {
  const raw =
    process.env.SITEMAP_LASTMOD ||
    process.env.NEXT_PUBLIC_SITEMAP_LASTMOD ||
    process.env.VERCEL_GIT_COMMIT_TIMESTAMP;

  if (!raw) {
    return undefined;
  }

  const numeric = Number(raw);
  if (!Number.isNaN(numeric)) {
    const millis = numeric < 1e12 ? numeric * 1000 : numeric;
    const date = new Date(millis);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
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
    entries.push(...createSitemapEntry(`/blog/${post.slug}`, 0.7, 'weekly'));
  }

  return entries;
}
