'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cpu, Menu, X } from 'lucide-react';

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
        { href: '/', label: '项目展示', isSection: true },
        { href: '/image-generation', label: 'AI 图像' },
        { href: '/video-generation', label: 'AI 视频' },
        { href: '/training', label: '训练课程' },
        { href: '/', label: '关于我们', isSection: true },
      ];
    }
    return [
      { href: '/', label: t('nav.projects'), isSection: true },
      { href: '/image-generation', label: t('nav.aiImage') },
      { href: '/video-generation', label: t('nav.aiVideo') },
      { href: '/training', label: t('nav.training') },
      { href: '/', label: t('nav.about'), isSection: true },
    ];
  }, [t, isClient, i18n.isInitialized]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (href: string, label: string, isSection?: boolean) => {
    if (pathname === '/' && isSection) {
      // On homepage, use scroll for sections
      if (label === t('nav.projects') || label === '项目展示') {
        scrollTo('projects');
      } else if (label === t('nav.about') || label === '关于我们') {
        scrollTo('about');
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-8 py-5 backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center">
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => pathname === '/' ? scrollTo('home') : undefined}
        >
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-tr from-violet-600 to-blue-500 p-2.5 rounded-2xl group-hover:rotate-12 transition-transform duration-500">
              <Cpu className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tighter uppercase text-slate-900">Future Creator</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => {
            const isSectionLink = pathname === '/' && link.isSection;
            if (isSectionLink) {
              return (
                <button
                  key={`${link.href}-${link.label}`}
                  onClick={() => handleNavClick(link.href, link.label, link.isSection)}
                  className="text-slate-600 hover:text-violet-600 transition-colors text-xs font-black uppercase tracking-[0.2em]"
                >
                  {link.label}
                </button>
              );
            }
            return (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="text-slate-600 hover:text-violet-600 transition-colors text-xs font-black uppercase tracking-[0.2em]"
              >
                {link.label}
              </Link>
            );
          })}

          <div className="flex items-center space-x-8 pl-8 border-l border-slate-200">
            <button
              onClick={toggleLanguage}
              className="text-slate-600 hover:text-blue-600 transition-colors text-xs font-bold tracking-widest"
            >
              {i18n.language === 'zh' ? 'EN' : 'CN'}
            </button>
            <Link
              href="/signin"
              className="text-slate-600 hover:text-violet-600 transition-colors text-xs font-bold uppercase tracking-[0.2em]"
            >
              {isClient && i18n.isInitialized ? t('nav.signin') : '登录'}
            </Link>
            <Link
              href={pathname === '/' ? '/#apply' : '/signup'}
              className="bg-gradient-to-r from-violet-600 to-blue-600 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-[0.15em] hover:from-violet-700 hover:to-blue-700 transition-all transform hover:scale-105 btn-shimmer shadow-lg"
            >
              {isClient && i18n.isInitialized ? t('nav.apply') : '注册'}
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-4">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-900">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 p-8 flex flex-col space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
            {navLinks.map((link) => {
              const isSectionLink = pathname === '/' && link.isSection;
              if (isSectionLink) {
                return (
                  <button
                    key={`${link.href}-${link.label}`}
                    onClick={() => handleNavClick(link.href, link.label, link.isSection)}
                    className="text-left font-black text-xl uppercase text-slate-900 hover:text-violet-600"
                  >
                    {link.label}
                  </button>
                );
              }
              return (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-left font-black text-xl uppercase text-slate-900 hover:text-violet-600"
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/signin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left font-black text-xl uppercase text-slate-900 hover:text-violet-600"
            >
              {isClient && i18n.isInitialized ? t('nav.signin') : '登录'}
            </Link>
            <Link
              href={pathname === '/' ? '/#apply' : '/signup'}
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-gradient-to-r from-violet-600 to-blue-600 text-white text-center py-5 rounded-2xl font-black uppercase tracking-widest"
            >
              {isClient && i18n.isInitialized ? t('nav.apply') : '注册'}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}






