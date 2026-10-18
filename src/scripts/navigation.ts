// El desplegable funciona con HTML nativo. Este módulo mejora su cierre y el foco.
const menu = document.querySelector<HTMLDetailsElement>('[data-navigation-disclosure]');
const trigger = menu?.querySelector('summary');

if (menu && trigger) {
  const closeMenu = (restoreFocus = false) => {
    menu.open = false;
    if (restoreFocus) trigger.focus();
  };

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      event.preventDefault();
      closeMenu(true);
    }
  });

  document.addEventListener('pointerdown', event => {
    if (event.target instanceof Node && !menu.contains(event.target)) closeMenu();
  });

  menu.addEventListener('focusout', event => {
    if (event.relatedTarget instanceof Node && !menu.contains(event.relatedTarget)) closeMenu();
  });

  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));

  // Al volver mediante el historial, el menú no tapa el contenido restaurado.
  window.addEventListener('pageshow', () => closeMenu(menu.contains(document.activeElement)));
  window.addEventListener('pagehide', () => closeMenu());

  window.matchMedia('(min-width: 70rem)').addEventListener('change', event => {
    if (!event.matches) return;
    const hadFocus = menu.contains(document.activeElement);
    closeMenu();
    if (hadFocus) document.querySelector<HTMLElement>('#desktop-navigation [aria-current="page"], .brand')?.focus();
  });
}
