const FALLBACK_SITE_URL = 'https://www.futurai.org';

export function getSiteUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_APP_URL || FALLBACK_SITE_URL;
  try {
    return new URL(rawUrl).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export function getSiteUrlObject(): URL {
  return new URL(getSiteUrl());
}
