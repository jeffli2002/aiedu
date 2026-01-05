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

  const meta: Metadata = {
    title: post.title,
    description: post.description,
    ...buildLocaleCanonicalMetadata(params.locale, `/blog/${post.slug}`),
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `/${params.locale}/blog/${post.slug}`,
    },
    twitter: {
      title: post.title,
      description: post.description,
      card: 'summary_large_image',
    },
    keywords: post.keywords,
  };
  return meta;
}

export function generateStaticParams(): Params[] {
  // Pre-render all slugs for all locales based on registry
  const { blogPosts } = require('@/lib/blog/posts');
  const slugArrays: string[][] = blogPosts.map((p: any) => String(p.slug).split('/'));
  const params: Params[] = [];
  for (const locale of locales) {
    for (const slug of slugArrays) params.push({ locale, slug });
  }
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
  // Remove inline event handlers
  out = out.replace(/ on[a-z]+=\"[^\"]*\"/gi, '');
  out = out.replace(/ on[a-z]+='[^']*'/gi, '');
  return out;
}

function extractMainContent(html: string): string | null {
  const tryExtract = (start: string, end: string) => {
    const lower = html.toLowerCase();
    const s = lower.indexOf(start);
    const e = lower.lastIndexOf(end);
    if (s !== -1 && e !== -1 && e > s) return html.slice(s, e + end.length);
    return null;
  };
  return (
    tryExtract('<article', '</article>') ||
    tryExtract('<main', '</main>') ||
    tryExtract('<body', '</body>')
  );
}

async function fetchArticleHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
    if (!res.ok) return null;
    const html = await res.text();
    const extracted = extractMainContent(html) ?? html;
    return sanitizeHtml(extracted);
  } catch {
    return null;
  }
}

async function loadLocalSnapshot(slugPath: string): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'blog', `${slugPath}.html`);
    const html = await fs.readFile(filePath, 'utf8');
    const extracted = extractMainContent(html) ?? html;
    return sanitizeHtml(extracted);
  } catch {
    return null;
  }
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const slugPath = params.slug.join('/');
  const post = getPostBySlug(slugPath);
  if (!post) notFound();

  const localHtml = await loadLocalSnapshot(post.slug);
  const remoteHtml = localHtml ?? (post.sourceUrl ? await fetchArticleHtml(post.sourceUrl) : null);
  const faqJsonLd = post.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null;
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `/${params.locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `/${params.locale}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `/${params.locale}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <article className="max-w-5xl mx-auto px-6 py-32">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500">
          <a href={`/${params.locale}`} className="hover:underline">Home</a>
          <span className="mx-2">›</span>
          <a href={`/${params.locale}/blog`} className="hover:underline">Blog</a>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{post.title}</span>
        </nav>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">{post.title}</h1>
          {post.description ? (
            <p className="text-slate-600 mt-2">{post.description}</p>
          ) : null}
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
        </header>

        {remoteHtml ? (
          <div
            className="max-w-none bg-white border border-slate-100 rounded-2xl p-6 text-slate-800 leading-7 [&_h1]:text-2xl [&_h1]:leading-tight [&_h1]:mt-10 [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:leading-snug [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:leading-snug [&_h3]:mt-8 [&_h3]:mb-2 [&_p]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1.5 [&_img]:my-6 [&_a]:text-blue-600 [&_a:hover]:underline"
            dangerouslySetInnerHTML={{ __html: remoteHtml }}
          />
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl p-6">
            <p className="text-slate-600">
              Unable to load external content. Please visit the original article:
              {post.sourceUrl ? (
                <a
                  href={post.sourceUrl}
                  className="text-blue-600 underline ml-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {post.sourceUrl}
                </a>
              ) : null}
            </p>
          </div>
        )}
        {/* FAQ Section (if provided) */}
        {post.faqs?.length ? (
          <section id="faqs" className="mt-16">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">FAQs</h2>
              <dl className="space-y-6">
                {post.faqs.map((f) => (
                  <div key={f.question} className="border-t first:border-t-0 border-slate-100 pt-6 first:pt-0">
                    <dt className="text-lg font-semibold text-slate-900">{f.question}</dt>
                    <dd className="mt-2 text-slate-800 leading-relaxed">{f.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        ) : null}
      </article>
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Footer />
    </main>
  );
}
