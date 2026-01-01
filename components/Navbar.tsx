'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  // 确保只在客户端渲染翻译内容
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (pathname === '/') {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLang);
    }
  };

  // 使用 useMemo 确保只在客户端准备好后计算翻译
  const navLinks = useMemo(() => {
    if (!isClient || !i18n.isInitialized) {
      // 服务器端或未初始化时返回默认中文
      return [
        { href: '/', label: '首页' },
        { href: '/projects', label: '项目展示' },
        { href: '/training', label: '训练课程' },
        { href: '/image-generation', label: 'AI 图像' },
        { href: '/video-generation', label: 'AI 视频' },
      ];
    }
    return [
      { href: '/', label: t('nav.home') },
      { href: '/projects', label: t('nav.projects') },
      { href: '/training', label: t('nav.training') },
      { href: '/image-generation', label: t('nav.aiImage') },
      { href: '/video-generation', label: t('nav.aiVideo') },
    ];
  }, [t, isClient, i18n.isInitialized]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Future AI Creators
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors border border-gray-300 rounded-lg hover:border-primary-600"
            >
              {i18n.language === 'zh' ? 'EN' : '中文'}
            </button>
            <Link
              href="/signin"
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isClient && i18n.isInitialized ? t('nav.signin') : '登录'}
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 text-sm font-medium rounded-lg hover:shadow-lg transition-all btn-primary"
            >
              {isClient && i18n.isInitialized ? t('nav.apply') : '注册'}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="text-sm font-medium text-gray-700"
            >
              {i18n.language === 'zh' ? 'EN' : '中文'}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 text-base font-medium ${
                  pathname === link.href
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/signin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
            >
              {isClient && i18n.isInitialized ? t('nav.signin') : '登录'}
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block mx-4 mt-4 px-6 py-2 text-center text-sm font-medium rounded-lg btn-primary"
            >
              {isClient && i18n.isInitialized ? t('nav.apply') : '注册'}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}







