import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAllPostsForLocale } from '@/lib/blog/posts';
import { buildLocaleCanonicalMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-static';

export function generateMetadata({ params }: { params: { locale: 'en' | 'zh' } }): Metadata {
  const { locale } = params;
  return {
    title: 'Blog | FuturAI',
    description: 'Insights and SEO articles about AI education and tools.',
    ...buildLocaleCanonicalMetadata(locale, '/blog'),
    openGraph: {
      title: 'Blog | FuturAI',
      description: 'Insights and SEO articles about AI education and tools.',
      url: `/${locale}/blog`,
      type: 'website',
    },
    twitter: {
      title: 'Blog | FuturAI',
      description: 'Insights and SEO articles about AI education and tools.',
      card: 'summary_large_image',
    },
  };
}

export default function BlogIndexPage({
  params,
}: {
  params: { locale: 'en' | 'zh' };
}) {
  const { locale } = params;
  const posts = getAllPostsForLocale(locale);

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <section className="max-w-5xl mx-auto px-6 pt-28 pb-16">
        <h1 className="sr-only">Blog</h1>
        <img
          src="/blog/_index/hero.jpg"
          alt="AI Education Blog hero image"
          className="w-full rounded-2xl border border-slate-100 shadow-sm"
          width={1280}
          height={720}
          loading="eager"
        />
      </section>
      <section className="max-w-5xl mx-auto px-6 pb-28">
        <div className="grid gap-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                <Link href={`/${locale}/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              {post.date ? (
                <div className="text-xs text-slate-400 mt-1">{new Date(post.date).toDateString()}</div>
              ) : null}
              <p className="text-slate-600 mt-3">{post.description}</p>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
