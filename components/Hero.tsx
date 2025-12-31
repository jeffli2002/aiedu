'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  const { t } = useTranslation();
  const heroVideoSrc =
    process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_HERO_VIDEO_URL
      ? process.env.NEXT_PUBLIC_HERO_VIDEO_URL
      : '/herovideo.mp4';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* 渐变背景 */}
      <div className="absolute inset-0 gradient-bg opacity-10"></div>
      
      {/* 装饰性网格 */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNHoiIHN0cm9rZT0iIzBkYTJlOSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent animate-gradient">
            {t('hero.title')}
          </h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl lg:text-3xl font-medium text-slate-100 mb-4"
          >
            {t('hero.subtitle')}
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-slate-400 mb-12 max-w-3xl mx-auto"
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/apply"
              className="px-8 py-4 text-lg font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 btn-primary"
            >
              {t('hero.cta')}
            </Link>
            <button className="px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:border-primary-600 hover:text-primary-600 transition-all duration-300">
              {t('hero.watchVideo')}
            </button>
          </motion.div>
        </motion.div>

        {/* 视频占位区域 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="relative aspect-video bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl overflow-hidden shadow-2xl">
            <video
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-label="Hero video"
            >
              <source src={heroVideoSrc} type="video/mp4" />
              {t('hero.watchVideo')}
            </video>
          </div>
        </motion.div>
      </div>

      {/* 滚动指示器 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </motion.div>
    </section>
  );
}









