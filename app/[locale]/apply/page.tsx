import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildLocaleCanonicalMetadata } from '@/lib/seo/metadata';
import ApplyPageContent from '@/components/pages/ApplyPage';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const title = locale === 'zh' ? '课程报名 - FuturAI' : 'Apply for Programs - FuturAI';
  const description =
    locale === 'zh'
      ? '报名 FuturAI 课程与训练营，提交学生信息，获取学习与项目支持。'
      : 'Apply to FuturAI programs and camps to start your AI learning journey.';
  const keywords =
    locale === 'zh'
      ? ['课程报名', '训练营报名', 'AI教育', '报名表单']
      : ['program application', 'camp application', 'AI education', 'registration'];

  return {
    ...buildLocaleCanonicalMetadata(locale, '/apply'),
    title,
    description,
    keywords,
  };
}

export default function ApplyPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  return <ApplyPageContent />;
}
