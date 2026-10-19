const browser = document.querySelector<HTMLElement>('[data-project-browser]');
const dialog = document.querySelector<HTMLDialogElement>('#project-dialog');
const host = dialog?.querySelector<HTMLElement>('[data-project-detail-host]');

if (browser) {
  const controls = browser.querySelector<HTMLElement>('[data-project-controls]');
  const search = browser.querySelector<HTMLInputElement>('[data-project-search]');
  const filters = Array.from(browser.querySelectorAll<HTMLButtonElement>('[data-project-filter]'));
  const items = Array.from(browser.querySelectorAll<HTMLElement>('[data-project-item]'));
  const count = browser.querySelector<HTMLElement>('[data-project-count]');
  const empty = browser.querySelector<HTMLElement>('[data-project-empty]');
  const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const searchable = new Map(items.map(item => [item, normalize(item.dataset.search ?? '')]));
  let group = 'all';

  const filter = () => {
    const words = normalize(search?.value.trim() ?? '').split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const item of items) {
      const matches = (group === 'all' || item.dataset.group === group) && words.every(word => searchable.get(item)?.includes(word));
      item.hidden = !matches;
      if (matches) visible++;
    }
    if (count) count.textContent = `${visible} ${visible === 1 ? (count.dataset.countSingular ?? 'proyecto') : (count.dataset.countPlural ?? 'proyectos')}${visible === items.length ? (count.dataset.countSuffix ?? ' / Un archivo en movimiento') : `${count.dataset.countOf ?? ' de '}${items.length}`}`;
    if (empty) empty.hidden = visible > 0;
  };

  if (controls) controls.hidden = false;
  search?.addEventListener('input', filter);
  filters.forEach(button => button.addEventListener('click', () => {
    group = button.dataset.projectFilter ?? 'all';
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    filter();
  }));
  browser.querySelector('[data-project-reset]')?.addEventListener('click', () => {
    group = 'all';
    if (search) search.value = '';
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.projectFilter === 'all')));
    filter();
    search?.focus();
  });

  if (dialog && host && typeof dialog.showModal === 'function') {
    let opener: HTMLAnchorElement | null = null;
    let closeTimer: ReturnType<typeof setTimeout> | undefined;
    const close = () => {
      if (!dialog.open || dialog.classList.contains('is-closing')) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { dialog.close(); return; }
      dialog.classList.add('is-closing');
      closeTimer = setTimeout(() => dialog.close(), 170);
    };

    browser.querySelectorAll<HTMLAnchorElement>('[data-project-open]').forEach(link => link.setAttribute('aria-haspopup', 'dialog'));
    browser.addEventListener('click', event => {
      if (!(event instanceof MouseEvent) || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-project-open]') : null;
      if (!link) return;
      const template = document.getElementById(`project-template-${link.dataset.projectOpen}`);
      if (!(template instanceof HTMLTemplateElement)) return;
      event.preventDefault();
      if (dialog.open) return;
      opener = link;
      host.replaceChildren(template.content.cloneNode(true));
      dialog.setAttribute('aria-labelledby', `${link.dataset.projectOpen}-detail-title`);
      dialog.classList.remove('is-closing');
      document.documentElement.classList.add('project-dialog-open');
      dialog.showModal();
      dialog.scrollTop = 0;
    });

    dialog.querySelector('[data-project-close]')?.addEventListener('click', close);
    dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
    let backdropPointer = false;
    const isOutside = (event: PointerEvent | MouseEvent) => {
      const bounds = dialog.getBoundingClientRect();
      return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    };
    dialog.addEventListener('pointerdown', event => { backdropPointer = event.target === dialog && isOutside(event); });
    dialog.addEventListener('click', event => { if (backdropPointer && event.target === dialog && isOutside(event)) close(); backdropPointer = false; });
    dialog.addEventListener('close', () => {
      clearTimeout(closeTimer);
      dialog.classList.remove('is-closing');
      document.documentElement.classList.remove('project-dialog-open');
      host.replaceChildren();
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    });
    window.addEventListener('pagehide', () => { clearTimeout(closeTimer); if (dialog.open) dialog.close(); });
  }
}
