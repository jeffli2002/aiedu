export type Locale = 'en-US' | 'en' | 'zh-CN' | 'zh' | 'es' | 'fr' | 'de' | 'ja';

export const SUPPORTED_LOCALES: Locale[] = ['en-US', 'en', 'zh-CN', 'zh', 'es', 'fr', 'de', 'ja'];
export const DEFAULT_LOCALE: Locale = 'zh-CN';

export function normalizeLocale(input?: string | null): Locale {
  const raw = (input || '').trim();
  if (!raw) return DEFAULT_LOCALE;
  const lower = raw.toLowerCase();
  // Map common variants
  if (lower.startsWith('zh')) return 'zh-CN';
  if (lower.startsWith('en')) return 'en-US';
  if (lower.startsWith('es')) return 'es';
  if (lower.startsWith('fr')) return 'fr';
  if (lower.startsWith('de')) return 'de';
  if (lower.startsWith('ja')) return 'ja';
  return DEFAULT_LOCALE;
}

export function toBaseLang(locale: Locale): 'zh' | 'en' {
  switch (locale) {
    case 'zh-CN':
    case 'zh':
      return 'zh';
    default:
      return 'en';
  }
}

export function localeLabel(locale: Locale): string {
  switch (locale) {
    case 'zh-CN':
    case 'zh':
      return '中文 (简体)';
    case 'en-US':
    case 'en':
      return 'English';
    case 'es':
      return 'Español';
    case 'fr':
      return 'Français';
    case 'de':
      return 'Deutsch';
    case 'ja':
      return '日本語';
    default:
      return locale;
  }
}

// Prefix a path with the given base language (zh|en).
export function withLocalePath(path: string, lang: 'zh' | 'en'): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  const stripped = p.replace(/^\/(zh|en)(?=\/|$)/, '');
  const rest = stripped === '/' ? '' : stripped;
  return `/${lang}${rest}` || `/${lang}`;
}
