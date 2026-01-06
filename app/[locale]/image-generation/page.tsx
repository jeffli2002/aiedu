'use client';

import { Suspense } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ImageGenerator from '@/components/image-generator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

/**
 * Image Generation Page - Editorial Minimal Design
 * Colors: Coral Orange (#ff6b35), Teal (#2ec4b6)
 * Typography: Instrument Serif (headlines), DM Sans (body)
 */

export default function ImageGenerationPage() {
  const t = useTranslations('imageGeneration');

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#fafaf9', fontFamily: '"DM Sans", system-ui, sans-serif' }}
    >
      <Navbar />
      <div className="flex-1 pt-24 pb-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div
          className="absolute top-20 right-[10%] w-48 h-48 rounded-full opacity-10 animate-float"
          style={{ backgroundColor: '#ff6b35' }}
        />
        <div
          className="absolute bottom-40 left-[5%] w-32 h-32 rounded-full opacity-10 animate-float"
          style={{ backgroundColor: '#2ec4b6', animationDelay: '2s' }}
        />

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(#1a1a2e 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6"
            >
              <Sparkles className="w-4 h-4" style={{ color: '#ff6b35' }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#1a1a2e' }}>
                AI Creation Studio
              </span>
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl mb-4 max-w-4xl mx-auto leading-tight"
              style={{
                fontFamily: '"Instrument Serif", Georgia, serif',
                color: '#1a1a2e'
              }}
            >
              {t('title')}
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#666' }}>
              {t('subtitle')}
            </p>
          </div>
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div
                  className="h-8 w-8 animate-spin rounded-full border-2"
                  style={{ borderColor: '#ff6b35', borderTopColor: 'transparent' }}
                />
              </div>
            }
          >
            <ImageGenerator />
          </Suspense>
        </div>
      </div>
      <Footer />
    </div>
  );
}
