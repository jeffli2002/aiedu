import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/routing';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/auth/auth-provider';
import ScrollGuard from '@/components/ScrollGuard';
import { I18nProvider } from '@/components/I18nProvider';

// Primary body font
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
});

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

  return {
    title: locale === 'zh'
      ? 'Future AI Creators | 未来AI创造者'
      : 'Future AI Creators | AI Education for K12',
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
    <html lang={locale} className={dmSans.variable}>
      <head>
        {/* Preconnect to Google Fonts for Instrument Serif */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased bg-grid">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <I18nProvider>
            <AuthProvider />
            <ScrollGuard />
            {children}
            <Toaster />
          </I18nProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
