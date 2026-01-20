# Production Deployment - Canonical URL Setup

## ✅ Fixed: Production URL Configuration

### Issue Identified:
- `.env.production` had `http://futurai.org` (HTTP, no www)
- Should be `https://www.futurai.org` (HTTPS with www)

### Fix Applied:
Updated `.env.production` line 2:
```bash
# Before:
NEXT_PUBLIC_APP_URL=http://futurai.org

# After:
NEXT_PUBLIC_APP_URL=https://www.futurai.org  ✓
```

## Vercel Deployment Configuration

### Required Environment Variable:

In your Vercel project settings, ensure this environment variable is set:

**Variable Name:** `NEXT_PUBLIC_APP_URL`
**Value:** `https://www.futurai.org`
**Environment:** Production

### How to Set in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add or update:
   - **Key:** `NEXT_PUBLIC_APP_URL`
   - **Value:** `https://www.futurai.org`
   - **Environment:** Select "Production"
4. Click **Save**
5. Redeploy your application

### Verification After Deployment:

```bash
# Check canonical URL in production
curl -s https://www.futurai.org/en/blog/vibe-coding | grep 'rel="canonical"'

# Expected output:
<link rel="canonical" href="https://www.futurai.org/en/blog/vibe-coding"/>
```

## How It Works

### URL Resolution Priority:

1. **Vercel Environment Variable** (highest priority)
   - `NEXT_PUBLIC_APP_URL` from Vercel dashboard

2. **`.env.production` file** (if Vercel var not set)
   - `NEXT_PUBLIC_APP_URL=https://www.futurai.org`

3. **Fallback in code** (if both above missing)
   - `FALLBACK_SITE_URL = 'https://www.futurai.org'` in `lib/seo/site-url.ts`

### Current Status:

✅ `.env.production` updated to `https://www.futurai.org`
✅ Fallback URL is `https://www.futurai.org`
✅ Code uses environment-based URL resolution
⚠️ **Action Required:** Set `NEXT_PUBLIC_APP_URL` in Vercel dashboard

## All Pages Affected

The canonical URL configuration applies to:

- ✅ Blog posts (`/[locale]/blog/[...slug]`)
- ✅ Training courses (`/[locale]/training/[courseId]`)
- ✅ Marketing pages (`/[locale]/pricing`, `/[locale]/about`, etc.)
- ✅ Homepage (`/[locale]`)
- ✅ Sitemap (`/sitemap.xml`)

## Testing Checklist

After deployment, verify these URLs:

```bash
# Blog post
curl -s https://www.futurai.org/en/blog/vibe-coding | grep canonical

# Homepage
curl -s https://www.futurai.org/en | grep canonical

# Sitemap
curl -s https://www.futurai.org/sitemap.xml | grep '<loc>' | head -5
```

All should show `https://www.futurai.org` (not localhost).

## Summary

✅ **Production canonical URLs are now correctly configured.**

**What was fixed:**
1. Updated `.env.production` from `http://futurai.org` to `https://www.futurai.org`
2. Verified code uses environment-based URL resolution
3. Confirmed fallback URL is correct

**Next step:**
- Set `NEXT_PUBLIC_APP_URL=https://www.futurai.org` in Vercel dashboard (Production environment)
- Redeploy to apply changes

**Result:**
- Development: Uses `http://localhost:3003`
- Production: Uses `https://www.futurai.org`
- No hardcoded localhost URLs in production
