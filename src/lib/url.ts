/** Prefixa um caminho de `public/` com o `base` do site (necessário no GitHub Pages). */
export function withBase(path: string, base: string = import.meta.env.BASE_URL): string {
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${path.replace(/^\/+/, '')}`;
}
