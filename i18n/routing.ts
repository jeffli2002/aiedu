import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'zh',
  localePrefix: 'always', // Always show locale prefix for SEO
  localeDetection: true, // Auto-detect locale from browser
});

// Locale display names for UI
export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
};
