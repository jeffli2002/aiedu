'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Cpu, Menu, X, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, signOut, isInitialized } = useAuthStore();

  // 确保只在客户端渲染翻译内容
  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLang);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // 使用 useMemo 确保只在客户端准备好后计算翻译
  const navLinks = useMemo(() => {
    if (!isClient || !i18n.isInitialized) {
      // 服务器端或未初始化时返回默认中文
      return [
        { href: '/image-generation', label: 'AI 图像' },
        { href: '/video-generation', label: 'AI 视频' },
        { href: '/training', label: '训练课程' },
      ];
    }
    return [
      { href: '/image-generation', label: t('nav.aiImage') },
      { href: '/video-generation', label: t('nav.aiVideo') },
      { href: '/training', label: t('nav.training') },
    ];
  }, [t, isClient, i18n.isInitialized]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-8 py-5 backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="bg-gradient-to-tr from-violet-600 to-blue-500 p-2.5 rounded-2xl group-hover:rotate-12 transition-transform duration-500">
            <Cpu className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-extrabold tracking-tighter uppercase text-slate-900">Future Creator</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="text-slate-600 hover:text-violet-600 transition-colors text-xs font-black uppercase tracking-[0.2em]"
            >
              {link.label}
            </Link>
          ))}

          <div className="flex items-center space-x-8 pl-8 border-l border-slate-200">
            <button
              onClick={toggleLanguage}
              className="text-slate-600 hover:text-blue-600 transition-colors text-xs font-bold tracking-widest"
            >
              {i18n.language === 'zh' ? 'EN' : 'CN'}
            </button>
            {isInitialized && isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0 !bg-transparent hover:!bg-transparent focus:!bg-transparent active:!bg-transparent"
                    style={{ backgroundColor: 'transparent' }}
                    aria-label="Open user menu"
                  >
                    <Avatar className="h-10 w-10 rounded-full">
                      <AvatarImage
                        src={user.image || ''}
                        alt={user.name || ''}
                        className="rounded-full"
                      />
                      <AvatarFallback className="text-white rounded-full bg-gradient-to-tr from-violet-600 to-blue-500">
                        {user.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      {isClient && i18n.isInitialized ? t('dashboard.title') : '控制台'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {isClient && i18n.isInitialized ? t('common.logout') : '退出登录'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="text-slate-600 hover:text-violet-600 transition-colors text-xs font-bold uppercase tracking-[0.2em]"
                >
                  {isClient && i18n.isInitialized ? t('nav.signin') : '登录'}
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-violet-600 to-blue-600 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-[0.15em] hover:from-violet-700 hover:to-blue-700 transition-all transform hover:scale-105 btn-shimmer shadow-lg"
                >
                  {isClient && i18n.isInitialized ? t('nav.apply') : '注册'}
                </Link>
              </>
            )}
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
            {navLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-left font-black text-xl uppercase text-slate-900 hover:text-violet-600"
              >
                {link.label}
              </Link>
            ))}
            {isInitialized && isAuthenticated && user ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-2 border-b border-slate-200">
                  <Avatar className="h-10 w-10 rounded-full">
                    <AvatarImage
                      src={user.image || ''}
                      alt={user.name || ''}
                      className="rounded-full"
                    />
                    <AvatarFallback className="text-white rounded-full bg-gradient-to-tr from-violet-600 to-blue-500">
                      {user.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-slate-500">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-left font-black text-xl uppercase text-slate-900 hover:text-violet-600"
                >
                  {isClient && i18n.isInitialized ? t('dashboard.title') : '控制台'}
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left font-black text-xl uppercase text-slate-900 hover:text-violet-600 flex items-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  {isClient && i18n.isInitialized ? t('common.logout') : '退出登录'}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-left font-black text-xl uppercase text-slate-900 hover:text-violet-600"
                >
                  {isClient && i18n.isInitialized ? t('nav.signin') : '登录'}
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-gradient-to-r from-violet-600 to-blue-600 text-white text-center py-5 rounded-2xl font-black uppercase tracking-widest"
                >
                  {isClient && i18n.isInitialized ? t('nav.apply') : '注册'}
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}






