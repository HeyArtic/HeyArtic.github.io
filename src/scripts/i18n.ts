import { format, type Dictionary, type Vars } from '../i18n/format';
import { defaultLang, htmlLang, isLang, type Lang } from '../i18n/types';
import { formatDate } from '../lib/certificates';
import { readJson } from './dom';

const STORAGE_KEY = 'portfolio-lang';
const listeners = new Set<(lang: Lang) => void>();

const dictionaries = readJson<Record<Lang, Dictionary>>('i18n-dict') ?? { pt: {}, en: {} };
let current: Lang = detectInitial();

function detectInitial(): Lang {
  try {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (isLang(fromUrl)) return fromUrl;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLang(stored)) return stored;
  } catch {
    // localStorage bloqueado: usa o idioma padrão.
  }
  return defaultLang;
}

export function getLang(): Lang {
  return current;
}

export function t(key: string, vars?: Vars): string {
  const value = dictionaries[current]?.[key] ?? dictionaries[defaultLang]?.[key] ?? key;
  return format(value, vars);
}

export function onLangChange(callback: (lang: Lang) => void): void {
  listeners.add(callback);
}

function parseVars(raw: string | undefined): Vars | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as Vars;
  } catch {
    return undefined;
  }
}

/** Aplica o idioma atual a todos os elementos marcados com data-i18n*. */
export function applyTranslations(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key, parseVars(el.dataset.i18nVars));
  });

  root.querySelectorAll<HTMLElement>('[data-i18n-attr]').forEach((el) => {
    try {
      const spec = JSON.parse(el.dataset.i18nAttr ?? '{}') as Record<string, { k: string; v?: Vars }>;
      for (const [attr, { k, v }] of Object.entries(spec)) el.setAttribute(attr, t(k, v));
    } catch {
      // Especificação inválida: mantém o texto original.
    }
  });

  root.querySelectorAll<HTMLElement>('[data-date]').forEach((el) => {
    const formatted = formatDate(el.dataset.date ?? null, current);
    if (formatted) el.textContent = formatted;
  });

  root.querySelectorAll<HTMLAnchorElement>('[data-resume-link]').forEach((a) => {
    const href = current === 'en' ? a.dataset.hrefEn : a.dataset.hrefPt;
    if (href) a.href = href;
  });
}

function updateDocument(): void {
  document.documentElement.lang = htmlLang[current];
  document.title = t('meta.title');
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'));
  document.querySelectorAll<HTMLButtonElement>('[data-lang-btn]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.langBtn === current));
  });
}

function syncUrl(): void {
  try {
    const url = new URL(location.href);
    if (!url.searchParams.has('lang')) return;
    if (current === defaultLang) url.searchParams.delete('lang');
    else url.searchParams.set('lang', current);
    history.replaceState(history.state, '', url);
  } catch {
    // Ignora ambientes sem History API.
  }
}

export function setLang(lang: Lang): void {
  if (lang === current) return;
  current = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Sem persistência: a troca vale apenas para esta visita.
  }
  updateDocument();
  applyTranslations();
  syncUrl();
  listeners.forEach((cb) => cb(lang));
}

export function initI18n(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-lang-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.langBtn;
      if (isLang(lang)) setLang(lang);
    });
  });
  updateDocument();
  if (current !== defaultLang) applyTranslations();
  document.documentElement.classList.remove('i18n-pending');
}
