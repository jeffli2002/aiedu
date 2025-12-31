'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CTA() {
  const { t } = useTranslation();

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-6">
            {t('camp.title')}
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            {t('camp.formatValue')}
          </p>
          <Link
            href="/apply"
            className="inline-block px-8 py-4 text-lg font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 btn-primary"
          >
            {t('hero.cta')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}









