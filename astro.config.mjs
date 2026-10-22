// @ts-check
import { defineConfig } from 'astro/config';

/**
 * SITE_URL e BASE_PATH vêm do ambiente para funcionar em qualquer hospedagem:
 *  - GitHub Pages (repositório "portfolio"): SITE_URL=https://heyartic.github.io  BASE_PATH=/portfolio
 *  - Domínio próprio ou Vercel/Netlify:      SITE_URL=https://seudominio.com.br  BASE_PATH=/
 * O workflow do GitHub Actions preenche os dois automaticamente.
 */
const site = process.env.SITE_URL || 'https://heyartic.github.io';
// BASE_PATH vazio (site de usuário ou domínio próprio) significa raiz "/".
const base = process.env.BASE_PATH === undefined ? '/portfolio' : process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
});
