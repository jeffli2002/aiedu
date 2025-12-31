'use client';

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function ProjectsPage() {
  const { t } = useTranslation();

  const projects = [
    {
      id: 1,
      title: t('projects.project1.title'),
      description: t('projects.project1.description'),
      icon: '🎨',
      gradient: 'from-blue-500 to-cyan-500',
      features: [
        'AI图像生成技术',
        '全球主题设计',
        '真实问题表达',
        '创意海报制作',
      ],
    },
    {
      id: 2,
      title: t('projects.project2.title'),
      description: t('projects.project2.description'),
      icon: '🎬',
      gradient: 'from-purple-500 to-pink-500',
      features: [
        'AI视频生成',
        '15-30秒短视频',
        '未来社会故事',
        '解决方案展示',
      ],
    },
    {
      id: 3,
      title: t('projects.project3.title'),
      description: t('projects.project3.description'),
      icon: '💻',
      gradient: 'from-green-500 to-emerald-500',
      features: [
        '网页开发基础',
        'AI应用集成',
        '全球问题解决',
        '实用工具创建',
      ],
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
            {t('projects.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('projects.subtitle')}
          </p>
        </motion.div>

        <div className="space-y-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="md:flex">
                <div className={`md:w-1/3 bg-gradient-to-r ${project.gradient} p-12 flex items-center justify-center`}>
                  <div className="text-8xl">{project.icon}</div>
                </div>
                <div className="md:w-2/3 p-8 md:p-12">
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                    {project.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {project.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}









