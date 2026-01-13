import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildLocaleCanonicalMetadata } from '@/lib/seo/metadata';
import HomePage from '@/components/pages/HomePage';
import type { Language } from '@/translations';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const title = locale === 'zh'
    ? 'Real Magic AI — 让AI变成真实技能'
    : 'Real Magic AI | Practical AI Education & Real-World Skills';
  const description = locale === 'zh'
    ? 'Futurai 是一个以 Real Magic AI 为核心的 AI 教育平台，用实用的 AI 学习帮助学生与专业人士理解并应用人工智能。'
    : 'Real Magic AI is an AI education platform focused on practical skills, AI literacy, and real-world applications for students and professionals.';
  const keywords = locale === 'zh'
    ? ['Real Magic AI', 'AI教育', 'AI学习平台', '实用AI技能', 'AI素养', '生成式AI教育', '应用AI学习']
    : [
        'Real Magic AI',
        'AI education',
        'AI learning platform',
        'practical AI skills',
        'AI literacy',
        'generative AI education',
        'applied AI learning',
      ];

  return {
    ...buildLocaleCanonicalMetadata(locale, '/'),
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      alternateLocale: locale === 'zh' ? ['en_US'] : ['zh_CN'],
    },
  };
}

export default function LocaleHomePage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const lang: Language = locale === 'en' ? 'en' : 'cn';
  return <HomePage lang={lang} />;
}
