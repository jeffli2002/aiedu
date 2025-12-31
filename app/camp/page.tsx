'use client';

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CampPage() {
  const { t } = useTranslation();

  const outcomes = [
    { icon: '✅', text: t('camp.outcome1') },
    { icon: '🏆', text: t('camp.outcome2') },
    { icon: '📦', text: t('camp.outcome3') },
  ];

  return (
    <div className="pt-20 pb-20 min-h-screen bg-gradient-to-b from-white to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 mb-6">
            {t('camp.title')}
          </h1>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">
                  {t('camp.date')}
                </h3>
                <p className="text-xl text-gray-700">
                  {t('camp.dateValue')}
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">
                  {t('camp.format')}
                </h3>
                <p className="text-xl text-gray-700">
                  {t('camp.formatValue')}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
          >
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-6">
              {t('camp.outcomes')}
            </h3>
            <div className="space-y-4">
              {outcomes.map((outcome, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-primary-50 rounded-lg"
                >
                  <span className="text-3xl">{outcome.icon}</span>
                  <span className="text-lg text-gray-700">{outcome.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              href="/apply"
              className="inline-block px-8 py-4 text-lg font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 btn-primary"
            >
              {t('hero.cta')}
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}









