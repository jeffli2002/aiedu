import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, Poppins } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/components/I18nProvider';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/auth/auth-provider';

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

export const metadata: Metadata = {
  title: 'Future AI Creators | 未来AI创造者',
  description: 'Empower students to thrive in the AI-driven future',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" className={`${inter.variable} ${poppins.variable} ${plusJakarta.variable}`}>
      <body className="antialiased bg-grid">
        <I18nProvider>
          <AuthProvider />
          {children}
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}

