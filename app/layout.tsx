import './globals.css';
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import { cookies, headers } from 'next/headers';
import Script from 'next/script';
import { getMetadataBase } from '@/lib/seo/metadata';

// Primary body font
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerLocale = headers().get('x-next-intl-locale') || '';
  const cookieLocale =
    cookies().get('language')?.value || cookies().get('NEXT_LOCALE')?.value || '';
  const rawLocale = headerLocale || cookieLocale || 'zh';
  const lang = rawLocale.toLowerCase().startsWith('en') ? 'en' : 'zh';

  return (
    <html lang={lang} className={dmSans.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7WM6RF5B1C"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-7WM6RF5B1C');`}
        </Script>
      </head>
      <body className="antialiased bg-grid">{children}</body>
    </html>
  );
}
