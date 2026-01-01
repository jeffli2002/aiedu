'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Rocket, Instagram, Twitter, Linkedin, Send } from 'lucide-react';

export default function Footer({ fixed }: { fixed?: boolean } = {}) {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const lang = isClient ? i18n.language : 'zh';
  const isZh = lang?.startsWith('zh');
  const year = new Date().getFullYear();

  return (
    <footer className={`${fixed ? 'fixed bottom-0 left-0 right-0 z-40' : ''} bg-white border-t border-slate-100`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${fixed ? 'py-4' : 'py-20'}`}>
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <Rocket className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold font-display uppercase tracking-tighter text-slate-900">FUTURE AI CREATORS</span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              {isZh
                ? '掌握未来语言。加入我们，让孩子用 AI 创造有意义的改变。'
                : 'Mastering the language of the future. Join us in building a world where children use AI to create meaningful change.'}
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all"><Instagram className="w-5 h-5" /></a>
              <a href="#" aria-label="Twitter" className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all"><Twitter className="w-5 h-5" /></a>
              <a href="#" aria-label="LinkedIn" className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-widest mb-6">{isZh ? '探索' : 'Explore'}</h4>
            <ul className="space-y-3 text-sm text-slate-500 font-medium">
              <li><Link href="/" className="hover:text-blue-600 transition-colors">{isZh ? '首页' : 'Home'}</Link></li>
              <li><Link href="/training" className="hover:text-blue-600 transition-colors">{isZh ? '训练课程' : 'Training'}</Link></li>
              <li><Link href="/image-generation" className="hover:text-blue-600 transition-colors">{isClient && i18n.isInitialized ? t('nav.aiImage') : 'AI 图像'}</Link></li>
              <li><Link href="/video-generation" className="hover:text-blue-600 transition-colors">{isClient && i18n.isInitialized ? t('nav.aiVideo') : 'AI 视频'}</Link></li>
              <li><Link href="/assets" className="hover:text-blue-600 transition-colors">{isClient && i18n.isInitialized ? t('nav.myAssets') : '我的作品'}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-widest mb-6">{isZh ? '联系我们' : 'Contact'}</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="flex items-center gap-2"><Send className="w-4 h-4" /> support@futurai.org</li>
            </ul>
            <div className="mt-8 pt-8 border-t border-slate-50">
              <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">&copy; {year} Future AI Creators.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}









