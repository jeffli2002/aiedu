---
name: seo-page-writer
description: Create and maintain SEO-friendly blog pages (pillars and supporting pages) in this Next.js App Router project with i18n. Use when asked to add a new SEO page from a URL or brief, set the Title Tag, Meta Description, and Keywords, place the page under a pillar (nested slug support), generate a local HTML snapshot for offline rendering, update the posts registry and sitemap, wire canonical metadata per locale, include an on-page FAQ section (how-to Q&A) and optional FAQPage JSON-LD, and optionally generate AI cover images via the KIE image API.
---

# SEO Page Writer

This skill guides creating high-quality, indexable SEO pages in this repository. It is optimized for the project’s existing blog system and i18n setup.

Works best for:
- Adding a new blog SEO page from a source URL or content brief
- Setting explicit Title Tag and Meta Description
- Placing a page under a pillar page (nested slugs like `best-college-ai-tools/ai-worksheet-generator`)
- Generating a local HTML snapshot for offline rendering and reliable builds
- Ensuring metadata, sitemap, and navigation stay in sync
- Enforcing breadcrumbs on SEO posts with BreadcrumbList JSON‑LD

Required inputs (example YAML)
```
slug: best-college-ai-tools/ai-worksheet-generator   # supports nested paths
title: Effortless Custom Worksheets: AI Worksheet Generator
description: Efficiently create personalized learning materials with an AI worksheet generator. Discover tools that enhance education with speed, customization, and quality.
sourceUrl: https://example.com/article-or-brief
locales: [en, zh]    # optional (defaults to [en, zh])
keywords: [ 'ai worksheet generator', 'teacher worksheet maker' ]
tags: [AI in education, worksheets, teacher tools]
date: 2026-01-05     # optional ISO date
# Optional word count goal (default: choose 1,500–5,000 based on intent)
wordCountGoal: 2500
```

Project assumptions
- Next.js App Router
- i18n routing at `app/[locale]/...`
- Blog registry at `lib/blog/posts.ts`
- Blog index at `app/[locale]/blog/page.tsx`
- Blog post route (catch‑all) at `app/[locale]/blog/[...slug]/page.tsx`
- Sitemap at `app/sitemap.ts` reading from the registry
- Local snapshots under `public/blog/<slug>.html`

Quick start (high‑confidence path)
1) Update registry: Append a `BlogPostMeta` entry in `lib/blog/posts.ts` with `slug`, `title`, `description`, optional `sourceUrl`, `locales`, `tags`, `date`.
2) Create snapshot: Add `public/blog/<slug>.html` with minimal HTML, Title Tag, and Meta Description (acts as offline fallback).
3) Routes: Ensure `app/[locale]/blog/[...slug]/page.tsx` exists (see code below). It will load the local snapshot, else fetch and sanitize remote HTML when allowed.
4) Sitemap: Ensure `app/sitemap.ts` imports `blogPosts` and appends `/blog/${post.slug}` entries for each locale (code below).
5) Blog index & Navbar: Index lists posts from the registry; Navbar contains “Blog” with i18n key `nav.blog`. Ensure list titles use `text-slate-900` for contrast.
6) Validate: Run TypeScript check (`pnpm typecheck`). Optionally run dev server.
7) FAQs: Add a “FAQs” section with 3–6 high‑intent “How to …” questions and concise answers; include FAQPage JSON‑LD when possible.

Length & depth targets
- Aim for 1,500–5,000 words of original content depending on keyword difficulty and intent.
- Pillar pages: typically 2,500–4,000 words covering definitions, comparisons, walkthroughs, and FAQs.
- Supporting pages: typically 1,500–2,500 words with focused depth and strong internal linking.
- Prioritize clarity and usefulness over padding; include visuals, examples, and a comparison table when helpful.

Required: Generate a hero/cover image via KIE (AI)
- Prereqs:
  - Ensure `KIE_API_KEY` is set in `.env.local` and validated by `env.ts`.
  - KIE image models can be configured with `KIE_IMAGE_T2I_MODEL`/`KIE_IMAGE_I2I_MODEL` (defaults exist).
- Prompt template (edit to fit the page theme):
  - Base: `${title} — ${keywords.join(', ')}`
  - Style hints: "clean editorial illustration, minimal, high contrast, no text, no watermark, 16:9 hero banner"
  - Negative: "text, watermark, logo, deformed"
- Recommended params:
  - Model: `nano-banana-pro`
  - Aspect: `16:9` (or `21:9`), Resolution: `2K`, Format: `jpeg`
- Where to save: `public/blog/<slug>/hero.jpg` then set `heroImageUrl: '/blog/<slug>/hero.jpg'` in the registry entry (mandatory for all SEO pages).

Existing script in this repo (ready to use)

```
// Usage: node scripts/generate-blog-hero.cjs <slug> "<title>" "k1,k2,k3"
// Saves hero to public/blog/<slug>/hero.jpg using KIE (requires KIE_API_KEY)
```

