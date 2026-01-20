# Blog Hero Image Generation - Standardized Format

## Overview
All blog hero images are generated using the **KIE.ai API** with a consistent format, ensuring uniformity across all blog posts.

## Standardized Format Enforcement

### 1. Centralized Generation Script
**Location:** `scripts/generate-blog-hero.ts`

All blog hero images MUST be generated using this script:
```bash
pnpm tsx scripts/generate-blog-hero.ts "<slug>" "<title>" "keyword1,keyword2,keyword3"
```

### 2. Consistent Image Specifications

#### Technical Specs (Enforced by Script)
- **Aspect Ratio:** 16:9 (hardcoded in script line 24)
- **Resolution:** 2K (hardcoded in script line 25)
- **Format:** JPEG (hardcoded in script line 26)
- **Output Path:** `public/blog/<slug>/hero.jpg` (standardized in script line 33)

#### Prompt Template (Enforced by Script)
```typescript
const theme = `${title} — ${keywords.join(', ')}`;
const prompt = `${theme}. clean editorial illustration, minimal, high contrast, professional blog cover, no text, no watermark, 16:9`;
```

**Prompt Components:**
1. Title + Keywords (for context)
2. "clean editorial illustration" (style)
3. "minimal, high contrast" (visual characteristics)
4. "professional blog cover" (purpose)
5. "no text, no watermark" (constraints)
6. "16:9" (aspect ratio reminder)

### 3. Model Priority System

The script uses the **KIE API Service** model priority system (`lib/kie/kie-api.ts`):

```typescript
// Priority order for text-to-image generation:
IMAGE_MODEL_PRIORITY.t2i = [
  env.KIE_IMAGE_T2I_MODEL,      // 1. Custom model from .env.local (if set)
  'google/nano-banana',          // 2. Default KIE model
  'nano-banana-pro'              // 3. Fallback model
]
```

**How it works:**
1. Script calls `service.generateImage()` WITHOUT specifying a preferred model
2. KIE API Service automatically tries models in priority order
3. First successful model is used
4. If all fail, error is thrown with details

**Code Reference:** `scripts/generate-blog-hero.ts` lines 19-27
```typescript
const service = getKieApiService();
// Don't specify preferredModel - let the service use the model priority list
// This will try: env.KIE_IMAGE_T2I_MODEL, 'google/nano-banana', 'nano-banana-pro'
const task = await service.generateImage({
  prompt,
  aspect_ratio: '16:9',
  resolution: '2K',
  outputFormat: 'jpeg',
});
```

### 4. Registry Integration

Every blog post MUST include `heroImageUrl` in the registry (`lib/blog/posts.ts`):

```typescript
{
  slug: 'vibe-coding',
  title: 'Vibe Coding: The Future of AI-Powered Programming for K12 Students',
  description: '...',
  heroImageUrl: '/blog/vibe-coding/hero.jpg',  // ← REQUIRED
  // ... other fields
}
```

### 5. Rendering Consistency

All blog posts render hero images with identical styling (`app/[locale]/blog/[...slug]/page.tsx` lines 166-175):

```typescript
{post.heroImageUrl ? (
  <img
    src={post.heroImageUrl}
    alt={`${post.title} – blog cover image`}
    className="mt-6 w-full rounded-xl border border-slate-100 shadow-sm"
    loading="eager"
    width={1280}
    height={720}
  />
) : null}
```

**Standardized Rendering:**
- **Dimensions:** 1280x720px (16:9 ratio)
- **Styling:** Rounded corners, border, shadow
- **Loading:** Eager (above the fold)
- **Alt Text:** Consistent format

## Verification Checklist

When adding a new blog post, ensure:

- [ ] Hero image generated using `scripts/generate-blog-hero.ts`
- [ ] Image saved to `public/blog/<slug>/hero.jpg`
- [ ] Registry entry includes `heroImageUrl: '/blog/<slug>/hero.jpg'`
- [ ] Image uses 16:9 aspect ratio, 2K resolution, JPEG format
- [ ] Prompt follows template: title + keywords + style descriptors
- [ ] No manual image editing or custom generation methods used

## Why This Matters

1. **Visual Consistency:** All blog posts have the same professional look
2. **SEO Optimization:** Consistent image dimensions and format
3. **Performance:** Standardized resolution and format for optimal loading
4. **Maintainability:** Single source of truth for image generation
5. **Quality Control:** Automated process reduces human error

## Example: Existing Blog Posts

All current blog posts follow this format:

```bash
# Check all hero images
ls -lh public/blog/*/hero.jpg

# Output shows consistent format:
public/blog/ai-curriculum-generator/hero.jpg          (JPEG, 16:9)
public/blog/ai-grader-for-teachers.../hero.jpg        (JPEG, 16:9)
public/blog/best-college-ai-tools/hero.jpg            (JPEG, 16:9)
public/blog/vibe-coding/hero.jpg                      (JPEG, 16:9)
```

## Troubleshooting

### If image generation fails:
1. Check KIE_API_KEY in `.env.local`
2. Verify API key has image generation permissions
3. Check model availability (script will try all models in priority)
4. Review error message for specific model failures

### If you need a different model:
Add to `.env.local`:
```bash
KIE_IMAGE_T2I_MODEL="your-preferred-model"
```

The script will automatically prioritize your custom model while maintaining the same format specifications.

## Summary

**All blog hero images use the same format because:**

1. ✅ **Single generation script** (`scripts/generate-blog-hero.ts`)
2. ✅ **Hardcoded specifications** (16:9, 2K, JPEG)
3. ✅ **Standardized prompt template** (consistent style)
4. ✅ **Centralized model priority** (via KIE API Service)
5. ✅ **Uniform rendering** (same HTML/CSS for all posts)
6. ✅ **Registry enforcement** (heroImageUrl required)

**Result:** Every blog post hero image is generated with identical technical specs, visual style, and rendering, ensuring a cohesive, professional appearance across the entire blog.
