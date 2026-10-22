# Portfolio · Alisson Abreu

Bilingual (PT/EN) portfolio for a junior backend developer (Python): projects, evidence-based skills, certificates, an interactive terminal and the public GitHub API used as a complement.

> Full documentation in Portuguese: [README.md](README.md)

## Stack

- **Astro 7** (static output) + **TypeScript**: HTML is generated at build time, which helps SEO and keeps client-side JavaScript small (about 19 KB).
- **Plain CSS** with design tokens, dark theme and `prefers-reduced-motion` support.
- **Native `<dialog>`** for accessible modals (focus containment, Escape, inert background).
- **Vitest** for unit tests and **Playwright + axe** for end-to-end and accessibility tests.
- No backend: the site is static, and the GitHub API is public.

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321/portfolio/
npm run build      # outputs ./dist
npm run verify     # type check + unit tests + build + e2e tests
```

E2E tests need either the Playwright Chromium (`npx playwright install chromium`) or an installed browser (`PW_CHANNEL=msedge` or `chrome`).

## Editing content

| What | Where |
|---|---|
| Name, links, email, resume | `src/config/site.ts` (set a field to `null` to hide it) |
| Projects (order, texts, links) | `src/data/projects.ts` |
| Skills and evidence | `src/data/skills.ts` |
| Certificates | PDF in `public/certificates/` + entry in `src/data/certificates.ts` |
| UI translations | `src/i18n/ui.ts` (`en` is typed from `pt`, so a missing key fails the type check) |

Every content text is a `{ pt, en }` object. Run `npm test` after editing: it checks that the PDFs exist, IDs are unique, links use https and both languages have the same keys.

## GitHub integration

A single request to `api.github.com/users/HeyArtic/repos`, made after the page loads, adds each repository's main language and last update date to the cards. Results are cached for 6 hours in `localStorage`, with a 6-second timeout. On network errors, rate limits or invalid responses, the site falls back silently to stale cache or local data. No tokens are used. Project curation always stays local.

## Terminal

The terminal is not a shell. Input is matched against an explicit allowlist of commands. There is no `eval`, `Function` or `innerHTML`; output is built with `textContent`, and links are restricted to `https:`, `mailto:` and relative paths.

## Deployment (GitHub Pages, free)

1. Create a public repository named `portfolio` and push to `main`.
2. Go to **Settings → Pages → Source: GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) type-checks, tests, builds and deploys the site to `https://heyartic.github.io/portfolio/`.

Custom domains and Vercel/Netlify are covered in the Portuguese README.

## Privacy

Everything in `public/` (resume and certificates) is publicly accessible. The site uses no trackers, cookies or analytics.