CLI script pattern (add to `scripts/generate-blog-hero.ts` in repo)
```ts
// Usage: pnpm tsx scripts/generate-blog-hero.ts <slug> "<title>" "k1,k2,k3"
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getKieApiService } from '@/lib/kie/kie-api';

async function main() {
  const [slug, title, keywordsCsv] = process.argv.slice(2);
  if (!slug || !title) {
    console.error('Usage: pnpm tsx scripts/generate-blog-hero.ts <slug> "<title>" "k1,k2"');
    process.exit(1);
  }
  const keywords = (keywordsCsv || '').split(',').map((s) => s.trim()).filter(Boolean);
  const theme = `${title} — ${keywords.join(', ')}`;
  const prompt = `${theme}. clean editorial illustration, minimal, high contrast, professional blog cover, no text, no watermark, 16:9`;

  const service = getKieApiService();
  const task = await service.generateImage(
    { prompt, aspect_ratio: '16:9', resolution: '2K', outputFormat: 'jpeg' },
    'nano-banana-pro'
  );
  const { imageUrl } = await service.pollTaskStatus(task.data.taskId, 'image', 80, 3000);
  if (!imageUrl) throw new Error('No imageUrl returned');

  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());

  const outDir = path.join(process.cwd(), 'public', 'blog', slug);
  await mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, 'hero.jpg');
  await writeFile(outPath, buf);
  console.log('Saved hero image to:', outPath);
  console.log('Set heroImageUrl to:', `/blog/${slug}/hero.jpg`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

Registry (hero image field — mandatory)
```ts
// lib/blog/posts.ts
export interface BlogPostMeta {
  // ... existing fields
  heroImageUrl: string; // e.g. '/blog/<slug>/hero.jpg' (required)
}
```

Rendering policy
- Every SEO page must render a HERO image at the top: `<img src={post.heroImageUrl} ... />` with `alt="${post.title} – blog cover image"`.
- Styling: `className="mt-6 w-full rounded-xl border border-slate-100 shadow-sm"`, `loading="eager"`, `width={1280}`, `height={720}`.

Layout & styling policy
- Article container width: `max-w-5xl mx-auto px-6 py-32` for consistency across SEO pages.
- Content block (applied to rendered HTML):
  - `className="max-w-none bg-white border border-slate-100 rounded-2xl p-6 text-slate-800 leading-7 [&_h1]:text-2xl [&_h1]:leading-tight [&_h1]:mt-10 [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:leading-snug [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:leading-snug [&_h3]:mt-8 [&_h3]:mb-2 [&_p]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1.5 [&_img]:my-6 [&_a]:text-blue-600 [&_a:hover]:underline"`
- FAQ card styling (mandatory structure):
  - Wrapper: `id="faqs"` section with `bg-white border border-slate-100 rounded-2xl p-6 shadow-sm`
  - Heading: `text-2xl font-bold text-slate-900 mb-6`
  - Items: use `<dl>` with each item `border-t border-slate-100 pt-6` (first item without top border), `dt` as question `text-lg font-semibold text-slate-900`, `dd` as answer `mt-2 text-slate-800 leading-relaxed`.

Breadcrumbs
- Show a breadcrumb bar above the title: `Home › Blog › Post Title` with locale-aware links.
- Include BreadcrumbList JSON‑LD on the page.

Blog index hero
- The blog index uses a hero image at `public/blog/_index/hero.jpg` and darkened titles (`text-slate-900`).

Registry entry (append to `lib/blog/posts.ts`)
```ts
{
  slug: '<slug>',
  title: '<title>',
  description: '<meta-description>',
  sourceUrl: '<source-url>', // optional
  locales: ['en', 'zh'],
  keywords: ['k1', 'k2'],
  tags: ['education', 'ai'], // optional
  date: '2026-01-05',        // optional
  // Optional hero image rendered at top of the article
  // heroImageUrl: '/blog/<slug>/hero.jpg',
  // Optional FAQ section rendered on page and exported as FAQPage JSON-LD
  faqs: [
    { question: 'How to use <tool> for <task>?', answer: 'Answer in 1–2 sentences, then steps if helpful.' },
  ],
},
```

Local snapshot (create `public/blog/<slug>.html`)
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title><!-- Title Tag --></title>
    <meta name="description" content="<!-- Meta Description -->" />
  </head>
  <body>
    <main>
      <article>
        <h1><!-- H1 same as title --></h1>
        <!-- Optional: safe excerpt or outline (no duplication of third‑party content) -->
        <!-- Do NOT include FAQs here; FAQs live only in the registry to avoid duplication. -->
      </article>
    </main>
  </body>
  </html>
```

