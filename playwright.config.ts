import { defineConfig, devices } from '@playwright/test';

/**
 * Testes ponta a ponta contra o build de produção (`npm run build` antes).
 * PW_CHANNEL=msedge ou PW_CHANNEL=chrome usa um navegador já instalado;
 * sem a variável, usa o Chromium do Playwright (`npx playwright install chromium`).
 */
const PORT = 4329;
const BASE_PATH = process.env.BASE_PATH ?? '/portfolio';
const channel = process.env.PW_CHANNEL || undefined;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}${BASE_PATH.replace(/\/?$/, '/')}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], channel } }],
  webServer: {
    command: `npx astro preview --host 127.0.0.1 --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}${BASE_PATH.replace(/\/?$/, '/')}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
