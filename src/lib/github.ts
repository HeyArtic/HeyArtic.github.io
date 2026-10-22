/**
 * Consulta à API pública do GitHub — apenas para complementar os dados locais.
 *
 * - Sem token: a API pública permite 60 requisições/hora por IP, o suficiente
 *   para uma requisição por visitante, guardada em cache.
 * - Nunca lança exceção: em erro de rede, timeout, limite de requisições ou
 *   resposta inválida, retorna o cache antigo (se houver) ou `null`.
 */

export interface RepoMeta {
  fullName: string;
  name: string;
  description: string | null;
  language: string | null;
  htmlUrl: string;
  pushedAt: string | null;
  archived: boolean;
  fork: boolean;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface FetchReposOptions {
  fetchImpl?: typeof fetch;
  storage?: StorageLike | null;
  now?: () => number;
  ttlMs?: number;
  timeoutMs?: number;
}

export type FetchStatus = 'fresh' | 'cache' | 'stale' | 'unavailable';

export interface FetchReposResult {
  status: FetchStatus;
  repos: RepoMeta[] | null;
}

const CACHE_VERSION = 'v1';
const DEFAULT_TTL = 6 * 60 * 60 * 1000;
const DEFAULT_TIMEOUT = 6000;

export const cacheKey = (user: string) => `gh-repos:${CACHE_VERSION}:${user.toLowerCase()}`;

const isStringOrNull = (v: unknown): v is string | null => v === null || typeof v === 'string';

/** Valida e normaliza a resposta de /users/:user/repos. Itens malformados são descartados. */
export function parseRepos(json: unknown): RepoMeta[] | null {
  if (!Array.isArray(json)) return null;
  const repos: RepoMeta[] = [];
  for (const item of json) {
    if (!item || typeof item !== 'object') continue;
    const r = item as Record<string, unknown>;
    if (typeof r.full_name !== 'string' || typeof r.name !== 'string' || typeof r.html_url !== 'string') continue;
    if (!r.html_url.startsWith('https://github.com/')) continue;
    repos.push({
      fullName: r.full_name,
      name: r.name,
      description: isStringOrNull(r.description) ? r.description : null,
      language: isStringOrNull(r.language) ? r.language : null,
      htmlUrl: r.html_url,
      pushedAt: isStringOrNull(r.pushed_at) ? r.pushed_at : null,
      archived: r.archived === true,
      fork: r.fork === true,
    });
  }
  return repos;
}

interface CacheEntry {
  savedAt: number;
  repos: RepoMeta[];
}

function readCache(storage: StorageLike | null | undefined, key: string): CacheEntry | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CacheEntry>;
    if (typeof parsed.savedAt !== 'number' || !Array.isArray(parsed.repos)) return null;
    return { savedAt: parsed.savedAt, repos: parsed.repos };
  } catch {
    return null;
  }
}

function writeCache(storage: StorageLike | null | undefined, key: string, entry: CacheEntry) {
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(entry));
  } catch {
    // Armazenamento cheio ou bloqueado: segue sem cache.
  }
}

export async function fetchRepos(user: string, options: FetchReposOptions = {}): Promise<FetchReposResult> {
  const {
    fetchImpl = globalThis.fetch,
    storage = null,
    now = Date.now,
    ttlMs = DEFAULT_TTL,
    timeoutMs = DEFAULT_TIMEOUT,
  } = options;

  const key = cacheKey(user);
  const cached = readCache(storage, key);
  if (cached && now() - cached.savedAt < ttlMs) return { status: 'cache', repos: cached.repos };

  const fallback = (): FetchReposResult =>
    cached ? { status: 'stale', repos: cached.repos } : { status: 'unavailable', repos: null };

  if (typeof fetchImpl !== 'function') return fallback();

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

  try {
    const url = `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&type=owner`;
    const response = await fetchImpl(url, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: controller?.signal,
    });
    // 403/429 = limite de requisições; 404 = usuário inexistente; 5xx = indisponível.
    if (!response.ok) return fallback();
    const repos = parseRepos(await response.json());
    if (!repos) return fallback();
    writeCache(storage, key, { savedAt: now(), repos });
    return { status: 'fresh', repos };
  } catch {
    return fallback();
  } finally {
    if (timer) clearTimeout(timer);
  }
}
