/**
 * Motor do terminal do portfólio.
 *
 * Não é um shell: a entrada é dividida em palavras e comparada com uma lista
 * explícita de comandos. Não há eval, Function, acesso a arquivos ou rede.
 * Cada comando retorna blocos de dados; a camada de UI os renderiza com
 * textContent (nunca innerHTML).
 */

import type { Lang } from '../i18n/types';
import { isLang } from '../i18n/types';

export type Translate = (key: string, vars?: Record<string, string | number>) => string;

export type SectionTarget = 'projects' | 'skills' | 'certificates' | 'contact' | 'about';

export type TerminalAction =
  | { type: 'scroll'; target: SectionTarget }
  | { type: 'openProject'; id: string }
  | { type: 'setLang'; lang: Lang };

export type Block =
  | { kind: 'text'; text: string; tone?: 'muted' | 'error' | 'accent' }
  | { kind: 'rows'; rows: { key: string; value: string }[] }
  | { kind: 'links'; links: { label: string; href: string }[] }
  | { kind: 'actions'; actions: { label: string; action: TerminalAction }[] };

export interface CommandResult {
  blocks: Block[];
  /** Limpa a saída antes de exibir os blocos. */
  clear?: boolean;
  /** Efeito executado uma única vez pela UI (não é repetido ao trocar de idioma). */
  effect?: TerminalAction;
}

export interface TerminalData {
  name: string;
  projects: { id: string; name: string; summaryKey: string }[];
  skills: { titleKey: string; itemKeys: string[] }[];
  contacts: { labelKey: string; href: string; display: string }[];
  resumeHref: string | null;
  certificates: { count: number; hours: number; latestTitle: string | null };
}

export interface TerminalContext {
  t: Translate;
  data: TerminalData;
}

export const MAX_INPUT_LENGTH = 64;

type Handler = (args: string[], ctx: TerminalContext) => CommandResult;

/** Lista explícita de comandos permitidos (a ordem é a mesma exibida no `help`). */
export const COMMANDS = ['help', 'about', 'projects', 'open', 'skills', 'certs', 'contact', 'cv', 'lang', 'whoami', 'clear'] as const;
export type CommandName = (typeof COMMANDS)[number];

const text = (value: string, tone?: 'muted' | 'error' | 'accent'): Block => ({ kind: 'text', text: value, tone });

