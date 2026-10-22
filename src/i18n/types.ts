export const languages = ['pt', 'en'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'pt';

/** Texto disponível nos dois idiomas. */
export interface Localized {
  pt: string;
  en: string;
}

export const htmlLang: Record<Lang, string> = { pt: 'pt-BR', en: 'en' };

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (languages as readonly string[]).includes(value);
}
