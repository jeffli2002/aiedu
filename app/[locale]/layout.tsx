import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, Poppins } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/routing';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/auth/auth-provider';
import ScrollGuard from '@/components/ScrollGuard';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
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
    <html
      lang={locale}
      className={`${inter.variable} ${poppins.variable} ${plusJakarta.variable}`}
    >
      <body className="antialiased bg-grid">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider />
          <ScrollGuard />
          {children}
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
