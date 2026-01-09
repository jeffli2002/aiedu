import type { MetadataRoute } from 'next';
import { getSitemapEntries } from '@/lib/sitemap';

const XML_NAMESPACE = 'http://www.sitemaps.org/schemas/sitemap/0.9';
const XHTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';

type SitemapEntry = MetadataRoute.Sitemap[number];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatLastModified(value: SitemapEntry['lastModified']): string | null {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function renderAlternates(languages?: Record<string, string>): string {
  if (!languages) {
    return '';
  }

  return Object.entries(languages)
    .map(
      ([locale, href]) =>
        `    <xhtml:link rel="alternate" hreflang="${escapeXml(locale)}" href="${escapeXml(href)}" />`
    )
    .join('\n');
}

function renderEntry(entry: SitemapEntry): string {
  const lastModified = formatLastModified(entry.lastModified);
  const alternates = renderAlternates(entry.alternates?.languages);

  const parts = [
    '  <url>',
    `    <loc>${escapeXml(entry.url)}</loc>`,
    lastModified ? `    <lastmod>${lastModified}</lastmod>` : '',
    entry.changeFrequency
      ? `    <changefreq>${entry.changeFrequency}</changefreq>`
      : '',
    entry.priority !== undefined
      ? `    <priority>${entry.priority}</priority>`
      : '',
    alternates,
    '  </url>',
  ].filter(Boolean);

  return parts.join('\n');
}

export async function GET(): Promise<Response> {
  const entries = await getSitemapEntries();

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<urlset xmlns="${XML_NAMESPACE}" xmlns:xhtml="${XHTML_NAMESPACE}">`,
    ...entries.map(renderEntry),
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
