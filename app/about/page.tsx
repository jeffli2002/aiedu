'use client';

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const { t } = useTranslation();

  const sections = [
    {
      title: t('about.vision.title'),
      content: t('about.vision.content'),
      icon: '💡',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: t('about.mission.title'),
      content: t('about.mission.content'),
      icon: '🚀',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: t('about.method.title'),
      content: t('about.method.content'),
      icon: '🎯',
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="pt-20 pb-20 min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 mb-6">
            {t('about.title')}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${section.gradient} flex items-center justify-center text-4xl mb-6`}>
                {section.icon}
              </div>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                {section.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {t('value.title')}
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {t('value.description')}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}









