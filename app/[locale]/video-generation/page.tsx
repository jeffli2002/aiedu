'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import VideoGenerator from '@/components/video-generator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function VideoGenerationPage() {
  const t = useTranslations('videoGeneration');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-slate-900 mb-4">
              {t('title')}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <VideoGenerator />
          </Suspense>
        </div>
      </div>
      <Footer />
    </div>
  );
}
