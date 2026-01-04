'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { useEffect } from 'react';

// Helper to detect locale from URL path
function getLocaleFromPath(): string | null {
  if (typeof window === 'undefined') return null;
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const maybeLocale = pathSegments[0];
  if (maybeLocale === 'en' || maybeLocale === 'zh') {
    return maybeLocale;
  }
  return null;
}

// Always render the provider so useTranslation has a stable context
// i18n is initialized synchronously in lib/i18n.ts to avoid hydration mismatches
export function I18nProvider({ children }: { children: React.ReactNode }) {
  // After hydration, sync to URL path locale first, then stored preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Priority: URL path > localStorage > document.lang
    const pathLocale = getLocaleFromPath();
    const stored = window.localStorage?.getItem('language');
    const targetLang = pathLocale || stored || 'zh';

    if (targetLang && targetLang !== i18n.language) {
      i18n.changeLanguage(targetLang);
      if (document?.documentElement) document.documentElement.lang = targetLang;
      // Update localStorage to match URL
      if (pathLocale) {
        try {
          window.localStorage?.setItem('language', pathLocale);
        } catch {}
      }
    }

    const onChanged = (lng: string) => {
      try {
        window.localStorage?.setItem('language', lng);
      } catch {}
      if (document?.documentElement) document.documentElement.lang = lng;
    };
    i18n.on('languageChanged', onChanged);
    return () => {
      i18n.off('languageChanged', onChanged);
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
