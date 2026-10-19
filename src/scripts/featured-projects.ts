import { shuffledProjects } from '../utils/project-rotation';

const root = document.querySelector<HTMLElement>('[data-featured-projects]');
if (root) {
  const host = root.querySelector<HTMLElement>('[data-featured-host]')!;
  const controls = root.querySelector<HTMLElement>('[data-featured-controls]')!;
  const toggle = root.querySelector<HTMLButtonElement>('[data-featured-toggle]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-featured-next]')!;
  const pauseLabel = root.querySelector<HTMLElement>('[data-rotation-pause]')!;
  const playLabel = root.querySelector<HTMLElement>('[data-rotation-play]')!;
  const count = root.querySelector<HTMLElement>('[data-featured-count]')!;
  const announcement = root.querySelector<HTMLElement>('[data-featured-announcement]')!;
  const templates = new Map([...root.querySelectorAll<HTMLTemplateElement>('[data-featured-template]')].map(template => [template.dataset.featuredTemplate!, template]));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = host.querySelector<HTMLElement>('[data-featured-slide]')!.dataset.featuredSlide!;
  let queue = shuffledProjects([...templates.keys()], current);
  let position = 1;
  let paused = motion.matches;
  let visible = false;
  let hovered = false;
  let focused = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;
  const events = new AbortController();
  const on = { signal: events.signal };

  function sync() {
    clearTimeout(timer);
    timer = undefined;
    toggle.dataset.paused = String(paused);
    pauseLabel.hidden = paused;
    playLabel.hidden = !paused;
    // A full three seconds of reading time after every interruption.
    if (!disposed && !paused && !document.hidden && visible && !hovered && !focused && templates.size > 1) {
      timer = setTimeout(() => { advance(false); sync(); }, 3000);
    }
    root!.dataset.rotationState = paused ? 'paused' : timer ? 'playing' : 'suspended';
  }
  function advance(manual: boolean) {
    if (!queue.length) queue = shuffledProjects([...templates.keys()], current);
    const id = queue.shift();
    const template = id && templates.get(id);
    if (!template) return;
    current = id!;
    host.replaceChildren(template.content.cloneNode(true));
    position = position % templates.size + 1;
    count.textContent = String(position).padStart(2, '0');
    // Do not announce unsolicited changes every three seconds.
    if (manual) announcement.textContent = host.querySelector('h3')!.textContent;
    host.classList.remove('is-changing');
    if (!motion.matches) requestAnimationFrame(() => { if (!disposed) host.classList.add('is-changing'); });
  }

  toggle.addEventListener('click', () => { paused = !paused; sync(); }, on);
  next.addEventListener('click', () => { advance(true); sync(); }, on);
  root.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovered = true; sync(); } }, on);
  root.addEventListener('pointerleave', () => { hovered = false; sync(); }, on);
  root.addEventListener('focusin', () => { focused = true; sync(); }, on);
  root.addEventListener('focusout', () => queueMicrotask(() => { focused = root.contains(document.activeElement); sync(); }), on);
  document.addEventListener('visibilitychange', sync, on);
  motion.addEventListener('change', () => { if (motion.matches) paused = true; sync(); }, on);
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { threshold: .15 });
  observer.observe(root);
  window.addEventListener('pagehide', event => {
    clearTimeout(timer);
    if (!event.persisted) { disposed = true; events.abort(); observer.disconnect(); }
  }, on);
  window.addEventListener('pageshow', sync, on);
  controls.hidden = false;
  sync();
}
