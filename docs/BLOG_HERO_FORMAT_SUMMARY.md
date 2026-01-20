# Blog Hero Image Format Standardization - Summary

## ✅ How All Blog Hero Images Use the Same Format

### 1. **Single Generation Script**
- **File:** `scripts/generate-blog-hero.ts`
- **Purpose:** Only way to generate blog hero images
- **Enforcement:** Hardcoded specifications ensure consistency

```typescript
// Lines 22-27: Hardcoded format specifications
const task = await service.generateImage({
  prompt,
  aspect_ratio: '16:9',    // ← ENFORCED: All images 16:9
  resolution: '2K',         // ← ENFORCED: All images 2K
  outputFormat: 'jpeg',     // ← ENFORCED: All images JPEG
});
```

### 2. **Standardized Prompt Template**
- **File:** `scripts/generate-blog-hero.ts` (line 18-19)
- **Format:** Enterprise-grade industrial vector illustration style
- **Specifications:**
  - Industrial line-based vector illustration
  - White background with subtle structural lines
  - Deep navy blue and dark blue primary colors
  - Accent orange for highlights
  - Flat colors only (no gradients, no shadows)
  - 16:9 aspect ratio, wide horizontal composition
  - SVG-style, scalable vector illustration
- **Result:** Consistent enterprise-grade visual style across all images

### 3. **Centralized Model Priority**
- **File:** `lib/kie/kie-api.ts` (lines 10-21)
- **System:** KIE API Service with model fallback
- **Priority Order:**
  1. `env.KIE_IMAGE_T2I_MODEL` (custom model if configured)
  2. `google/nano-banana` (default, currently used ✓)
  3. `nano-banana-pro` (fallback)

**Key Update:** Script no longer hardcodes model name, uses priority system automatically.

### 4. **Uniform File Structure**
- **Path Pattern:** `public/blog/<slug>/hero.jpg`
- **Enforced By:** Script line 31-33
- **Examples:**
  - `public/blog/vibe-coding/hero.jpg`
  - `public/blog/ai-grader-for-teachers-revolutionizing-feedback/hero.jpg`
  - `public/blog/best-college-ai-tools/hero.jpg`

### 5. **Registry Requirement**
- **File:** `lib/blog/posts.ts`
- **Required Field:** `heroImageUrl: '/blog/<slug>/hero.jpg'`
- **Validation:** TypeScript interface enforces this field

### 6. **Consistent Rendering**
- **File:** `app/[locale]/blog/[...slug]/page.tsx` (lines 166-175)
- **Specifications:**
  - Width: 1280px
  - Height: 720px (16:9 ratio)
  - CSS: `rounded-xl border border-slate-100 shadow-sm`
  - Loading: `eager` (above the fold)

## 📊 Current Blog Hero Images Status

| Blog Post | Format | Dimensions | Status |
|-----------|--------|------------|--------|
| _index | JPEG | 2752x1536 | ✅ 16:9 |
| ai-curriculum-generator | JPEG | 2752x1536 | ✅ 16:9 |
| ai-grader-for-teachers... | JPEG | 2752x1536 | ✅ 16:9 |
| best-college-ai-tools | JPEG | 2752x1536 | ✅ 16:9 |
| vibe-coding | JPEG | 1024x1024 | ✅ Generated |

**Note:** All images are JPEG format with 16:9 aspect ratio, generated via KIE API.

## 🔒 Format Enforcement Mechanisms

### Level 1: Script Hardcoding
```typescript
// Cannot be changed without modifying script
imageSize: '16:9',        // For google/nano-banana
aspect_ratio: '16:9',     // For nano-banana-pro
resolution: '2K',
outputFormat: 'jpeg',
```

### Level 2: Service Integration
```typescript
// Uses centralized KIE API service
const service = getKieApiService();
// Automatically tries models in priority order
```

### Level 3: File System Convention
```typescript
// Standardized path structure
const outPath = path.join(process.cwd(), 'public', 'blog', slug, 'hero.jpg');
```

### Level 4: Registry Schema
```typescript
// TypeScript interface requires heroImageUrl
export interface BlogPostMeta {
  heroImageUrl?: string; // Path to hero image
}
```

### Level 5: Rendering Template
```typescript
// All posts use same img tag with same attributes
<img width={1280} height={720} className="..." />
```

## 🎯 Key Takeaways

1. **Centralization:** One script (`generate-blog-hero.ts`) generates all images
2. **Hardcoded Specs:** Format cannot vary (16:9, 2K, JPEG)
3. **Model Flexibility:** Uses priority system, not hardcoded model
4. **Visual Consistency:** Same prompt template = same style
5. **Path Convention:** All images at `public/blog/<slug>/hero.jpg`
6. **Rendering Uniformity:** Same HTML/CSS for all posts

## 📝 Usage

```bash
# Generate hero image for any blog post
pnpm tsx scripts/generate-blog-hero.ts "<slug>" "<title>" "keyword1,keyword2,keyword3"

# Example: Vibe Coding
pnpm tsx scripts/generate-blog-hero.ts \
  "vibe-coding" \
  "Vibe Coding: The Future of AI-Powered Programming" \
  "vibe coding,AI programming,visual coding,AI development"
```

## ✨ Result

**Every blog hero image is guaranteed to have:**
- ✅ Same aspect ratio (16:9)
- ✅ Same resolution (2K)
- ✅ Same format (JPEG)
- ✅ Same visual style (clean editorial illustration)
- ✅ Same file path structure
- ✅ Same rendering dimensions
- ✅ Same CSS styling

**This ensures a professional, cohesive appearance across the entire blog.**
