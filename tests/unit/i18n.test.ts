import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildDictionaries, format } from '../../src/i18n/dictionary';

const dicts = buildDictionaries();

describe('dicionários', () => {
  it('PT e EN têm exatamente as mesmas chaves', () => {
    expect(Object.keys(dicts.en).sort()).toEqual(Object.keys(dicts.pt).sort());
  });

  it('nenhuma tradução está vazia', () => {
    for (const lang of ['pt', 'en'] as const) {
      for (const [key, value] of Object.entries(dicts[lang])) expect(value.trim(), `${lang}:${key}`).not.toBe('');
    }
  });

  it('as variáveis {x} são as mesmas nos dois idiomas', () => {
    const vars = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(',');
    for (const key of Object.keys(dicts.pt)) expect(vars(dicts.en[key]), key).toBe(vars(dicts.pt[key]));
  });

  it('format substitui variáveis conhecidas e preserva as desconhecidas', () => {
    expect(format('{a} de {b}', { a: 1, b: 'dois' })).toBe('1 de dois');
    expect(format('{a} {c}', { a: 'x' })).toBe('x {c}');
  });
});

// Confere o HTML gerado: toda chave usada em data-i18n / data-i18n-attr existe no dicionário.
const built = join(process.cwd(), 'dist', 'index.html');
describe.skipIf(!existsSync(built))('build: chaves usadas no HTML', () => {
  const html = existsSync(built) ? readFileSync(built, 'utf-8') : '';
  const decode = (s: string) => s.replace(/&quot;/g, '"').replace(/&#34;/g, '"').replace(/&amp;/g, '&');

  it('data-i18n', () => {
    const keys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]);
    expect(keys.length).toBeGreaterThan(50);
    for (const key of keys) expect(dicts.en[key], key).toBeDefined();
  });

  it('data-i18n-attr', () => {
    const specs = [...html.matchAll(/data-i18n-attr="([^"]+)"/g)].map((m) => JSON.parse(decode(m[1])));
    expect(specs.length).toBeGreaterThan(5);
    for (const spec of specs) {
      for (const { k } of Object.values(spec) as { k: string }[]) expect(dicts.en[k], k).toBeDefined();
    }
  });
});
