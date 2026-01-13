import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildLocaleCanonicalMetadata } from '@/lib/seo/metadata';
import ProjectsPageContent from '@/components/pages/ProjectsPage';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const title = locale === 'zh' ? '项目展示 - FuturAI' : 'Projects Showcase - FuturAI';
  const description =
    locale === 'zh'
      ? '探索 FuturAI 学员的 AI 创作项目与真实作品案例。'
      : 'Explore real-world AI projects created by FuturAI learners.';
  const keywords =
    locale === 'zh'
      ? ['项目展示', 'AI作品集', '学生项目', 'AI创作']
      : ['projects', 'AI portfolio', 'student projects', 'AI creation'];

  return {
    ...buildLocaleCanonicalMetadata(locale, '/projects'),
    title,
    description,
    keywords,
  };
}

export default function ProjectsPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  return <ProjectsPageContent />;
}
