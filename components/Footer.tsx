'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { withLocalePath } from '@/i18n/locale-utils';
import { Sparkles, Twitter, Mail, ArrowUpRight } from 'lucide-react';

/**
 * Footer - Editorial Minimal Design
 * Typography: Instrument Serif (logo) + DM Sans (body)
 * Colors: Coral Orange (#ff6b35), Teal (#2ec4b6), Dark (#1a1a2e)
 */

export default function Footer({ fixed }: { fixed?: boolean } = {}) {
  const t = useTranslations('footer');
  const tn = useTranslations('nav');
  const locale = useLocale();
  const lang = locale === 'zh' ? 'zh' : 'en';
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const year = new Date().getFullYear();

  const exploreLinks = [
    { href: '/', label: isClient ? tn('home') : '首页' },
    { href: '/training', label: isClient ? tn('training') : '训练课程' },
    { href: '/blog', label: isClient ? tn('blog') : '博客' },
  ];

  const toolLinks = [
    { href: '/image-generation', label: isClient ? tn('imageGeneration') : 'AI 图像' },
    { href: '/video-generation', label: isClient ? tn('videoGeneration') : 'AI 视频' },
    { href: '/assets', label: isClient ? tn('assets') : '我的作品' },
  ];

  if (fixed) {
    return (
      <footer
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100"
        style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <p className="text-xs" style={{ color: '#999' }}>
            &copy; {year} Future AI Creators
          </p>
          <div className="flex gap-4">
            <a
              href="https://x.com/jeffli2002"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="p-2 rounded-lg transition-colors"
              style={{ color: '#999' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6b35')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#999')}
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="mailto:support@futurai.org"
              aria-label="Email"
              className="p-2 rounded-lg transition-colors"
              style={{ color: '#999' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#2ec4b6')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#999')}
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className="bg-white border-t border-slate-100"
      style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-slate-100">
          {/* Brand column */}
          <div className="lg:col-span-5 space-y-6">
            <Link href={withLocalePath('/', lang)} className="inline-flex items-center gap-3 group">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: '#ff6b35' }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span
                className="text-xl font-bold tracking-tight"
                style={{
                  fontFamily: '"Instrument Serif", Georgia, serif',
                  color: '#1a1a2e',
                }}
              >
                Future AI Creators
              </span>
            </Link>

            <p
              className="text-base leading-relaxed max-w-sm"
              style={{ color: '#666' }}
            >
              {t('description')}
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              <a
                href="https://x.com/jeffli2002"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 border"
                style={{ borderColor: '#e5e5e5', color: '#999' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#ff6b35';
                  e.currentTarget.style.color = '#ff6b35';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e5e5';
                  e.currentTarget.style.color = '#999';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@futurai.org"
                aria-label="Email"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 border"
                style={{ borderColor: '#e5e5e5', color: '#999' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#2ec4b6';
                  e.currentTarget.style.color = '#2ec4b6';
                  e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e5e5';
                  e.currentTarget.style.color = '#999';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Explore */}
            <div>
              <h4
                className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
                style={{ color: '#ff6b35' }}
              >
                {t('explore')}
              </h4>
              <ul className="space-y-3">
                {exploreLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={withLocalePath(link.href, lang)}
                      className="text-sm font-medium transition-colors duration-200 inline-flex items-center gap-1 group"
                      style={{ color: '#4a4a4a' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6b35')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#4a4a4a')}
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Tools */}
            <div>
              <h4
                className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
                style={{ color: '#2ec4b6' }}
              >
                {lang === 'zh' ? 'AI 工具' : 'AI Tools'}
              </h4>
              <ul className="space-y-3">
                {toolLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={withLocalePath(link.href, lang)}
                      className="text-sm font-medium transition-colors duration-200 inline-flex items-center gap-1 group"
                      style={{ color: '#4a4a4a' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#2ec4b6')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#4a4a4a')}
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4
                className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
                style={{ color: '#1a1a2e' }}
              >
                {lang === 'zh' ? '公司' : 'Company'}
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href={withLocalePath('/about', lang)}
                    className="text-sm font-medium transition-colors duration-200 inline-flex items-center gap-1 group"
                    style={{ color: '#4a4a4a' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6b35')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#4a4a4a')}
                  >
                    {lang === 'zh' ? '关于我们' : 'About Us'}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link
                    href={withLocalePath('/contact', lang)}
                    className="text-sm font-medium transition-colors duration-200 inline-flex items-center gap-1 group"
                    style={{ color: '#4a4a4a' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6b35')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#4a4a4a')}
                  >
                    {lang === 'zh' ? '联系我们' : 'Contact'}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link
                    href={withLocalePath('/refund', lang)}
                    className="text-sm font-medium transition-colors duration-200 inline-flex items-center gap-1 group"
                    style={{ color: '#4a4a4a' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6b35')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#4a4a4a')}
                  >
                    {lang === 'zh' ? '退款政策' : 'Refund Policy'}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs" style={{ color: '#999' }}>
            &copy; {year} Future AI Creators. {lang === 'zh' ? '保留所有权利' : 'All rights reserved'}.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href={withLocalePath('/privacy', lang)}
              className="text-xs transition-colors duration-200"
              style={{ color: '#999' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6b35')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#999')}
            >
              {lang === 'zh' ? '隐私政策' : 'Privacy Policy'}
            </Link>
            <Link
              href={withLocalePath('/terms', lang)}
              className="text-xs transition-colors duration-200"
              style={{ color: '#999' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6b35')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#999')}
            >
              {lang === 'zh' ? '服务条款' : 'Terms of Service'}
            </Link>
          </div>
        </div>

        <div className="pt-6">
          <p className="text-xs leading-relaxed max-w-4xl" style={{ color: '#999' }}>
            {lang === 'zh'
              ? '独立性声明：Futurai 使用第三方 AI 模型（如 Google 的 Gemini、OpenAI 的模型及其他 AI 服务提供商）来驱动我们的内容生成服务。这些 AI 模型由其各自所有者提供，并受其自身条款和条件约束。Futurai 是一家独立服务提供商，我们的平台、功能和服务均为自有产品。我们与这些 AI 模型提供商无关联、未获其认可或赞助。'
              : "Futurai uses third-party AI models (such as Google's Gemini, OpenAI's models, and other AI service providers) to power our content generation services. These AI models are provided by their respective owners and are subject to their own terms and conditions. Futurai is an independent service provider and our platform, features, and services are our own proprietary products. We are not affiliated with, endorsed by, or sponsored by these AI model providers."}
          </p>
        </div>
      </div>
    </footer>
  );
}
