import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/routing';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/auth/auth-provider';
import ScrollGuard from '@/components/ScrollGuard';
import { I18nProvider } from '@/components/I18nProvider';
import { getSiteUrl } from '@/lib/seo/site-url';

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// SEO metadata with hreflang
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const baseUrl = getSiteUrl();

  const title = locale === 'zh'
    ? 'Real Magic AI — 让AI变成真实技能'
    : 'Real Magic AI | Practical AI Education & Real-World Skills';

  const description = locale === 'zh'
    ? 'Futurai 是一个以 Real Magic AI 为核心的 AI 教育平台，用实用的 AI 学习帮助学生与专业人士理解并应用人工智能。'
    : 'Real Magic AI is an AI education platform focused on practical skills, AI literacy, and real-world applications for students and professionals.';

  const keywords = locale === 'zh'
    ? ['Real Magic AI', 'AI教育', 'AI学习平台', '实用AI技能', 'AI素养', '生成式AI教育', '应用AI学习']
    : [
        'Real Magic AI',
        'AI education',
        'AI learning platform',
        'practical AI skills',
        'AI literacy',
        'generative AI education',
        'applied AI learning',
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'en': `${baseUrl}/en`,
        'zh': `${baseUrl}/zh`,
        'x-default': `${baseUrl}/zh`,
      },
    },
    openGraph: {
      title,
      description,
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      alternateLocale: locale === 'zh' ? ['en_US'] : ['zh_CN'],
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming locale is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Fetch messages for the locale
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <I18nProvider>
        <AuthProvider />
        <Suspense fallback={null}>
          <ScrollGuard />
        </Suspense>
        {children}
        <Toaster />
      </I18nProvider>
    </NextIntlClientProvider>
  );
}
