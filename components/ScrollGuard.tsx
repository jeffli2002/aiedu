'use client';

import { useEffect } from 'react';

/**
 * ScrollGuard ensures the document is scrollable.
 * Some modal libraries lock body scroll by setting inline overflow: hidden.
 * If a modal closes unexpectedly or during redirects, the style may linger.
 * This guard clears any lingering overflow locks on mount and on navigation-ish events.
 */
export default function ScrollGuard() {
  useEffect(() => {
    const unlock = () => {
      try {
        const doc = document.documentElement as HTMLElement;
        const body = document.body as HTMLElement;
        if (body) {
          const cs = window.getComputedStyle(body);
          if (cs.overflowY === 'hidden' || body.style.overflow === 'hidden' || body.style.overflowY === 'hidden') {
            body.style.overflow = '';
            body.style.overflowY = 'auto';
          }
        }
        if (doc) {
          const cs = window.getComputedStyle(doc);
          if (cs.overflowY === 'hidden' || doc.style.overflow === 'hidden' || doc.style.overflowY === 'hidden') {
            doc.style.overflow = '';
            doc.style.overflowY = 'auto';
          }
        }
      } catch {}
      // Close any stray native <dialog open> overlays outside generator pages
      try {
        const path = window.location.pathname || '';
        const onGenerators = /\/image-generation|\/video-generation/.test(path);
        if (!onGenerators) {
          document.querySelectorAll('dialog[open]').forEach((dlg) => {
            // Heuristic: only close fullscreen overlays
            const el = dlg as HTMLElement;
            const cls = el.className || '';
            if (/fixed/.test(cls) && /inset-0/.test(cls)) {
              el.removeAttribute('open');
            }
          });
        }
      } catch {}
    };

    unlock();
    const onHash = () => unlock();
    const onResize = () => unlock();
    window.addEventListener('hashchange', onHash);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    // A gentle delayed unlock in case styles are toggled after mount
    const t = setTimeout(unlock, 300);
    const t2 = setTimeout(unlock, 1200);
    return () => {
      clearTimeout(t); clearTimeout(t2);
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);
  return null;
}
