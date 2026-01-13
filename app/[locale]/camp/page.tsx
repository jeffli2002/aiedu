import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildLocaleCanonicalMetadata } from '@/lib/seo/metadata';
import CampPageContent from '@/components/pages/CampPage';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const title = locale === 'zh' ? '冬季创作营 - FuturAI' : 'Winter AI Camp - FuturAI';
  const description =
    locale === 'zh'
      ? 'FuturAI 冬季 AI 创作营，沉浸式项目制学习，打造真实作品。'
      : 'Join the FuturAI winter AI camp for immersive, project-based learning and creation.';
  const keywords =
    locale === 'zh'
      ? ['AI 创作营', '冬令营', '项目制学习', '青少年AI']
      : ['AI camp', 'winter camp', 'project-based learning', 'youth AI'];

  return {
    ...buildLocaleCanonicalMetadata(locale, '/camp'),
    title,
    description,
    keywords,
  };
}

export default function CampPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  return <CampPageContent />;
}
