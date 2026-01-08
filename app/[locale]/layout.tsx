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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://futureai.edu';

  const title = locale === 'zh'
    ? 'Real Magic AI — 让AI变成真实技能'
    : 'Real Magic AI — Turning AI into Real Skills';

  return {
    title,
    description: locale === 'zh'
      ? '让孩子掌握面向未来AI世界的能力'
      : 'Empower students to thrive in the AI-driven future',
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
