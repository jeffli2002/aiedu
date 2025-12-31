'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';

export default function Footer({ fixed }: { fixed?: boolean } = {}) {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (pathname === '/') {
    return null;
  }

  return (
    <footer className={`bg-gray-900 text-gray-300 ${fixed ? 'fixed bottom-0 left-0 right-0 z-40' : ''}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${fixed ? 'py-4' : 'py-12'}`}>
        <div className="text-center">
          <p className="text-sm">
            {isClient && i18n.isInitialized ? t('footer.copyright') : '© Future AI Creators'}
          </p>
        </div>
      </div>
    </footer>
  );
}









