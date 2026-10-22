import { site } from '../config/site';
import { initCertificates } from './certificates-ui';
import { initDialogs } from './dialogs';
import { initGithub } from './github-ui';
import { initI18n, t } from './i18n';
import { initNav } from './nav';
import { initTerminal } from './terminal-ui';

function initReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  items.forEach((el) => observer.observe(el));
}

function initCopy(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    const status = button.parentElement?.querySelector<HTMLElement>('[data-copy-status]');
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy ?? '');
        button.classList.add('is-copied');
        if (status) status.textContent = t('contact.copied');
        setTimeout(() => {
          button.classList.remove('is-copied');
          if (status) status.textContent = '';
        }, 2000);
      } catch {
        if (status) status.textContent = t('contact.copyFailed');
      }
    });
  });
}

/** Isola falhas: um módulo com erro não impede os demais de funcionar. */
function safe(name: string, init: () => void): void {
  try {
    init();
  } catch (error) {
    console.warn(`[portfolio] ${name} não inicializado`, error);
  }
}

safe('i18n', initI18n);
safe('nav', initNav);
safe('dialogs', initDialogs);
safe('reveal', initReveal);
safe('terminal', initTerminal);
safe('certificates', initCertificates);
safe('copy', initCopy);
safe('github', () => initGithub(site.github.username));