Catch‑all blog route (ensure `app/[locale]/blog/[...slug]/page.tsx` exists)
```ts
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import { getPostBySlug } from '@/lib/blog/posts';
import { buildLocaleCanonicalMetadata } from '@/lib/seo/metadata';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { locales, type Locale } from '@/i18n/routing';

export const dynamic = 'force-static';
type Params = { locale: Locale; slug: string[] };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const slugPath = params.slug.join('/');
  const post = getPostBySlug(slugPath);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    ...buildLocaleCanonicalMetadata(params.locale, `/blog/${post.slug}`),
    openGraph: { title: post.title, description: post.description, type: 'article', url: `/${params.locale}/blog/${post.slug}` },
    twitter: { title: post.title, description: post.description, card: 'summary_large_image' },
    keywords: post.keywords,
  };
}

export function generateStaticParams(): Params[] {
  const { blogPosts } = require('@/lib/blog/posts');
  const slugArrays: string[][] = blogPosts.map((p: any) => String(p.slug).split('/'));
  const params: Params[] = [];
  for (const locale of locales) for (const slug of slugArrays) params.push({ locale, slug });
  return params;
}

function stripTags(input: string, tag: string): string {
  const pattern = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi');
  return input.replace(pattern, '');
}
function sanitizeHtml(html: string): string {
  let out = html;
  out = stripTags(out, 'script');
  out = stripTags(out, 'style');
  out = stripTags(out, 'noscript');
  out = out.replace(/ on[a-z]+=\"[^\"]*\"/gi, '').replace(/ on[a-z]+='[^']*'/gi, '');
  return out;
}
function extractMainContent(html: string): string | null {
  const tryExtract = (start: string, end: string) => {
    const lower = html.toLowerCase();
    const s = lower.indexOf(start);
    const e = lower.lastIndexOf(end);
    return s !== -1 && e !== -1 && e > s ? html.slice(s, e + end.length) : null;
  };
  return tryExtract('<article', '</article>') || tryExtract('<main', '</main>') || tryExtract('<body', '</body>');
}
async function fetchArticleHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
    if (!res.ok) return null;
    const html = await res.text();
    const extracted = extractMainContent(html) ?? html;
    return sanitizeHtml(extracted);
  } catch { return null; }
}
async function loadLocalSnapshot(slugPath: string): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'blog', `${slugPath}.html`);
    const html = await fs.readFile(filePath, 'utf8');
    const extracted = extractMainContent(html) ?? html;
    return sanitizeHtml(extracted);
  } catch { return null; }
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const slugPath = params.slug.join('/');
  const post = getPostBySlug(slugPath);
  if (!post) notFound();
  const localHtml = await loadLocalSnapshot(post.slug);
  const remoteHtml = localHtml ?? (post.sourceUrl ? await fetchArticleHtml(post.sourceUrl) : null);
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <article className="max-w-3xl mx-auto px-6 py-32">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          {post.description ? (<p className="text-slate-600 mt-2">{post.description}</p>) : null}
        </header>
        {remoteHtml ? (
          <div className="max-w-none bg-white border border-slate-100 rounded-2xl p-6 text-slate-800 leading-7 [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_p]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_img]:my-4 [&_a]:text-blue-600 [&_a:hover]:underline" dangerouslySetInnerHTML={{ __html: remoteHtml }} />
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl p-6"><p className="text-slate-600">Unable to load external content.</p></div>
        )}
      </article>
      <Footer />
    </main>
  );
}
```

Sitemap integration (ensure `app/sitemap.ts`)
```ts
import { blogPosts } from '@/lib/blog/posts';
// ...existing sitemap code...
for (const post of blogPosts) {
  entries.push(...createSitemapEntry(`/blog/${post.slug}`, 0.7, 'weekly'));
}
```

JSON‑LD templates (drop into the post page when requested)
```json
// Article
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "<title>",
  "description": "<meta-description>",
  "inLanguage": "en",
  "author": { "@type": "Organization", "name": "Future AI Creators" }
}
```
```json
// FAQPage (example)
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "What is <X>?", "acceptedAnswer": {"@type": "Answer", "text": "..."}}
  ]
}
```

Content authoring guidelines
- Use original writing; do not copy third‑party text. If summarizing, write from scratch and cite sources.
- Align H1 with the Title Tag; keep one H1 per page. Use descriptive H2/H3s.
- Place primary keyword in H1, early in the intro, and once in a subheading if natural.
- Keep Meta Description within ~150–160 characters and compelling.
- Add internal links (pillar ↔ supporting) and relevant site pages.
- Include accessibility: alt text, clear headings, readable contrast.
- Include FAQs: target “how to” intents; ensure answers match page scope; keep consistent phrasing; include FAQPage JSON‑LD when possible.
- Meet length target: ensure final article falls within 1,500–5,000 words based on keyword and page type.

Safety and sourcing
- If fetching external HTML, sanitize before rendering and prefer local snapshots.
- Respect content licensing. When in doubt, use summaries, original content, or link out.

Verification checklist
- [ ] Registry entry added
- [ ] Snapshot created at `public/blog/<slug>.html`
- [ ] Page renders for both locales
- [ ] Canonical URL correct per locale
- [ ] Appears in blog index and sitemap
- [ ] Title/Meta match the request
- [ ] Optional JSON‑LD added when appropriate
- [ ] Content length within 1,500–5,000 words (pillar/supporting appropriate)
- [ ] HERO image present and visible (`heroImageUrl` set and renders at top)
