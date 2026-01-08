import type { Locale } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import PricingPageContent from '@/components/PricingPageContent';

export default function PricingPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  return <PricingPageContent />;
}