const handlers: Record<CommandName, Handler> = {
  help: (_args, { t }) => ({
    blocks: [
      text(t('terminal.out.helpTitle'), 'accent'),
      {
        kind: 'rows',
        rows: COMMANDS.map((name) => ({ key: name, value: t(`terminal.cmd.${name}`) })),
      },
      text(t('terminal.out.helpKeys'), 'muted'),
    ],
  }),

  about: (_args, { t, data }) => ({
    blocks: [
      text(t('terminal.out.aboutLine1', { name: data.name })),
      text(t('terminal.out.aboutLine2')),
      text(t('terminal.out.aboutLine3')),
      { kind: 'actions', actions: [{ label: t('nav.about'), action: { type: 'scroll', target: 'about' } }] },
    ],
  }),

  projects: (_args, { t, data }) => ({
    blocks: [
      text(t('terminal.out.projectsTitle', { n: data.projects.length }), 'accent'),
      { kind: 'rows', rows: data.projects.map((p) => ({ key: p.id, value: `${p.name}: ${t(p.summaryKey)}` })) },
      text(t('terminal.out.projectsHint'), 'muted'),
      {
        kind: 'actions',
        actions: [{ label: t('terminal.out.goToProjects'), action: { type: 'scroll', target: 'projects' } }],
      },
    ],
  }),

  open: (args, { t, data }) => {
    const ids = data.projects.map((p) => p.id).join(', ');
    const id = args[0]?.toLowerCase();
    if (!id) return { blocks: [text(t('terminal.out.openUsage', { ids }), 'muted')] };
    const project = data.projects.find((p) => p.id === id);
    if (!project) {
      return { blocks: [text(t('terminal.out.openNotFound', { id: truncate(id), ids }), 'error')] };
    }
    return {
      blocks: [text(t('terminal.out.opening', { name: project.name }))],
      effect: { type: 'openProject', id: project.id },
    };
  },

  skills: (_args, { t, data }) => ({
    blocks: [
      text(t('terminal.out.skillsTitle'), 'accent'),
      {
        kind: 'rows',
        rows: data.skills.map((s) => ({ key: t(s.titleKey), value: s.itemKeys.map((k) => t(k)).join(', ') })),
      },
      {
        kind: 'actions',
        actions: [{ label: t('terminal.out.goToSkills'), action: { type: 'scroll', target: 'skills' } }],
      },
    ],
  }),

  certs: (_args, { t, data }) => {
    const { count, hours, latestTitle } = data.certificates;
    const countLabel = t(count === 1 ? 'certs.countOne' : 'certs.countOther', { n: count });
    const blocks: Block[] = [text(t('terminal.out.certsLine', { count: countLabel, hours: `${hours}h` }))];
    if (latestTitle) blocks.push(text(t('terminal.out.certsLatest', { title: latestTitle }), 'muted'));
    blocks.push({
      kind: 'actions',
      actions: [{ label: t('terminal.out.goToCerts'), action: { type: 'scroll', target: 'certificates' } }],
    });
    return { blocks };
  },

  contact: (_args, { t, data }) => ({
    blocks: [
      text(t('terminal.out.contactTitle'), 'accent'),
      { kind: 'links', links: data.contacts.map((c) => ({ label: `${t(c.labelKey)}: ${c.display}`, href: c.href })) },
      {
        kind: 'actions',
        actions: [{ label: t('terminal.out.goToContact'), action: { type: 'scroll', target: 'contact' } }],
      },
    ],
  }),

  cv: (_args, { t, data }) =>
    data.resumeHref
      ? { blocks: [{ kind: 'links', links: [{ label: t('terminal.out.cvOpen'), href: data.resumeHref }] }] }
      : { blocks: [text(t('terminal.out.cvMissing'), 'muted')] },

  lang: (args, { t }) => {
    const lang = args[0]?.toLowerCase();
    if (!isLang(lang)) return { blocks: [text(t('terminal.out.langUsage'), 'muted')] };
    // A mensagem é traduzida pela UI depois da troca de idioma (re-renderização).
    return { blocks: [text(t('terminal.out.langChanged'))], effect: { type: 'setLang', lang } };
  },

  whoami: (_args, { t }) => ({ blocks: [text(t('terminal.out.whoami'))] }),

  clear: () => ({ blocks: [], clear: true }),
};

/** Verdadeiro apenas para comandos próprios da lista (ignora `constructor`, `__proto__` etc.). */
export function isCommand(name: string): name is CommandName {
  return Object.prototype.hasOwnProperty.call(handlers, name);
}

function truncate(value: string, max = 32): string {
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

export function parse(raw: string): { name: string; args: string[] } | null {
  const parts = raw.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return null;
  const [name, ...args] = parts;
  return { name: name.toLowerCase(), args };
}

export function execute(raw: string, ctx: TerminalContext): CommandResult {
  if (raw.length > MAX_INPUT_LENGTH) {
    return { blocks: [text(ctx.t('terminal.out.tooLong', { max: MAX_INPUT_LENGTH }), 'error')] };
  }
  const parsed = parse(raw);
  if (!parsed) return { blocks: [] };
  if (!isCommand(parsed.name)) {
    return {
      blocks: [
        text(ctx.t('terminal.out.notFound', { cmd: truncate(parsed.name) }), 'error'),
        text(ctx.t('terminal.out.notFoundHint'), 'muted'),
      ],
    };
  }
  return handlers[parsed.name](parsed.args, ctx);
}

/** Sugestões de autocompletar para a entrada atual. */
export function complete(raw: string, projectIds: string[]): string[] {
  const value = raw.trimStart().toLowerCase();
  const openMatch = /^open\s+(\S*)$/.exec(value);
  if (openMatch) {
    return projectIds.filter((id) => id.startsWith(openMatch[1])).map((id) => `open ${id}`);
  }
  const langMatch = /^lang\s+(\S*)$/.exec(value);
  if (langMatch) {
    return ['pt', 'en'].filter((l) => l.startsWith(langMatch[1])).map((l) => `lang ${l}`);
  }
  if (/\s/.test(value)) return [];
  return COMMANDS.filter((c) => c.startsWith(value));
}

/** Aceita apenas links https, mailto e caminhos relativos do próprio site. */
export function isSafeHref(href: string): boolean {
  if (/^(https:|mailto:)/i.test(href)) return true;
  return !/^[a-z][a-z0-9+.-]*:/i.test(href) && !href.startsWith('//');
}
