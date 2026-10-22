/**
 * Helpers de tradução usados durante o build (componentes .astro).
 *
 * O HTML é gerado no idioma padrão (português). Cada texto traduzível recebe
 * `data-i18n`, e o script do cliente troca o conteúdo ao alternar o idioma,
 * sem recarregar a página.
 */
import { buildDictionaries, createTranslator } from './dictionary';
import { defaultLang } from './types';

export const dictionaries = buildDictionaries();
export const t = createTranslator(dictionaries[defaultLang]);

type Vars = Record<string, string | number>;

/** Atributos para um elemento cujo texto é traduzível: `<h2 {...tr('x')}>{t('x')}</h2>`. */
export function tr(key: string, vars?: Vars): Record<string, string> {
  const attrs: Record<string, string> = { 'data-i18n': key };
  if (vars) attrs['data-i18n-vars'] = JSON.stringify(vars);
  return attrs;
}

/**
 * Atributos HTML traduzíveis (aria-label, title, placeholder…).
 * Retorna o valor em português e o mapeamento para o cliente.
 */
export function trAttrs(map: Record<string, string | [string, Vars]>): Record<string, string> {
  const out: Record<string, string> = {};
  const spec: Record<string, { k: string; v?: Vars }> = {};
  for (const [attr, value] of Object.entries(map)) {
    const [k, v] = Array.isArray(value) ? value : [value, undefined];
    out[attr] = t(k, v);
    spec[attr] = v ? { k, v } : { k };
  }
  out['data-i18n-attr'] = JSON.stringify(spec);
  return out;
}

/** JSON seguro para embutir em <script type="application/json">. */
export function serializeForScript(value: unknown): string {
  // "<" vira \u003c para impedir que um "</script>" dentro dos dados feche a tag.
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
