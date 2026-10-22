import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const GITHUB_API = 'https://api.github.com/**';

/** Por padrão, a API do GitHub responde com dados fixos para os testes serem determinísticos. */
async function mockGithub(page: Page, mode: 'ok' | 'offline' | 'rate-limit' = 'ok') {
  await page.route(GITHUB_API, (route) => {
    if (mode === 'offline') return route.abort('internetdisconnected');
    if (mode === 'rate-limit') return route.fulfill({ status: 403, json: { message: 'API rate limit exceeded' } });
    return route.fulfill({
      json: [
        {
          full_name: 'HeyArtic/PetShop',
          name: 'PetShop',
          description: null,
          language: 'Python',
          html_url: 'https://github.com/HeyArtic/PetShop',
          pushed_at: '2025-09-19T12:00:00Z',
          archived: false,
          fork: false,
        },
      ],
    });
  });
}

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}

test.beforeEach(async ({ page }) => {
  await mockGithub(page);
});

test.describe('carregamento', () => {
  test('página carrega sem erros de console e com metadados de SEO', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto('./');
    await expect(page).toHaveTitle(/Alisson Abreu/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /backend/i);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og-image\.png$/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https:\/\//);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Backend Developer');
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });

  test('NutriDiet é o primeiro card e há seis projetos', async ({ page }) => {
    await page.goto('./');
    const cards = page.locator('.project-card');
    await expect(cards).toHaveCount(6);
    await expect(cards.first()).toContainText('NutriDiet');
    await expect(cards.first()).toContainText('Projeto principal');
  });
});

test.describe('idiomas', () => {
  test('alterna PT ↔ EN sem recarregar e mantém a preferência', async ({ page }) => {
    await page.goto('./');
    await page.evaluate(() => ((window as unknown as { __marker: number }).__marker = 42));

    await page.getByRole('button', { name: 'EN', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('.hero-title')).toContainText('clean code and scalable solutions');
    await expect(page.getByRole('heading', { name: 'Projects', level: 2 })).toBeVisible();
    await expect(page.locator('#certs-title')).toHaveText('Certificates');
    await expect(page.locator('[data-cert-status]')).toHaveText('Showing 12 of 12');
    await expect(page.getByRole('button', { name: 'EN', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(page).toHaveTitle(/Python Backend Developer/);
    // Mesmo documento: nada foi recarregado.
    expect(await page.evaluate(() => (window as unknown as { __marker?: number }).__marker)).toBe(42);

    // Nenhum texto marcado ficou sem tradução (chave crua).
    const raw = await page.locator('[data-i18n]').evaluateAll((els) =>
      els.map((e) => e.textContent ?? '').filter((txt) => /^[a-z]+(\.[\w-]+)+$/.test(txt)),
    );
    expect(raw).toEqual([]);

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('.hero-desc')).toContainText('I build REST APIs');

    await page.getByRole('button', { name: 'PT', exact: true }).click();
    await expect(page.locator('.hero-desc')).toContainText('Construo APIs REST');
  });

  test('?lang=en abre direto em inglês', async ({ page }) => {
    await page.goto('./?lang=en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('#about-title')).toHaveText('About me');
  });
});

test.describe('modais de projeto', () => {
  test('abre, prende o foco, fecha com Escape e devolve o foco', async ({ page }) => {
    await page.goto('./');
    const trigger = page.locator('[data-open-dialog="project-petshop-api"]');
    await trigger.click();
    const dialog = page.locator('#project-petshop-api');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'PetShop API' })).toBeVisible();
    await expect(dialog).toContainText('Funcionalidades (verificadas no código)');

    // O foco fica dentro do modal ao navegar com Tab.
    for (let i = 0; i < 8; i++) await page.keyboard.press('Tab');
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('#project-petshop-api')))).toBe(true);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('fecha pelo botão e pelo clique fora da janela', async ({ page }) => {
    await page.goto('./');
    const dialog = page.locator('#project-nutridiet');

    await page.locator('[data-open-dialog="project-nutridiet"]').click();
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('descritas no site público');
    await dialog.getByRole('button', { name: 'Fechar' }).click();
    await expect(dialog).toBeHidden();

    await page.locator('[data-open-dialog="project-nutridiet"]').click();
    await expect(dialog).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(dialog).toBeHidden();
  });

  test('certificado relacionado abre o visualizador a partir do modal', async ({ page }) => {
    await page.goto('./');
    await page.locator('[data-open-dialog="project-delivery-api"]').click();
    await page.locator('#project-delivery-api [data-open-cert="nosql-mongodb"]').click();
    await expect(page.locator('#project-delivery-api')).toBeHidden();
    await expect(page.locator('#cert-viewer')).toBeVisible();
    await expect(page.locator('#cert-viewer-title')).toHaveText('NoSQL com MongoDB');
  });
});

