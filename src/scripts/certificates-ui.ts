import { matches } from '../lib/certificates';
import { closeDialogKeepingTrigger, openDialog } from './dialogs';
import { readJson } from './dom';
import { onLangChange, t } from './i18n';

interface ViewerCert {
  id: string;
  title: string;
  issuer: string | null;
  file: string | null;
  href: string | null;
  verifyUrl: string | null;
  available: boolean;
}

export function initCertificates(): void {
  const explorer = document.querySelector<HTMLElement>('[data-cert-explorer]');
  if (!explorer) return;
  const certs = readJson<ViewerCert[]>('cert-data') ?? [];

  initFilters(explorer);
  initViewer(certs);
}

function initFilters(explorer: HTMLElement): void {
  const cards = Array.from(explorer.querySelectorAll<HTMLElement>('[data-cert-id]'));
  const search = explorer.querySelector<HTMLInputElement>('[data-cert-search]');
  const filterButtons = Array.from(explorer.querySelectorAll<HTMLButtonElement>('[data-cert-filter]'));
  const status = explorer.querySelector<HTMLElement>('[data-cert-status]');
  const empty = explorer.querySelector<HTMLElement>('[data-cert-empty]');
  const clear = explorer.querySelector<HTMLButtonElement>('[data-cert-clear]');

  let category = 'all';

  function update(): void {
    const query = search?.value ?? '';
    let shown = 0;
    for (const card of cards) {
      const visible =
        (category === 'all' || card.dataset.category === category) && matches(card.dataset.search ?? '', query);
      card.hidden = !visible;
      if (visible) shown += 1;
    }
    if (status) status.textContent = t('certs.showing', { shown, total: cards.length });
    if (empty) empty.hidden = shown > 0;
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      category = button.dataset.certFilter ?? 'all';
      filterButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      update();
    });
  });

  search?.addEventListener('input', update);
  search?.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && search.value) {
      // Evita que o Escape feche algo além do campo de busca.
      event.stopPropagation();
      search.value = '';
      update();
    }
  });

  clear?.addEventListener('click', () => {
    category = 'all';
    if (search) search.value = '';
    filterButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.certFilter === 'all')));
    update();
    search?.focus();
  });

  onLangChange(update);
  update();
}

function initViewer(certs: ViewerCert[]): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-cert-viewer]');
  if (!dialog) return;

  const el = {
    file: dialog.querySelector<HTMLElement>('[data-viewer-file]')!,
    title: dialog.querySelector<HTMLElement>('[data-viewer-title]')!,
    issuer: dialog.querySelector<HTMLElement>('[data-viewer-issuer]')!,
    open: dialog.querySelector<HTMLAnchorElement>('[data-viewer-open]')!,
    download: dialog.querySelector<HTMLAnchorElement>('[data-viewer-download]')!,
    verify: dialog.querySelector<HTMLAnchorElement>('[data-viewer-verify]')!,
    loading: dialog.querySelector<HTMLElement>('[data-viewer-loading]')!,
    fallback: dialog.querySelector<HTMLElement>('[data-viewer-fallback]')!,
    error: dialog.querySelector<HTMLElement>('[data-viewer-error]')!,
    frame: dialog.querySelector<HTMLIFrameElement>('[data-viewer-frame]')!,
  };

  let requestId = 0;
  let currentTitle = '';

  function showState(state: 'loading' | 'fallback' | 'error' | 'frame'): void {
    el.loading.hidden = state !== 'loading';
    el.fallback.hidden = state !== 'fallback';
    el.error.hidden = state !== 'error';
    el.frame.hidden = state !== 'frame';
  }

  function setLinks(cert: ViewerCert, enabled: boolean): void {
    for (const a of [el.open, el.download]) {
      if (enabled && cert.href) {
        a.href = cert.href;
        a.hidden = false;
      } else {
        a.removeAttribute('href');
        a.hidden = true;
      }
    }
    if (cert.verifyUrl && /^https:\/\//.test(cert.verifyUrl)) {
      el.verify.href = cert.verifyUrl;
      el.verify.hidden = false;
    } else {
      el.verify.hidden = true;
    }
  }

  /** Confirma que o PDF existe antes de exibi-lo (um registro pode apontar para um arquivo removido). */
  async function fileExists(href: string): Promise<boolean> {
    try {
      const response = await fetch(href, { method: 'HEAD', cache: 'no-store' });
      return response.ok;
    } catch {
      return false;
    }
  }

  async function open(id: string, trigger: HTMLElement | null): Promise<void> {
    const cert = certs.find((c) => c.id === id);
    if (!cert) return;
    const thisRequest = ++requestId;

    currentTitle = cert.title;
    el.file.textContent = cert.file ? `~/certifications/${cert.file}` : '~/certifications';
    el.title.textContent = cert.title;
    el.issuer.textContent = cert.issuer ?? '';
    el.issuer.hidden = !cert.issuer;
    el.frame.title = t('viewer.frameTitle', { title: cert.title });
    showState('loading');
    setLinks(cert, false);
    openDialog(dialog!, trigger);

    if (!cert.available || !cert.href) {
      showState('error');
      return;
    }

    const exists = await fileExists(cert.href);
    if (thisRequest !== requestId || !dialog!.open) return;
    if (!exists) {
      showState('error');
      return;
    }

    setLinks(cert, true);
    // Navegadores sem visualizador de PDF embutido (ex.: Chrome no Android) recebem a alternativa.
    if (navigator.pdfViewerEnabled === false) {
      showState('fallback');
      return;
    }
    el.frame.src = `${cert.href}#view=FitH`;
    showState('frame');
  }

  dialog.addEventListener('close', () => {
    requestId += 1;
    // Libera o PDF da memória ao fechar.
    el.frame.removeAttribute('src');
    showState('loading');
  });

  onLangChange(() => {
    if (currentTitle) el.frame.title = t('viewer.frameTitle', { title: currentTitle });
  });

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const viewButton = target?.closest<HTMLElement>('[data-cert-view]');
    if (viewButton) {
      void open(viewButton.dataset.certView ?? '', viewButton);
      return;
    }
    // Link "certificado relacionado" dentro do modal de um projeto.
    const related = target?.closest<HTMLElement>('[data-open-cert]');
    if (related) {
      const parent = related.closest('dialog');
      const trigger = parent ? closeDialogKeepingTrigger(parent) : related;
      void open(related.dataset.openCert ?? '', trigger);
    }
  });
}
