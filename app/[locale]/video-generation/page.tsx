import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildLocaleCanonicalMetadata } from '@/lib/seo/metadata';
import VideoGenerationPageContent from '@/components/pages/VideoGenerationPage';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const title = locale === 'zh' ? 'AI 视频生成 - FuturAI' : 'AI Video Generation - FuturAI';
  const description =
    locale === 'zh'
      ? '用 FuturAI 快速生成高质量 AI 视频，适合课堂项目与创意展示。'
      : 'Generate high-quality AI videos quickly with FuturAI for projects and creative showcases.';
  const keywords =
    locale === 'zh'
      ? ['AI 视频生成', '视频生成器', 'AI 创作', '教育AI', '创意工具']
      : ['AI video generation', 'video generator', 'AI creation', 'AI education', 'creative tools'];

  return {
    ...buildLocaleCanonicalMetadata(locale, '/video-generation'),
    title,
    description,
    keywords,
  };
}

export default function VideoGenerationPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  return <VideoGenerationPageContent />;
}