test.describe('terminal', () => {
  async function run(page: Page, command: string) {
    const input = page.locator('[data-term-input]');
    await input.fill(command);
    await input.press('Enter');
  }

  test('comandos válidos, inválidos e histórico', async ({ page }) => {
    await page.goto('./');
    const output = page.locator('[data-term-output]');

    await run(page, 'help');
    for (const cmd of ['help', 'about', 'projects', 'skills', 'contact', 'clear']) {
      await expect(output.locator('dt', { hasText: new RegExp(`^${cmd}$`) })).toHaveCount(1);
    }

    await run(page, 'sudo rm -rf /');
    await expect(output).toContainText('comando não encontrado: sudo');

    await run(page, 'constructor');
    await expect(output).toContainText('comando não encontrado: constructor');

    await run(page, '<img src=x onerror=alert(1)>');
    await expect(output.locator('img')).toHaveCount(0);

    await run(page, 'contact');
    await expect(output.locator('a[href="https://github.com/HeyArtic"]')).toHaveCount(1);

    await run(page, 'skills');
    await expect(output).toContainText('Linguagem principal');

    const input = page.locator('[data-term-input]');
    await input.press('ArrowUp');
    await expect(input).toHaveValue('skills');
    await input.press('ArrowUp');
    await expect(input).toHaveValue('contact');

    await run(page, 'clear');
    await expect(output.locator('.term-entry')).toHaveCount(0);
    await expect(output).toContainText('Bem-vindo');
  });

  test('autocompletar com Tab, open e lang', async ({ page }) => {
    await page.goto('./');
    const input = page.locator('[data-term-input]');
    await input.fill('proj');
    await input.press('Tab');
    await expect(input).toHaveValue('projects');

    await run(page, 'open rabbitmq-telegram');
    await expect(page.locator('#project-rabbitmq-telegram')).toBeVisible();
    await page.keyboard.press('Escape');

    await run(page, 'projects');
    await run(page, 'lang en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    // A sessão é re-renderizada no novo idioma.
    await expect(page.locator('[data-term-output]')).toContainText('Use \'open <id>\' to see the technical details.');
    await expect(page.locator('[data-term-output]')).toContainText('Language changed to English.');
  });
});

test.describe('GitHub API', () => {
  test('com a API disponível, complementa os cards', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('[data-project="petshop-api"] [data-gh-meta]')).toContainText('set. de 2025');
    await expect(page.locator('[data-gh-source]')).toContainText('API pública do GitHub');
  });

  for (const mode of ['offline', 'rate-limit'] as const) {
    test(`sem a API (${mode}) os projetos locais continuam visíveis e sem erro aparente`, async ({ page }) => {
      await page.unrouteAll();
      await mockGithub(page, mode);
      const pageErrors: string[] = [];
      page.on('pageerror', (e) => pageErrors.push(e.message));
      await page.goto('./');
      await page.waitForTimeout(3500); // requestIdleCallback + timeout
      await expect(page.locator('.project-card')).toHaveCount(6);
      await expect(page.locator('[data-project="petshop-api"] [data-gh-meta]')).toHaveText('GitHub: Python');
      await expect(page.locator('[data-gh-source]')).toHaveText('Dados dos projetos: curadoria local.');
      await expect(page.locator('body')).not.toContainText(/rate limit|Failed to fetch|TypeError/i);
      expect(pageErrors).toEqual([]);
    });
  }
});

