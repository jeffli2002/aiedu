'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TRAINING_SYSTEM, Module } from '@/lib/training-system';
import CourseLandingPage from '@/components/CourseLandingPage';

export default function CoursePage() {
  const params = useParams();
  const courseId = params?.courseId as string;
  const { i18n } = useTranslation();
  const [course, setCourse] = useState<Module | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!courseId || !isClient || !i18n.isInitialized) return;

    const lang = i18n.language === 'zh' ? 'zh' : 'en';
    const system = TRAINING_SYSTEM[lang];
    const allCourses = [
      ...system.foundations,
      ...system.creation,
      ...system.efficiency,
      ...system.vibe,
    ];
    
    const foundCourse = allCourses.find(c => c.id === courseId);
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

