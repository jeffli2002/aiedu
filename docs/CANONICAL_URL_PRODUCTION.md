# Canonical URL Configuration - Production Deployment

## ✅ Configuration Status

### Current Setup:
The canonical URL system is **correctly configured** and will automatically use the production URL when deployed.

## How It Works

### 1. Environment-Based URL Configuration

**Development (.env.local):**
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3003
```

**Production (.env.production):**
```bash
NEXT_PUBLIC_APP_URL=https://www.futurai.org  # ✓ FIXED (was http://futurai.org)
```

### 2. Site URL Resolution

**File:** `lib/seo/site-url.ts`

```typescript
const FALLBACK_SITE_URL = 'https://www.futurai.org';

export function getSiteUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_APP_URL || FALLBACK_SITE_URL;
  try {
    return new URL(rawUrl).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}
```

**Logic:**
1. Uses `NEXT_PUBLIC_APP_URL` from environment
2. Falls back to `https://www.futurai.org` if not set
3. Returns the origin (protocol + domain)

### 3. Metadata Base Configuration

**File:** `app/layout.tsx` (line 17)

```typescript
export const metadata: Metadata = {
  metadataBase: getMetadataBase(),  // Sets base URL for all metadata
};
```

This sets the base URL for **all relative URLs** in metadata, including:
- Canonical URLs
- Open Graph URLs
- Twitter Card URLs
- Alternate language URLs

### 4. Blog Post Canonical URLs

**File:** `app/[locale]/blog/[...slug]/page.tsx` (line 23)

```typescript
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const post = getPostBySlug(slugPath);

  const meta: Metadata = {
    title: post.title,
    description: post.description,
    ...buildLocaleCanonicalMetadata(params.locale, `/blog/${post.slug}`),
    // ...
  };
  return meta;
}
```

**File:** `lib/seo/metadata.ts` (lines 88-111)

```typescript
export function buildLocaleCanonicalMetadata(
  locale: string | undefined,
  pathname: string
): Metadata {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const localePrefix = locale ? `/${locale.replace(/^\/+/, '')}` : '';
  const fullPath = normalizedPath === '/'
    ? `${localePrefix || '/'}`
    : `${localePrefix}${normalizedPath}`;

  // Generate alternate language URLs
  const languages: Record<string, string> = {};
  for (const entry of locales) {
    const localizedPath = normalizedPath === '/'
      ? `/${entry}`
      : `/${entry}${normalizedPath}`;
    languages[entry] = localizedPath;
  }
  languages['x-default'] = normalizedPath === '/' ? '/zh' : `/zh${normalizedPath}`;

  return {
    alternates: {
      canonical: fullPath || '/',  // Relative path, combined with metadataBase
      languages,                    // Alternate language URLs
    },
  };
}
```

## URL Generation Flow

### Development (localhost:3003):
```
metadataBase: http://localhost:3003
canonical path: /en/blog/vibe-coding
→ Final URL: http://localhost:3003/en/blog/vibe-coding
```

### Production (www.futurai.org):
```
metadataBase: https://www.futurai.org
canonical path: /en/blog/vibe-coding
→ Final URL: https://www.futurai.org/en/blog/vibe-coding ✓
```

## Verification

### In Development:
```html
<link rel="canonical" href="http://localhost:3003/en/blog/vibe-coding" />
```

### In Production (after deployment):
```html
<link rel="canonical" href="https://www.futurai.org/en/blog/vibe-coding" />
```

## Deployment Checklist

When deploying to production, ensure:

- [x] `.env.production` has `NEXT_PUBLIC_APP_URL=https://www.futurai.org`
- [x] `metadataBase` is set in `app/layout.tsx`
- [x] Blog posts use `buildLocaleCanonicalMetadata()`
- [x] Sitemap uses `getSiteUrl()` for base URL
- [x] All relative URLs in metadata (no hardcoded localhost)

## Sitemap Configuration

**File:** `lib/sitemap.ts` (line 7)

```typescript
const baseUrl = getSiteUrl();  // Uses NEXT_PUBLIC_APP_URL or fallback
```

This ensures the sitemap also uses the correct production URL:

**Development:**
```xml
<url>
  <loc>http://localhost:3003/en/blog/vibe-coding</loc>
</url>
```

**Production:**
```xml
<url>
  <loc>https://www.futurai.org/en/blog/vibe-coding</loc>
</url>
```

## Alternate Language URLs

The system automatically generates alternate language URLs for SEO:

```html
<link rel="alternate" hreflang="en" href="https://www.futurai.org/en/blog/vibe-coding" />
<link rel="alternate" hreflang="zh" href="https://www.futurai.org/zh/blog/vibe-coding" />
<link rel="alternate" hreflang="x-default" href="https://www.futurai.org/zh/blog/vibe-coding" />
```

## Testing in Production

After deployment, verify canonical URLs:

```bash
# Check canonical URL
curl -s https://www.futurai.org/en/blog/vibe-coding | grep -o '<link rel="canonical"[^>]*>'

# Expected output:
<link rel="canonical" href="https://www.futurai.org/en/blog/vibe-coding"/>
```

## Summary

✅ **Canonical URLs are correctly configured and will automatically use production URL when deployed.**

**Key Points:**
1. Environment variable `NEXT_PUBLIC_APP_URL` controls the base URL
2. `metadataBase` in root layout applies to all pages
3. Blog posts use relative paths that combine with `metadataBase`
4. Sitemap uses the same URL resolution system
5. No hardcoded localhost URLs in the codebase

**Result:** When deployed to production with `.env.production`, all canonical URLs will automatically use `https://www.futurai.org` instead of `http://localhost:3003`.