test.describe('links, currículo e certificados', () => {
  test('currículo e todos os PDFs de certificados respondem 200', async ({ page, request }) => {
    await page.goto('./');
    const resume = await page.locator('.hero [data-resume-link]').first().getAttribute('href');
    expect(resume).toBeTruthy();
    const resumeRes = await request.get(new URL(resume!, page.url()).href);
    expect(resumeRes.status()).toBe(200);
    expect(resumeRes.headers()['content-type']).toContain('pdf');

    const hrefs = await page.locator('.cert-card a[download]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
    expect(hrefs).toHaveLength(12);
    for (const href of hrefs) expect((await request.get(href)).status(), href).toBe(200);
  });

  test('links externos usam https e abrem em nova aba com noopener', async ({ page }) => {
    await page.goto('./');
    const bad = await page.locator('a[target="_blank"][href]').evaluateAll((as) =>
      as
        .map((a) => a as HTMLAnchorElement)
        .filter((a) => !a.rel.includes('noopener') || !/^(https:|http:\/\/127\.0\.0\.1)/.test(a.href))
        .map((a) => a.outerHTML.slice(0, 120)),
    );
    expect(bad).toEqual([]);
    // Apenas os links do visualizador (preenchidos ao abrir um PDF) podem estar sem href.
    const empty = await page
      .locator('a')
      .evaluateAll((as) => as.filter((a) => !a.getAttribute('href') && !a.closest('#cert-viewer')).length);
    expect(empty).toBe(0);
  });

  test('busca e filtros de certificados', async ({ page }) => {
    await page.goto('./');
    const status = page.locator('[data-cert-status]');
    const visible = page.locator('.cert-card:visible');

    await page.locator('[data-cert-search]').fill('redis');
    await expect(visible).toHaveCount(2); // Redis + formação (que lista Redis nos conteúdos)
    await page.locator('[data-cert-search]').fill('autenticacao');
    await expect(visible).toHaveCount(1);
    await expect(status).toHaveText('Mostrando 1 de 12');

    await page.locator('[data-cert-search]').fill('');
    await page.locator('[data-cert-filter="events"]').click();
    await expect(visible).toHaveCount(2);
    await expect(page.locator('[data-cert-filter="events"]')).toHaveAttribute('aria-pressed', 'true');

    await page.locator('[data-cert-search]').fill('kubernetes');
    await expect(page.locator('[data-cert-empty]')).toBeVisible();
    await page.locator('[data-cert-clear]').click();
    await expect(visible).toHaveCount(12);
  });

  test('visualizador abre o PDF sob demanda e fecha com Escape', async ({ page }) => {
    const pdfRequests: string[] = [];
    page.on('request', (r) => {
      if (r.url().endsWith('.pdf')) pdfRequests.push(r.url());
    });
    await page.goto('./');
    await page.waitForLoadState('networkidle');
    expect(pdfRequests).toEqual([]); // nenhum PDF carregado na página inicial

    const trigger = page.locator('[data-cert-view="rabbitmq-python"]');
    await trigger.click();
    const viewer = page.locator('#cert-viewer');
    await expect(viewer).toBeVisible();
    await expect(viewer.locator('[data-viewer-open]')).toHaveAttribute('href', /rabbitmq-com-python\.pdf$/);
    await expect(viewer.locator('[data-viewer-verify]')).toHaveAttribute('href', /^https:\/\/app\.rocketseat\.com\.br\/certificates\//);
    const frameOrFallback = viewer.locator('[data-viewer-frame]:visible, [data-viewer-fallback]:visible');
    await expect(frameOrFallback).toHaveCount(1);

    await page.keyboard.press('Escape');
    await expect(viewer).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(viewer.locator('[data-viewer-frame]')).not.toHaveAttribute('src', /.+/);
  });

  test('arquivo ausente mostra mensagem sem quebrar a página', async ({ page }) => {
    await page.route('**/certificates/design-de-codigo.pdf', (route) => route.fulfill({ status: 404, body: 'not found' }));
    await page.goto('./');
    await page.locator('[data-cert-view="design-de-codigo"]').click();
    await expect(page.locator('[data-viewer-error]')).toBeVisible();
    await expect(page.locator('[data-viewer-open]')).toBeHidden();
    await page.keyboard.press('Escape');
    await expect(page.locator('.cert-card')).toHaveCount(12);
  });
});

test.describe('responsividade', () => {
  for (const width of [320, 375, 414, 768, 1024, 1280, 1440, 1920]) {
    test(`sem rolagem horizontal em ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('./');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('modal utilizável em tela pequena, com rolagem interna', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('./');
    await page.locator('[data-open-dialog="project-petshop-api"]').click();
    const box = await page.locator('#project-petshop-api').boundingBox();
    expect(box!.width).toBeLessThanOrEqual(320);
    expect(box!.height).toBeLessThanOrEqual(568);
    const scrollable = await page.locator('#project-petshop-api .dialog-body').evaluate((el) => el.scrollHeight > el.clientHeight);
    expect(scrollable).toBe(true);
  });

  test('menu móvel abre, navega e fecha com Escape', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('./');
    const toggle = page.locator('[data-nav-toggle]');
    await expect(page.locator('#site-nav')).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle).toHaveAttribute('aria-label', 'Fechar menu');
    await expect(page.locator('#site-nav')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#site-nav')).toBeHidden();
    await expect(toggle).toBeFocused();

    await toggle.click();
    await page.locator('#site-nav').getByRole('link', { name: 'Certificados' }).click();
    await expect(page.locator('#site-nav')).toBeHidden();
    await expect(page).toHaveURL(/#certificados$/);
  });
});

test.describe('acessibilidade', () => {
  test('primeiro Tab leva ao link "pular para o conteúdo"', async ({ page }) => {
    await page.goto('./');
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
  });

  test('sem violações automáticas do axe (WCAG 2.1 A/AA)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
    expect(summary).toEqual([]);
  });

  test('modal aberto também passa no axe', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./');
    await page.locator('[data-open-dialog="project-nutridiet"]').click();
    const results = await new AxeBuilder({ page }).include('#project-nutridiet').withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test('com movimento reduzido o conteúdo aparece sem animação', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./');
    const opacity = await page.locator('.project-card').last().evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
  });
});
