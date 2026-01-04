import i18n, { type Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
// Note: We avoid async backends on the client to prevent hydration mismatches

// Server-side resources to avoid hydration mismatches
// Import translations directly so SSR renders translated text
// Note: resolveJsonModule is enabled in tsconfig.
// Keep resource shape consistent with client defaultNS=common
let serverResources: Resource | undefined;
try {
  // These imports are only used during SSR branch below
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const zhCommon = require('@/public/locales/zh/common.json');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const enCommon = require('@/public/locales/en/common.json');
  serverResources = {
    zh: { common: zhCommon },
    en: { common: enCommon },
  } as Resource;
} catch {
  // If resources cannot be imported (e.g., during certain build phases),
  // fall back to empty resources. Client will still hydrate with real texts.
  serverResources = {
    zh: { common: {} },
    en: { common: {} },
  };
}

// Helper to detect locale from URL path on client
function getLocaleFromPath(): string | null {
  if (typeof window === 'undefined') return null;
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const maybeLocale = pathSegments[0];
  if (maybeLocale === 'en' || maybeLocale === 'zh') {
    return maybeLocale;
  }
  return null;
}

// 只在客户端初始化
if (typeof window !== 'undefined' && !i18n.isInitialized) {
  // Client: initialize synchronously with bundled resources to avoid hydration mismatch
  // Priority: URL path > document.lang > localStorage > default 'zh'
  const pathLang = getLocaleFromPath();
  const htmlLang =
    typeof document !== 'undefined' && document.documentElement?.lang
      ? document.documentElement.lang
      : undefined;
  const storedLang = window.localStorage?.getItem('language') || undefined;
  const initialLang = pathLang || htmlLang || storedLang || 'zh';

  i18n
    .use(initReactI18next)
    .init({
      fallbackLng: 'zh',
      lng: initialLang,
      debug: false,
      defaultNS: 'common',
      ns: ['common'],
      interpolation: {
        escapeValue: false,
      },
      resources: serverResources,
      initImmediate: false,
    });
} else if (typeof window === 'undefined' && !i18n.isInitialized) {
  // Server: initialize with bundled resources so SSR matches client output
  i18n.use(initReactI18next).init({
    fallbackLng: 'zh',
    lng: 'zh', // default; can be adjusted later on client
    debug: false,
    defaultNS: 'common',
    ns: ['common'],
    interpolation: {
      escapeValue: false,
    },
    initImmediate: false,
    resources: serverResources,
  });
}

export default i18n;
