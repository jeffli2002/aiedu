'use client';

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Projects() {
  const { t } = useTranslation();

  const projects = [
    {
      id: 1,
      title: t('projects.project1.title'),
      description: t('projects.project1.description'),
      icon: '🎨',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      title: t('projects.project2.title'),
      description: t('projects.project2.description'),
      icon: '🎬',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: 3,
      title: t('projects.project3.title'),
      description: t('projects.project3.description'),
      icon: '💻',
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            {t('projects.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('projects.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group relative"
            >
              <div className="h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary-200">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${project.gradient} flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform`}>
                  {project.icon}
                </div>
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {project.description}
                </p>
                <Link
                  href="/projects"
                  className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
                >
                  {t('projects.learnMore')}
                  <svg className="w-5 h-5 ml-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}









