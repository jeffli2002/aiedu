import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { getSiteUrl } from '@/lib/seo/site-url';
import TrainingPageContent from '@/components/TrainingPageContent';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const baseUrl = getSiteUrl();
  const path = '/training';
  const canonical = `${baseUrl}/${locale}${path}`;
  const languages = {
    en: `${baseUrl}/en${path}`,
    zh: `${baseUrl}/zh${path}`,
    'x-default': `${baseUrl}/zh${path}`,
  };

  const title =
    locale === 'zh' ? 'AI 课程训练营 | Real Magic AI' : 'AI Training Program | Real Magic AI';
  const description =
    locale === 'zh'
      ? '系统化 AI 课程路径，从基础到项目实践，帮助学生建立真实技能与作品集。'
      : 'A structured AI training path from fundamentals to hands-on projects and portfolio-ready outcomes.';
  const keywords =
    locale === 'zh'
      ? ['AI课程', '青少年AI教育', 'AI训练营', '项目制学习', 'AI素养']
      : ['AI training', 'AI education', 'project-based learning', 'AI literacy', 'youth AI'];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      alternateLocale: locale === 'zh' ? ['en_US'] : ['zh_CN'],
    },
  };
}

export default function TrainingLocalePage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  return <TrainingPageContent />;
}
