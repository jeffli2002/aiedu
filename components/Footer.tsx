'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { withLocalePath } from '@/i18n/locale-utils';
import { Rocket, Instagram, Twitter, Linkedin, Send } from 'lucide-react';

export default function Footer({ fixed }: { fixed?: boolean } = {}) {
  const t = useTranslations('footer');
  const tn = useTranslations('nav');
  const locale = useLocale();
  const lang = locale === 'zh' ? 'zh' : 'en';
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
              {t('description')}
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all"><Instagram className="w-5 h-5" /></a>
              <a href="#" aria-label="Twitter" className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all"><Twitter className="w-5 h-5" /></a>
              <a href="#" aria-label="LinkedIn" className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-widest mb-6">{t('explore')}</h4>
            <ul className="space-y-3 text-sm text-slate-500 font-medium">
              <li><Link href={withLocalePath('/', lang)} className="hover:text-blue-600 transition-colors">{tn('home')}</Link></li>
              <li><Link href={withLocalePath('/training', lang)} className="hover:text-blue-600 transition-colors">{tn('training')}</Link></li>
              <li><Link href={withLocalePath('/image-generation', lang)} className="hover:text-blue-600 transition-colors">{tn('imageGeneration')}</Link></li>
              <li><Link href={withLocalePath('/video-generation', lang)} className="hover:text-blue-600 transition-colors">{tn('videoGeneration')}</Link></li>
              <li><Link href={withLocalePath('/assets', lang)} className="hover:text-blue-600 transition-colors">{tn('assets')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-widest mb-6">{t('contact')}</h4>
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









