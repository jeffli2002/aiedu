import type { Metadata } from 'next';
import type { Locale } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import { buildLocaleCanonicalMetadata } from '@/lib/seo/metadata';
import PricingPageContent from '@/components/PricingPageContent';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const title = locale === 'zh' ? '定价 - FuturAI' : 'Pricing - FuturAI';
  const description =
    locale === 'zh'
      ? '查看 FuturAI 的订阅计划与积分包价格，选择适合你的 AI 学习与创作方案。'
      : 'Compare FuturAI subscription plans and credit packs for AI learning and creation.';
  const keywords =
    locale === 'zh'
      ? ['定价', '订阅计划', '积分包', 'AI学习', 'AI创作']
      : ['pricing', 'subscription plans', 'credit packs', 'AI learning', 'AI creation'];

  return {
    ...buildLocaleCanonicalMetadata(locale, '/pricing'),
    title,
    description,
    keywords,
  };
}

export default function PricingPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  return <PricingPageContent />;
}
