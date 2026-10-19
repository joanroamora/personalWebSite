export const locales = [
  { code: 'en', tag: 'en', label: 'English', short: 'EN', direction: 'ltr' },
  { code: 'es', tag: 'es', label: 'Español', short: 'ES', direction: 'ltr' },
  { code: 'zh', tag: 'zh-Hans', label: '中文（简体）', short: '中文', direction: 'ltr' },
  { code: 'hi', tag: 'hi', label: 'हिन्दी', short: 'हि', direction: 'ltr' },
  { code: 'ar', tag: 'ar', label: 'العربية', short: 'ع', direction: 'rtl' },
  { code: 'fr', tag: 'fr', label: 'Français', short: 'FR', direction: 'ltr' },
] as const;

export type Locale = typeof locales[number]['code'];
export type Translation = readonly [en: string, zh: string, hi: string, ar: string, fr: string];
export const isLocale = (value: string): value is Locale => locales.some(locale => locale.code === value);
export const translatedLocales = locales.filter(locale => locale.code !== 'es');
export const localeInfo = (code: Locale) => locales.find(locale => locale.code === code)!;
export const normalizeText = (value: string) => value.trim().replace(/\s+/g, ' ');

export function routeContext(pathname: string, base: string): { locale: Locale; path: string } {
  const prefix = `${base.replace(/\/$/, '')}/`;
  const relative = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : '';
  const [candidate, ...rest] = relative.split('/');
  const locale = isLocale(candidate) && candidate !== 'es' ? candidate : 'es';
  return { locale, path: locale === 'es' ? relative : rest.join('/') };
}

/** Cambia solo el prefijo del idioma. Slugs, subrutas de Pages y query strings son estables. */
export function languageHref(path: string, locale: Locale, base: string): string {
  return `${base.replace(/\/$/, '')}/${locale === 'es' ? '' : `${locale}/`}${path.replace(/^\/+/, '')}`;
}

export function translatedText(source: string, locale: Locale, catalog: Readonly<Record<string, Translation>>): string {
  if (locale === 'es') return source;
  const row = catalog[normalizeText(source)];
  const index = translatedLocales.findIndex(item => item.code === locale);
  return row?.[index] ?? source;
}
