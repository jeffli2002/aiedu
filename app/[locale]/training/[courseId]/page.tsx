import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/routing';
import { getSiteUrl } from '@/lib/seo/site-url';
import { TRAINING_SYSTEM, type Module } from '@/lib/training-system';
import CourseLandingPage from '@/components/CourseLandingPage';

const ALL_COURSE_IDS = Array.from(
  new Set(
    Object.values(TRAINING_SYSTEM)
      .flatMap((system) => [
        ...system.foundations,
        ...system.creation,
        ...system.efficiency,
        ...system.vibe,
      ])
      .map((course) => course.id)
  )
);

// Normalize old IDs (e.g. f1 -> f101, c2 -> c202).
function normalizeCourseId(id: string): string {
  if (!id) return id;
  const match = id.match(/^([fcev])(\d)$/i);
  if (match) {
    const letter = match[1].toLowerCase();
    const idxMap: Record<string, string> = { f: '1', c: '2', e: '3', v: '4' };
    const moduleIndex = idxMap[letter] || '1';
    const padded = match[2].padStart(2, '0');
    return `${letter}${moduleIndex}${padded}`;
  }
  return id.toLowerCase();
}

function getCourse(locale: Locale, courseId: string): Module | null {
  const lang = locale === 'zh' ? 'zh' : 'en';
  const system = TRAINING_SYSTEM[lang];
  const allCourses = [
    ...system.foundations,
    ...system.creation,
    ...system.efficiency,
    ...system.vibe,
  ];
  return allCourses.find((course) => course.id === courseId) || null;
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    ALL_COURSE_IDS.map((courseId) => ({ locale, courseId }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; courseId: string };
}): Promise<Metadata> {
  const normalizedCourseId = normalizeCourseId(params.courseId);
  const course = getCourse(params.locale, normalizedCourseId);

  if (!course) {
    notFound();
  }

  const baseUrl = getSiteUrl();
  const path = `/training/${normalizedCourseId}`;
  const canonical = `${baseUrl}/${params.locale}${path}`;
  const languages = {
    en: `${baseUrl}/en${path}`,
    zh: `${baseUrl}/zh${path}`,
    'x-default': `${baseUrl}/zh${path}`,
  };

  const title =
    params.locale === 'zh'
      ? `${course.title} | AI 课程训练营`
      : `${course.title} | AI Training Program`;
  const description = course.description;
  const keywords =
    params.locale === 'zh'
      ? ['AI课程', '课程训练营', '项目制学习', ...course.skills]
      : ['AI training', 'project-based learning', ...course.skills];

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
      locale: params.locale === 'zh' ? 'zh_CN' : 'en_US',
      alternateLocale: params.locale === 'zh' ? ['en_US'] : ['zh_CN'],
    },
  };
}

export default function CoursePage({
  params,
}: {
  params: { locale: Locale; courseId: string };
}) {
  setRequestLocale(params.locale);

  const normalizedCourseId = normalizeCourseId(params.courseId);
  if (normalizedCourseId !== params.courseId) {
    redirect(`/${params.locale}/training/${normalizedCourseId}`);
  }

  const course = getCourse(params.locale, normalizedCourseId);
  if (!course) {
    notFound();
  }

  return <CourseLandingPage course={course} />;
}
