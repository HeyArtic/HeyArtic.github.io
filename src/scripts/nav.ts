import { t } from './i18n';

const DESKTOP = '(min-width: 960px)';

export function initNav(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!header || !toggle || !nav) return;

  function setOpen(open: boolean, { focusToggle = false } = {}): void {
    const labelKey = open ? 'nav.menuClose' : 'nav.menuOpen';
    header!.classList.toggle('is-open', open);
    toggle!.setAttribute('aria-expanded', String(open));
    toggle!.setAttribute('aria-label', t(labelKey));
    // Mantém o rótulo correto se o idioma for trocado com o menu aberto.
    toggle!.dataset.i18nAttr = JSON.stringify({ 'aria-label': { k: labelKey } });
    if (focusToggle) toggle!.focus();
  }

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

  nav.addEventListener('click', (event) => {
    if ((event.target as Element).closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.classList.contains('is-open')) setOpen(false, { focusToggle: true });
  });

  matchMedia(DESKTOP).addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });

  // Destaca o link da seção visível.
  const links = new Map<string, HTMLAnchorElement>();
  nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => links.set(a.hash.slice(1), a));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          links.forEach((a) => a.removeAttribute('aria-current'));
          links.get(entry.target.id)?.setAttribute('aria-current', 'true');
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    links.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }
}
