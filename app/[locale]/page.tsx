'use client';

import { useLocale } from 'next-intl';
import HomePage from '@/components/pages/HomePage';
import type { Language } from '@/translations';

export default function LocaleHomePage() {
  const locale = useLocale();
  const lang: Language = locale === 'en' ? 'en' : 'cn';
  return <HomePage lang={lang} />;
}

