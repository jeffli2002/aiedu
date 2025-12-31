const EXTERNAL_URL_PATTERN = /^https?:\/\//i;

const ensureAbsolutePath = (value: string) => {
  if (!value || value === '/') {
    return '/';
  }
  return value.startsWith('/') ? value : `/${value}`;
};

export interface RedirectTarget {
  localized: string;
  relative: string;
}

export function resolveRedirectTarget(_locale: string, raw?: string | null): RedirectTarget {
  const normalized = raw?.trim();

  if (!normalized || normalized === '') {
    return {
      localized: '/',
      relative: '/',
    };
  }

  if (EXTERNAL_URL_PATTERN.test(normalized)) {
    return {
      localized: normalized,
      relative: normalized,
    };
  }

  const normalizedPath = ensureAbsolutePath(normalized);
  return {
    localized: normalizedPath,
    relative: normalizedPath,
  };
}
