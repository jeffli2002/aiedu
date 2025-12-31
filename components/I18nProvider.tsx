'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { useEffect } from 'react';

// Always render the provider so useTranslation has a stable context
// i18n is initialized synchronously in lib/i18n.ts to avoid hydration mismatches
export function I18nProvider({ children }: { children: React.ReactNode }) {
  // After hydration, sync to stored preference (without breaking initial match)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage?.getItem('language');
    if (stored && stored !== i18n.language) {
      i18n.changeLanguage(stored);
      if (document?.documentElement) document.documentElement.lang = stored;
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
