'use client';

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function ValueProposition() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gradient-to-b from-white to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            {t('value.title')}
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
            {t('value.description')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}










