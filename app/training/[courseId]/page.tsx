'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TRAINING_SYSTEM, Module } from '@/lib/training-system';
import CourseLandingPage from '@/components/CourseLandingPage';

export default function CoursePage() {
  const params = useParams();
  const courseId = (params?.courseId as string) || '';
  const { i18n } = useTranslation();
  const [course, setCourse] = useState<Module | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Normalize old IDs (e.g. f1 -> f101, c2 -> c202, etc.)
  const normalizeCourseId = (id: string): string => {
    if (!id) return id;
    const mOld = id.match(/^([fcev])(\d)$/i);
    if (mOld) {
      const letter = mOld[1].toLowerCase();
      const idxMap: Record<string, string> = { f: '1', c: '2', e: '3', v: '4' };
      const moduleIndex = idxMap[letter] || '1';
      const cc = mOld[2].padStart(2, '0');
      return `${letter}${moduleIndex}${cc}`;
    }
    return id.toLowerCase();
  };

  useEffect(() => {
    if (!courseId || !isClient || !i18n.isInitialized) return;

    const normId = normalizeCourseId(courseId);
    if (normId !== courseId) {
      // Update URL to new ID format
      window.history.replaceState(null, '', `/training/${normId}`);
    }

    const lang = i18n.language === 'zh' ? 'zh' : 'en';
    const system = TRAINING_SYSTEM[lang];
    const allCourses = [
      ...system.foundations,
      ...system.creation,
      ...system.efficiency,
      ...system.vibe,
    ];

    const foundCourse = allCourses.find((c) => c.id === normId);
    setCourse(foundCourse || null);
  }, [courseId, isClient, i18n.isInitialized, i18n.language]);

  const { t } = useTranslation();

  if (!isClient || !i18n.isInitialized || !course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">
            {isClient && i18n.isInitialized ? t('common.loading') : '加载中...'}
          </p>
        </div>
      </div>
    );
  }

  return <CourseLandingPage course={course} />;
}
