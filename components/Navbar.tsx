'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { withLocalePath } from '@/i18n/locale-utils';
import type { Locale } from '@/i18n/routing';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Navbar - Editorial Minimal Design
 * Typography: DM Sans
 * Colors: Coral Orange (#ff6b35), Teal (#2ec4b6), Dark (#1a1a2e)
 */

export default function Navbar() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, signOut, isInitialized } = useAuthStore();

  useEffect(() => {
    setIsClient(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const nextLocale = locale === 'zh' ? 'en' : 'zh';
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', nextLocale);
      if (document?.documentElement) document.documentElement.lang = nextLocale;
      try {
        document.cookie = `language=${nextLocale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      } catch {}
      const path = pathname || '/';
      const nextUrl = withLocalePath(path, nextLocale);
      router.replace(nextUrl);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const navLinks = useMemo(() => {
    if (!isClient) {
      return [
        { href: '/zh/training', label: '训练课程' },
        { href: '/zh/pricing', label: '定价' },
        { href: '/zh/image-generation', label: 'AI 图像' },
        { href: '/zh/video-generation', label: 'AI 视频' },
        { href: '/zh/blog', label: '博客' },
        { href: '/zh/assets', label: '我的作品' },
      ];
    }
    return [
      { href: withLocalePath('/training', locale), label: t('nav.training') },
      { href: withLocalePath('/pricing', locale), label: t('nav.pricing') },
      { href: withLocalePath('/image-generation', locale), label: t('nav.imageGeneration') },
      { href: withLocalePath('/video-generation', locale), label: t('nav.videoGeneration') },
      { href: withLocalePath('/blog', locale), label: t('nav.blog') },
      { href: withLocalePath('/assets', locale), label: t('nav.assets') },
    ];
  }, [t, isClient, locale]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
      style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            href={withLocalePath('/', locale)}
            className="flex items-center gap-3 group"
          >
            <Image
              src="/FuturAI_logo.png"
              alt="FuturAI logo"
              width={160}
              height={40}
              priority
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <span className="sr-only">FuturAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                style={{
                  color: pathname?.includes(link.href.split('/').pop() || '') ? '#ff6b35' : '#4a4a4a',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6b35')}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = pathname?.includes(link.href.split('/').pop() || '') ? '#ff6b35' : '#4a4a4a';
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 border"
              style={{
                color: '#4a4a4a',
                borderColor: '#e5e5e5',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2ec4b6';
                e.currentTarget.style.color = '#2ec4b6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e5e5';
                e.currentTarget.style.color = '#4a4a4a';
              }}
            >
              <span suppressHydrationWarning>
                {isClient ? (locale === 'zh' ? 'EN' : '中文') : 'EN'}
              </span>
            </button>

            {isInitialized && isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-all duration-200 border"
                    style={{ borderColor: '#e5e5e5' }}
                  >
                    <Avatar className="h-7 w-7 rounded-full">
                      <AvatarImage src={user.image || ''} alt={user.name || ''} className="rounded-full" />
                      <AvatarFallback
                        className="text-white rounded-full text-xs font-semibold"
                        style={{ backgroundColor: '#ff6b35' }}
                      >
                        {user.name?.charAt(0).toUpperCase() || <User className="h-3 w-3" />}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-xl border-slate-100 shadow-lg"
                  align="end"
                  sideOffset={8}
                  style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
                >
                  <DropdownMenuLabel className="font-normal px-3 py-2">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{user.name}</p>
                      <p className="text-xs" style={{ color: '#666' }}>{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild className="px-3 py-2 cursor-pointer">
                    <Link href="/dashboard" className="text-sm" style={{ color: '#4a4a4a' }}>
                      {isClient ? t('nav.dashboard') : '控制台'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="px-3 py-2 cursor-pointer text-sm"
                    style={{ color: '#ff6b35' }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isClient ? t('nav.logout') : '退出登录'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href={withLocalePath('/signin', locale)}
                  className="px-4 py-2 text-sm font-medium transition-colors duration-200"
                  style={{ color: '#4a4a4a' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6b35')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#4a4a4a')}
                >
                  {isClient ? t('nav.login') : '登录'}
                </Link>
                <Link
                  href={withLocalePath('/signup', locale)}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: '#ff6b35',
                    boxShadow: '0 4px 14px -4px rgba(255, 107, 53, 0.4)',
                  }}
                >
                  {isClient ? t('nav.signup') : '注册'}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: '#1a1a2e' }}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
        >
          <div className="max-w-7xl mx-auto px-6 py-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-medium transition-colors"
                style={{ color: '#1a1a2e' }}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
              {isInitialized && isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Avatar className="h-10 w-10 rounded-full">
                      <AvatarImage src={user.image || ''} alt={user.name || ''} className="rounded-full" />
                      <AvatarFallback
                        className="text-white rounded-full font-semibold"
                        style={{ backgroundColor: '#ff6b35' }}
                      >
                        {user.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold" style={{ color: '#1a1a2e' }}>{user.name}</p>
                      <p className="text-sm" style={{ color: '#666' }}>{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-medium"
                    style={{ color: '#1a1a2e' }}
                  >
                    {isClient ? t('nav.dashboard') : '控制台'}
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-base font-medium flex items-center gap-2"
                    style={{ color: '#ff6b35' }}
                  >
                    <LogOut className="h-5 w-5" />
                    {isClient ? t('nav.logout') : '退出登录'}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={withLocalePath('/signin', locale)}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-medium"
                    style={{ color: '#1a1a2e' }}
                  >
                    {isClient ? t('nav.login') : '登录'}
                  </Link>
                  <Link
                    href={withLocalePath('/signup', locale)}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-center text-base font-semibold text-white"
                    style={{ backgroundColor: '#ff6b35' }}
                  >
                    {isClient ? t('nav.signup') : '注册'}
                  </Link>
                </>
              )}

              <button
                onClick={() => {
                  toggleLanguage();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 rounded-xl text-base font-medium text-center border"
                style={{ color: '#4a4a4a', borderColor: '#e5e5e5' }}
              >
                <span suppressHydrationWarning>
                  {isClient ? (locale === 'zh' ? 'Switch to English' : '切换到中文') : 'EN'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
