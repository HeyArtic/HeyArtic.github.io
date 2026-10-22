import { describe, expect, it, vi } from 'vitest';
import { cacheKey, fetchRepos, parseRepos, type StorageLike } from '../../src/lib/github';

const sample = [
  {
    full_name: 'HeyArtic/PetShop',
    name: 'PetShop',
    description: null,
    language: 'Python',
    html_url: 'https://github.com/HeyArtic/PetShop',
    pushed_at: '2025-09-19T00:00:00Z',
    archived: false,
    fork: false,
  },
];

function memoryStorage(initial: Record<string, string> = {}): StorageLike & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => {
      data[k] = v;
    },
  };
}

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('parseRepos', () => {
  it('normaliza uma resposta válida', () => {
    expect(parseRepos(sample)).toEqual([
      {
        fullName: 'HeyArtic/PetShop',
        name: 'PetShop',
        description: null,
        language: 'Python',
        htmlUrl: 'https://github.com/HeyArtic/PetShop',
        pushedAt: '2025-09-19T00:00:00Z',
        archived: false,
        fork: false,
      },
    ]);
  });

  it('rejeita formatos inesperados e descarta itens malformados', () => {
    expect(parseRepos({ message: 'API rate limit exceeded' })).toBeNull();
    expect(parseRepos(null)).toBeNull();
    expect(parseRepos([{ name: 1 }, { ...sample[0], html_url: 'javascript:alert(1)' }, sample[0]])).toHaveLength(1);
  });
});

describe('fetchRepos', () => {
  it('busca, valida e grava em cache', async () => {
    const storage = memoryStorage();
    const fetchImpl = vi.fn(async () => jsonResponse(sample));
    const result = await fetchRepos('HeyArtic', { fetchImpl, storage, now: () => 1000 });
    expect(result.status).toBe('fresh');
    expect(result.repos?.[0].fullName).toBe('HeyArtic/PetShop');
    expect(JSON.parse(storage.data[cacheKey('HeyArtic')]).savedAt).toBe(1000);
  });

  it('usa o cache válido sem nova requisição', async () => {
    const storage = memoryStorage({
      [cacheKey('HeyArtic')]: JSON.stringify({ savedAt: 1000, repos: parseRepos(sample) }),
    });
    const fetchImpl = vi.fn();
    const result = await fetchRepos('HeyArtic', { fetchImpl, storage, now: () => 2000 });
    expect(result.status).toBe('cache');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('em limite de requisições (403) devolve o cache expirado', async () => {
    const storage = memoryStorage({
      [cacheKey('HeyArtic')]: JSON.stringify({ savedAt: 0, repos: parseRepos(sample) }),
    });
    const fetchImpl = vi.fn(async () => jsonResponse({ message: 'rate limit' }, 403));
    const result = await fetchRepos('HeyArtic', { fetchImpl, storage, now: () => 10 ** 12 });
    expect(result.status).toBe('stale');
    expect(result.repos).toHaveLength(1);
  });

  it('sem rede e sem cache retorna "unavailable" sem lançar exceção', async () => {
    const fetchImpl = vi.fn(async () => {
      throw new TypeError('Failed to fetch');
    });
    await expect(fetchRepos('HeyArtic', { fetchImpl, storage: memoryStorage() })).resolves.toEqual({
      status: 'unavailable',
      repos: null,
    });
  });

  it('resposta com JSON inválido não quebra', async () => {
    const fetchImpl = vi.fn(async () => new Response('<html>erro</html>', { status: 200 }));
    expect((await fetchRepos('HeyArtic', { fetchImpl })).status).toBe('unavailable');
  });

  it('cancela a requisição após o timeout', async () => {
    const fetchImpl = vi.fn(
      (_url: string | URL | Request, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
        }),
    );
    const result = await fetchRepos('HeyArtic', { fetchImpl: fetchImpl as typeof fetch, timeoutMs: 20 });
    expect(result.status).toBe('unavailable');
  });

  it('cache corrompido é ignorado', async () => {
    const storage = memoryStorage({ [cacheKey('HeyArtic')]: '{não é json' });
    const fetchImpl = vi.fn(async () => jsonResponse(sample));
    expect((await fetchRepos('HeyArtic', { fetchImpl, storage })).status).toBe('fresh');
  });
});
