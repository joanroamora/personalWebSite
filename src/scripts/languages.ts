export {};
const switcher = document.querySelector<HTMLDetailsElement>('[data-language-switcher]');
const trigger = switcher?.querySelector('summary');
const menu = document.querySelector<HTMLDetailsElement>('[data-navigation-disclosure]');
const preferenceKey = 'orbital-language';

if (switcher && trigger) {
  const close = (restoreFocus = false) => { switcher.open = false; if (restoreFocus) trigger.focus(); };
  switcher.addEventListener('toggle', () => { if (switcher.open && menu) menu.open = false; });
  menu?.addEventListener('toggle', () => { if (menu.open) close(); });
  document.addEventListener('pointerdown', event => { if (event.target instanceof Node && !switcher.contains(event.target)) close(); });
  document.addEventListener('keydown', event => {
    if (!switcher.open) return;
    if (event.key === 'Escape') { event.preventDefault(); close(true); }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const links = [...switcher.querySelectorAll<HTMLAnchorElement>('a[data-language]')];
    const index = links.findIndex(link => link === document.activeElement);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? links.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
    event.preventDefault(); links[next]?.focus();
  });
  switcher.addEventListener('focusout', event => { if (event.relatedTarget instanceof Node && !switcher.contains(event.relatedTarget)) close(); });
  switcher.querySelectorAll<HTMLAnchorElement>('a[data-language]').forEach(link => {
    // Conserva anclas y query strings solo al cambiar de idioma, no al navegar a otra sección.
    const target = new URL(link.href);
    target.search = location.search; target.hash = location.hash; link.href = target.href;
    link.addEventListener('click', () => {
      try { localStorage.setItem(preferenceKey, link.dataset.language ?? 'es'); } catch { /* El almacenamiento no es requisito para navegar. */ }
      close();
    });
  });
  // Una URL explícita manda sobre la preferencia. Al entrar en Inicio sin idioma se recupera la elección.
  const home = document.querySelector<HTMLAnchorElement>('.brand');
  if (home && location.pathname === home.pathname && document.documentElement.lang === 'es') {
    try {
      const saved = localStorage.getItem(preferenceKey);
      const option = [...switcher.querySelectorAll<HTMLAnchorElement>('a[data-language]')].find(link => link.dataset.language === saved);
      if (saved && saved !== 'es' && option) location.replace(option.href);
    } catch { /* Sin cookies ni redirección si localStorage no está disponible. */ }
  }
  window.addEventListener('pagehide', () => close());
  window.addEventListener('pageshow', () => close());
}
