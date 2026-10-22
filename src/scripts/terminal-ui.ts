import {
  complete,
  execute,
  isSafeHref,
  type Block,
  type CommandResult,
  type TerminalAction,
  type TerminalData,
} from '../lib/terminal';
import { openDialog } from './dialogs';
import { readJson, scrollToSection } from './dom';
import { onLangChange, setLang, t } from './i18n';

const SECTION_IDS = {
  projects: 'projetos',
  skills: 'competencias',
  certificates: 'certificados',
  contact: 'contato',
  about: 'sobre',
} as const;

const MAX_HISTORY = 50;

export function initTerminal(): void {
  const root = document.querySelector<HTMLElement>('[data-terminal]');
  const data = readJson<TerminalData>('terminal-data');
  if (!root || !data) return;

  const output = root.querySelector<HTMLElement>('[data-term-output]')!;
  const form = root.querySelector<HTMLFormElement>('[data-term-form]')!;
  const input = root.querySelector<HTMLInputElement>('[data-term-input]')!;
  const prompt = root.querySelector('.term-prompt [aria-hidden]')?.textContent ?? '$';
  const projectIds = data.projects.map((p) => p.id);

  /** Comandos executados desde o último `clear`: permite re-renderizar ao trocar de idioma. */
  let session: string[] = [];
  const history: string[] = [];
  let historyIndex = -1;

  const ctx = () => ({ t, data });

  function runAction(action: TerminalAction): void {
    if (action.type === 'scroll') scrollToSection(SECTION_IDS[action.target]);
    else if (action.type === 'setLang') setLang(action.lang);
    else if (action.type === 'openProject') {
      const dialog = document.getElementById(`project-${action.id}`);
      if (dialog instanceof HTMLDialogElement) openDialog(dialog, input);
    }
  }

  function line(text: string, className = 'term-line'): HTMLParagraphElement {
    const p = document.createElement('p');
    p.className = className;
    p.textContent = text;
    return p;
  }

  function renderBlock(block: Block): HTMLElement {
    switch (block.kind) {
      case 'text':
        return line(block.text, `term-line${block.tone ? ` tone-${block.tone}` : ''}`);
      case 'rows': {
        const dl = document.createElement('dl');
        dl.className = 'term-rows';
        for (const row of block.rows) {
          const dt = document.createElement('dt');
          dt.textContent = row.key;
          const dd = document.createElement('dd');
          dd.textContent = row.value;
          dl.append(dt, dd);
        }
        return dl;
      }
      case 'links': {
        const ul = document.createElement('ul');
        ul.className = 'term-links';
        for (const link of block.links) {
          if (!isSafeHref(link.href)) continue;
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = link.href;
          a.textContent = link.label;
          if (/^https:/i.test(link.href) || link.href.endsWith('.pdf')) {
            a.target = '_blank';
            a.rel = 'noopener';
          }
          li.append(a);
          ul.append(li);
        }
        return ul;
      }
      case 'actions': {
        const div = document.createElement('div');
        div.className = 'term-actions';
        for (const item of block.actions) {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'chip chip-btn';
          button.textContent = `→ ${item.label}`;
          button.addEventListener('click', () => runAction(item.action));
          div.append(button);
        }
        return div;
      }
    }
  }

  function renderEntry(command: string, result: CommandResult): void {
    const entry = document.createElement('div');
    entry.className = 'term-entry';
    const echo = document.createElement('p');
    echo.className = 'term-line term-echo';
    const promptSpan = document.createElement('span');
    promptSpan.className = 'term-echo-prompt';
    promptSpan.textContent = `${prompt} `;
    echo.append(promptSpan, document.createTextNode(command));
    entry.append(echo, ...result.blocks.map(renderBlock));
    output.append(entry);
  }

  function renderWelcome(): void {
    output.replaceChildren(line(t('terminal.welcome')), line(t('terminal.hint'), 'term-line tone-muted'));
  }

  function scrollOutput(): void {
    output.scrollTop = output.scrollHeight;
  }

  function run(raw: string): void {
    const command = raw.trim();
    if (!command) return;
    if (history[history.length - 1] !== command) history.push(command);
    if (history.length > MAX_HISTORY) history.shift();
    historyIndex = -1;

    const result = execute(command, ctx());
    if (result.clear) {
      session = [];
      renderWelcome();
      return;
    }
    session.push(command);
    renderEntry(command, result);
    scrollOutput();
    if (result.effect) runAction(result.effect);
  }

  // Ao trocar de idioma, re-renderiza a sessão inteira no novo idioma, sem repetir efeitos.
  onLangChange(() => {
    renderWelcome();
    for (const command of session) renderEntry(command, execute(command, ctx()));
    scrollOutput();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    run(input.value);
    input.value = '';
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      if (history.length === 0) return;
      event.preventDefault();
      if (event.key === 'ArrowUp') {
        historyIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      } else if (historyIndex !== -1) {
        historyIndex = historyIndex + 1 >= history.length ? -1 : historyIndex + 1;
      }
      input.value = historyIndex === -1 ? '' : history[historyIndex];
      input.setSelectionRange(input.value.length, input.value.length);
    } else if (event.key === 'Tab' && input.value.trim()) {
      const options = complete(input.value, projectIds);
      if (options.length === 0) return;
      event.preventDefault();
      if (options.length === 1) {
        input.value = options[0];
      } else {
        // Lista as opções sem registrá-las na sessão (não é um comando executado).
        renderEntry(input.value, { blocks: [{ kind: 'text', text: options.join('   '), tone: 'muted' }] });
        scrollOutput();
      }
    } else if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault();
      run('clear');
    }
  });

  root.querySelectorAll<HTMLButtonElement>('[data-term-suggest]').forEach((button) => {
    button.addEventListener('click', () => {
      run(button.dataset.termSuggest ?? '');
      input.focus({ preventScroll: true });
    });
  });

  // Clicar na área de saída (fora de links/botões) foca o campo de entrada.
  output.addEventListener('click', (event) => {
    const target = event.target as Element;
    if (!target.closest('a, button') && !window.getSelection()?.toString()) input.focus({ preventScroll: true });
  });
}
