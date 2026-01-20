# Blog Hero Image Format - Quick Reference

## How All Blog Hero Images Use the Same Format

```
┌─────────────────────────────────────────────────────────────────┐
│                    STANDARDIZED FORMAT FLOW                      │
└─────────────────────────────────────────────────────────────────┘

1. GENERATION SCRIPT (Single Source of Truth)
   ┌──────────────────────────────────────────────────────────┐
   │ scripts/generate-blog-hero.ts                            │
   │                                                          │
   │ Hardcoded Specs:                                         │
   │  • aspect_ratio: '16:9'      ← ENFORCED                 │
   │  • resolution: '2K'          ← ENFORCED                 │
   │  • outputFormat: 'jpeg'      ← ENFORCED                 │
   │                                                          │
   │ Prompt Template:                                         │
   │  "${title} — ${keywords}. clean editorial              │
   │   illustration, minimal, high contrast,                  │
   │   professional blog cover, no text, no watermark, 16:9" │
   └──────────────────────────────────────────────────────────┘
                              ↓
2. KIE API SERVICE (Model Priority System)
   ┌──────────────────────────────────────────────────────────┐
   │ lib/kie/kie-api.ts                                       │
   │                                                          │
   │ Tries models in order:                                   │
   │  1. env.KIE_IMAGE_T2I_MODEL (if configured)             │
   │  2. 'google/nano-banana'     ← Currently used           │
   │  3. 'nano-banana-pro'                                    │
   │                                                          │
   │ First successful model generates the image               │
   └──────────────────────────────────────────────────────────┘
                              ↓
3. FILE SYSTEM (Standardized Path)
   ┌──────────────────────────────────────────────────────────┐
   │ public/blog/<slug>/hero.jpg  ← ALWAYS THIS PATH         │
   │                                                          │
   │ Examples:                                                │
   │  • public/blog/vibe-coding/hero.jpg                     │
   │  • public/blog/ai-grader-for-teachers.../hero.jpg       │
   │  • public/blog/best-college-ai-tools/hero.jpg           │
   └──────────────────────────────────────────────────────────┘
                              ↓
4. BLOG REGISTRY (Required Field)
   ┌──────────────────────────────────────────────────────────┐
   │ lib/blog/posts.ts                                        │
   │                                                          │
   │ {                                                        │
   │   slug: 'vibe-coding',                                   │
   │   title: '...',                                          │
   │   heroImageUrl: '/blog/vibe-coding/hero.jpg' ← REQUIRED │
   │ }                                                        │
   └──────────────────────────────────────────────────────────┘
                              ↓
5. RENDERING (Uniform Display)
   ┌──────────────────────────────────────────────────────────┐
   │ app/[locale]/blog/[...slug]/page.tsx                     │
   │                                                          │
   │ <img                                                     │
   │   src={post.heroImageUrl}                               │
   │   width={1280}              ← ENFORCED                  │
   │   height={720}              ← ENFORCED (16:9)           │
   │   className="mt-6 w-full rounded-xl border..."          │
   │   loading="eager"                                        │
   │ />                                                       │
   └──────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════

RESULT: Every blog hero image has:
  ✓ Same aspect ratio (16:9)
  ✓ Same resolution (2K)
  ✓ Same format (JPEG)
  ✓ Same visual style (clean editorial illustration)
  ✓ Same file path structure (public/blog/<slug>/hero.jpg)
  ✓ Same rendering dimensions (1280x720)
  ✓ Same CSS styling (rounded corners, border, shadow)

═══════════════════════════════════════════════════════════════════

USAGE:
  pnpm tsx scripts/generate-blog-hero.ts "slug" "Title" "keywords"

EXAMPLE:
  pnpm tsx scripts/generate-blog-hero.ts \
    "vibe-coding" \
    "Vibe Coding: The Future of AI-Powered Programming" \
    "vibe coding,AI programming,visual coding"
