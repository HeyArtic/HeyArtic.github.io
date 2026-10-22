import { fetchRepos, type RepoMeta } from '../lib/github';
import { getLang, onLangChange, t } from './i18n';

function formatMonth(iso: string, lang: 'pt' | 'en'): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(lang === 'pt' ? 'pt-BR' : 'en-US', { month: 'short', year: 'numeric' }).format(date);
}

function storage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function render(byName: Map<string, RepoMeta>): void {
  const lang = getLang();
  document.querySelectorAll<HTMLElement>('[data-gh-meta]').forEach((el) => {
    const repo = byName.get((el.dataset.ghRepo ?? '').toLowerCase());
    if (!repo) return; // Mantém o texto local.
    const language = repo.language ?? el.dataset.ghLanguage ?? '';
    const date = repo.pushedAt ? formatMonth(repo.pushedAt, lang) : null;
    if (language && date) el.textContent = t('projects.ghMeta', { language, date });
    else if (date) el.textContent = t('projects.ghUpdated', { date });
    else if (language) el.textContent = t('projects.ghLanguage', { language });
  });
}

/**
 * Complementa os cards com metadados públicos do GitHub, sem bloquear a página.
 * Se a API falhar, os dados locais continuam visíveis e nenhum erro é exibido.
 */
export function initGithub(username: string): void {
  const targets = document.querySelectorAll('[data-gh-meta]');
  if (targets.length === 0) return;

  const start = async () => {
    const { repos } = await fetchRepos(username, { storage: storage() });
    if (!repos) return;
    const byName = new Map(repos.map((r) => [r.fullName.toLowerCase(), r]));
    render(byName);
    onLangChange(() => render(byName));

    const source = document.querySelector<HTMLElement>('[data-gh-source]');
    if (source) {
      source.dataset.i18n = 'projects.sourceGithub';
      source.textContent = t('projects.sourceGithub');
    }
  };

  // Executa quando o navegador estiver ocioso, depois do conteúdo principal.
  if ('requestIdleCallback' in window) window.requestIdleCallback(() => void start(), { timeout: 2500 });
  else setTimeout(() => void start(), 300);
}
