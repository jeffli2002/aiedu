import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildLocaleCanonicalMetadata } from '@/lib/seo/metadata';
import ImageGenerationPageContent from '@/components/pages/ImageGenerationPage';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const title = locale === 'zh' ? 'AI 图像生成 - FuturAI' : 'AI Image Generation - FuturAI';
  const description =
    locale === 'zh'
      ? '用 FuturAI 进行高质量 AI 图像创作，适合课堂项目与创意表达。'
      : 'Create high-quality AI images with FuturAI for learning projects and creative expression.';
  const keywords =
    locale === 'zh'
      ? ['AI 图像生成', 'AI 创作', '图像生成器', '教育AI', '创意工具']
      : ['AI image generation', 'AI creation', 'image generator', 'AI education', 'creative tools'];

  return {
    ...buildLocaleCanonicalMetadata(locale, '/image-generation'),
    title,
    description,
    keywords,
  };
}

export default function ImageGenerationPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  return <ImageGenerationPageContent />;
}
