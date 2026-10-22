import { describe, expect, it } from 'vitest';
import { buildDictionaries, createTranslator } from '../../src/i18n/dictionary';
import {
  COMMANDS,
  MAX_INPUT_LENGTH,
  complete,
  execute,
  isCommand,
  isSafeHref,
  type Block,
  type TerminalContext,
} from '../../src/lib/terminal';

const dicts = buildDictionaries();

function ctx(lang: 'pt' | 'en' = 'pt'): TerminalContext {
  return {
    t: createTranslator(dicts[lang]),
    data: {
      name: 'Alisson Abreu',
      projects: [
        { id: 'nutridiet', name: 'NutriDiet', summaryKey: 'project.nutridiet.summary' },
        { id: 'petshop-api', name: 'PetShop API', summaryKey: 'project.petshop-api.summary' },
      ],
      skills: [{ titleKey: 'skillCategory.language', itemKeys: ['skill.language.0.name'] }],
      contacts: [{ labelKey: 'contact.github', href: 'https://github.com/HeyArtic', display: 'github.com/HeyArtic' }],
      resumeHref: '/portfolio/cv/alisson-abreu-curriculo.pdf',
      certificates: { count: 12, hours: 167, latestTitle: 'Especialização/Formação em Python' },
    },
  };
}

const texts = (blocks: Block[]) =>
  blocks.flatMap((b) => {
    if (b.kind === 'text') return [b.text];
    if (b.kind === 'rows') return b.rows.flatMap((r) => [r.key, r.value]);
    if (b.kind === 'links') return b.links.map((l) => l.label);
    return b.actions.map((a) => a.label);
  });

describe('terminal: comandos permitidos', () => {
  it('help lista todos os comandos da lista explícita', () => {
    const result = execute('help', ctx());
    const rows = result.blocks.find((b) => b.kind === 'rows');
    expect(rows?.kind === 'rows' && rows.rows.map((r) => r.key)).toEqual([...COMMANDS]);
  });

  it.each(['help', 'about', 'projects', 'skills', 'certs', 'contact', 'cv', 'whoami'])(
    '%s produz saída sem chaves de tradução cruas',
    (cmd) => {
      for (const lang of ['pt', 'en'] as const) {
        const output = texts(execute(cmd, ctx(lang)).blocks);
        expect(output.length).toBeGreaterThan(0);
        for (const line of output) expect(line).not.toMatch(/^(terminal|project|skill|contact)\.[\w.-]+$/);
      }
    },
  );

  it('é insensível a maiúsculas e espaços extras', () => {
    expect(execute('  HELP  ', ctx()).blocks.length).toBeGreaterThan(0);
  });

  it('clear sinaliza limpeza', () => {
    expect(execute('clear', ctx())).toEqual({ blocks: [], clear: true });
  });

  it('entrada vazia não produz saída', () => {
    expect(execute('   ', ctx()).blocks).toEqual([]);
  });
});

describe('terminal: segurança', () => {
  it('comando desconhecido retorna mensagem de erro clara', () => {
    const result = execute('rm -rf /', ctx());
    expect(result.blocks[0]).toMatchObject({ kind: 'text', tone: 'error' });
    expect(texts(result.blocks).join(' ')).toContain('comando não encontrado: rm');
    expect(result.effect).toBeUndefined();
  });

  it.each(['constructor', '__proto__', 'toString', 'hasOwnProperty', 'valueOf'])(
    'propriedades herdadas (%s) não são comandos',
    (name) => {
      expect(isCommand(name)).toBe(false);
      expect(execute(name, ctx()).blocks[0]).toMatchObject({ tone: 'error' });
    },
  );

  it('entradas com código ou HTML são tratadas como texto, sem execução', () => {
    for (const input of ['alert(1)', '<img src=x onerror=alert(1)>', '${process.env}', 'eval("1")']) {
      const result = execute(input, ctx());
      expect(result.effect).toBeUndefined();
      expect(result.blocks[0]).toMatchObject({ kind: 'text', tone: 'error' });
    }
  });

  it(`rejeita entradas acima de ${MAX_INPUT_LENGTH} caracteres`, () => {
    const result = execute('a'.repeat(MAX_INPUT_LENGTH + 1), ctx());
    expect(texts(result.blocks)[0]).toContain(String(MAX_INPUT_LENGTH));
  });

  it('isSafeHref aceita só https, mailto e caminhos relativos', () => {
    expect(isSafeHref('https://github.com/HeyArtic')).toBe(true);
    expect(isSafeHref('mailto:alguem@example.com')).toBe(true);
    expect(isSafeHref('/portfolio/cv/arquivo.pdf')).toBe(true);
    expect(isSafeHref('javascript:alert(1)')).toBe(false);
    expect(isSafeHref('JavaScript:alert(1)')).toBe(false);
    expect(isSafeHref('data:text/html,<b>x</b>')).toBe(false);
    expect(isSafeHref('http://example.com')).toBe(false);
    expect(isSafeHref('//evil.example')).toBe(false);
  });
});

describe('terminal: efeitos', () => {
  it('open <id> abre o projeto existente', () => {
    expect(execute('open petshop-api', ctx()).effect).toEqual({ type: 'openProject', id: 'petshop-api' });
  });

  it('open com id inexistente não tem efeito', () => {
    const result = execute('open nada', ctx());
    expect(result.effect).toBeUndefined();
    expect(result.blocks[0]).toMatchObject({ tone: 'error' });
  });

  it('lang en troca o idioma; lang inválido mostra o uso', () => {
    expect(execute('lang en', ctx()).effect).toEqual({ type: 'setLang', lang: 'en' });
    expect(execute('lang fr', ctx()).effect).toBeUndefined();
  });

  it('cv retorna o link do currículo', () => {
    const block = execute('cv', ctx()).blocks[0];
    expect(block.kind === 'links' && block.links[0].href).toBe('/portfolio/cv/alisson-abreu-curriculo.pdf');
  });
});

describe('terminal: autocompletar', () => {
  it('completa comandos e ids', () => {
    expect(complete('he', [])).toEqual(['help']);
    expect(complete('c', [])).toEqual(['certs', 'contact', 'cv', 'clear']);
    expect(complete('open pet', ['nutridiet', 'petshop-api'])).toEqual(['open petshop-api']);
    expect(complete('lang e', [])).toEqual(['lang en']);
    expect(complete('help extra', [])).toEqual([]);
  });
});
