/**
 * Modais com <dialog> nativo: showModal() já torna o resto da página inerte,
 * prende o foco e fecha com Escape. Aqui somamos: fechar pelo fundo e
 * devolver o foco a quem abriu. A rolagem da página é travada no CSS
 * (`:root:has(dialog[open])`).
 */

const returnFocus = new WeakMap<HTMLDialogElement, HTMLElement>();

export function openDialog(dialog: HTMLDialogElement, trigger?: HTMLElement | null): void {
  if (dialog.open) return;
  const origin = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
  if (origin) returnFocus.set(dialog, origin);
  dialog.showModal();
  dialog.querySelector<HTMLElement>('.dialog-body, .viewer-body')?.scrollTo?.({ top: 0 });
}

/** Fecha o diálogo sem devolver o foco (usado ao trocar de um modal para outro). */
export function closeDialogKeepingTrigger(dialog: HTMLDialogElement): HTMLElement | null {
  const trigger = returnFocus.get(dialog) ?? null;
  returnFocus.delete(dialog);
  dialog.close();
  return trigger;
}

function setup(dialog: HTMLDialogElement): void {
  let pressedOnBackdrop = false;

  dialog.addEventListener('pointerdown', (event) => {
    pressedOnBackdrop = event.target === dialog;
  });

  // O painel ocupa todo o <dialog>; um clique com alvo no próprio <dialog> veio do fundo.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog && pressedOnBackdrop) dialog.close();
    pressedOnBackdrop = false;
  });

  dialog.addEventListener('close', () => {
    const trigger = returnFocus.get(dialog);
    returnFocus.delete(dialog);
    if (trigger?.isConnected) trigger.focus();
  });
}

export function initDialogs(): void {
  document.querySelectorAll<HTMLDialogElement>('dialog[data-dialog]').forEach(setup);

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const opener = target.closest<HTMLElement>('[data-open-dialog]');
    if (opener) {
      const dialog = document.getElementById(opener.dataset.openDialog ?? '');
      if (dialog instanceof HTMLDialogElement) openDialog(dialog, opener);
      return;
    }

    const closer = target.closest<HTMLElement>('[data-close-dialog]');
    if (closer) closer.closest('dialog')?.close();
  });
}
