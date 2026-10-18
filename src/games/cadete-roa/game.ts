import { createRun, jump, move, score, step, STEP, type Run } from './model';
import { Renderer } from './renderer';

const RECORD_KEY = 'cadete-roa:best:v1';
const readRecord = (): number => {
  try { const n = Number(localStorage.getItem(RECORD_KEY)); return Number.isFinite(n) ? Math.max(0,Math.min(1e9,n)) : 0; }
  catch { return 0; }
};

function mount(): void {
  const gameDialog = document.querySelector<HTMLDialogElement>('[data-cadet-game]');
  const gameOpener = document.querySelector<HTMLButtonElement>('[data-game-open]');
  if (!gameDialog || !gameOpener || gameDialog.dataset.mounted) return;
  const dialog: HTMLDialogElement = gameDialog;
  const opener: HTMLButtonElement = gameOpener;
  dialog.dataset.mounted = 'true';
  const q = <T extends HTMLElement = HTMLElement>(selector: string): T => dialog.querySelector<T>(selector)!;
  const canvas = q<HTMLCanvasElement>('canvas');
  const stage = q('.cadet-stage'), overlay = q('[data-game-overlay]');
  const startButton = q<HTMLButtonElement>('[data-game-start]');
  const restartButton = q<HTMLButtonElement>('[data-game-restart]');
  const pauseButton = q<HTMLButtonElement>('[data-game-pause]');
  const controls = q('.cadet-controls'), hud = q('.cadet-hud');
  const announcement = q('[data-game-announcement]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  let run: Run = createRun(), renderer: Renderer | null = null;
  let frame = 0, revealFrame = 0, last = 0, accumulator = 0, hudTime = 0, closeTimer = 0;
  let best = readRecord(), quality: 'auto' | 'eco' = 'auto', degraded = false, slowFrames = 0;
  let sound = false, audio: AudioContext | null = null, ownsFullscreen = false, contextLost = false;
  let pointer: { x: number; y: number; id: number } | null = null;

  function tone(frequency: number, duration = .08): void {
    if (!sound || !audio || audio.state !== 'running') return;
    const oscillator = audio.createOscillator(), gain = audio.createGain();
    oscillator.type = 'triangle'; oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.045,audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+duration);
    oscillator.connect(gain); gain.connect(audio.destination);
    oscillator.start(); oscillator.stop(audio.currentTime+duration);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }
  function stopLoop(): void { cancelAnimationFrame(frame); frame = 0; last = 0; accumulator = 0; }
  function paint(): void { if (renderer && !contextLost) renderer.render(run,reduced.matches); }
  function resize(): void { renderer?.resize(quality === 'eco' || degraded ? .65 : 1); paint(); }
  function updateHUD(): void {
    q('[data-distance]').textContent = String(Math.floor(run.distance)).padStart(4,'0');
    q('[data-tokens]').textContent = String(run.tokens).padStart(2,'0');
    q('[data-best]').textContent = String(best);
  }
  function display(): void {
    const playing = run.phase === 'running';
    stage.dataset.state = run.phase;
    overlay.hidden = playing; controls.hidden = !playing; hud.hidden = !playing; pauseButton.hidden = !playing;
    restartButton.hidden = run.phase !== 'paused';
    q('[data-game-results]').hidden = run.phase !== 'over';
    q('[data-game-tip]').hidden = run.phase === 'over';
    if (run.phase === 'paused') {
      q('#cadet-screen-title').textContent = 'TAKE A BREATHER.';
      q('[data-screen-label]').textContent = 'YOUR RUN IS WAITING';
      q('[data-screen-message]').textContent = 'Ready when you are. Your next step can wait.';
      startButton.textContent = 'BACK TO THE RUN →';
    } else if (run.phase === 'over') {
      q('#cadet-screen-title').textContent = 'ONE MORE RUN?';
      q('[data-screen-label]').textContent = 'EVERY STEP COUNTS';
      const messages = {
        trench: 'Mind the gap. Jump a little earlier or find another lane.',
        grenade: 'Watch the grenades. A jump or a quick lane change will do.',
        container: 'Aim higher. Land on the container or go around it.',
        tank: 'That is a tank. Jump onto it or take the open lane.',
      };
      q('[data-screen-message]').textContent = messages[run.reason ?? 'trench'];
      startButton.textContent = 'RUN AGAIN →';
      q('[data-result-distance]').textContent = `${Math.floor(run.distance)} m`;
      q('[data-result-score]').textContent = String(score(run));
    }
    updateHUD();
  }
  function endRun(): void {
    stopLoop(); tone(100,.18);
    if (score(run) > best) {
      best = score(run);
      try { localStorage.setItem(RECORD_KEY,String(best)); } catch { /* A blocked store never blocks play. */ }
    }
    display(); paint();
    announcement.textContent = `Run ended. ${Math.floor(run.distance)} metres. Score ${score(run)}.`;
    startButton.focus({ preventScroll:true });
  }
  function tick(now: number): void {
    frame = 0;
    if (run.phase !== 'running' || !dialog.open || contextLost) return;
    const interval = quality === 'eco' || degraded || renderer?.backend === 'canvas' ? 1000/30 : 1000/60;
    if (!last) last = now - interval;
    const elapsed = now-last;
    if (elapsed >= interval - .8) {
      const dt = Math.min(elapsed/1000,.1); last = now;
      if (quality === 'auto' && !degraded) {
        slowFrames = elapsed > 28 ? slowFrames+1 : Math.max(0,slowFrames-1);
        if (slowFrames > 45) { degraded = true; resize(); }
      }
      accumulator += dt;
      const tokens = run.tokens;
      while (accumulator >= STEP && run.phase === 'running') { step(run); accumulator -= STEP; }
      if (run.tokens > tokens) tone(760,.1);
      if (run.reason !== null) { endRun(); return; }
      hudTime += dt;
      if (hudTime > .1) { updateHUD(); hudTime = 0; }
      paint();
    }
    frame = requestAnimationFrame(tick);
  }
  function pause(): void {
    if (run.phase !== 'running') return;
    run.phase = 'paused'; stopLoop(); display();
    void audio?.suspend().catch(() => {});
    announcement.textContent = 'Game paused.';
    if (dialog.open && !document.hidden) startButton.focus({ preventScroll:true });
  }
  function start(fresh = false): void {
    if (!dialog.open || contextLost || !renderer || run.phase === 'running') return;
    if (fresh || run.phase !== 'paused') run = createRun();
    run.phase = 'running'; stopLoop(); display();
    void audio?.resume().catch(() => {});
    tone(420); canvas.focus({ preventScroll:true });
    announcement.textContent = 'Run started. Left and right to move, up or space to jump. P to pause.';
    // On devices supporting it, the play gesture also hides browser chrome.
    if (matchMedia('(max-width: 640px), (pointer: coarse)').matches && !document.fullscreenElement && document.documentElement.requestFullscreen) {
      void document.documentElement.requestFullscreen().then(() => { ownsFullscreen = true; }).catch(() => {});
    }
    frame = requestAnimationFrame(tick);
  }
  function open(): void {
    clearTimeout(closeTimer); dialog.classList.remove('is-closing');
    if (dialog.open) return;
    if (typeof dialog.showModal !== 'function') {
      opener.textContent = 'Este navegador necesita una versión más reciente para abrir el juego.';
      return;
    }
    dialog.showModal(); document.documentElement.classList.add('cadet-open');
    try {
      if (!renderer) renderer = new Renderer(canvas);
      canvas.dataset.renderer = renderer.backend;
      resize(); display();
    } catch (error) {
      q('[data-screen-message]').textContent = error instanceof Error ? error.message : 'Graphics could not start. Please reload.';
      startButton.disabled = true;
    }
    startButton.focus({ preventScroll:true });
  }
  function close(immediate = false): void {
    pause(); stopLoop();
    if (!dialog.open) return;
    const finish = async () => {
      // Finish leaving fullscreen before exposing links that can navigate away.
      if (ownsFullscreen && document.fullscreenElement) {
        ownsFullscreen = false;
        try { await document.exitFullscreen(); } catch { /* Navigation may already have left fullscreen. */ }
      }
      if (dialog.open) dialog.close();
      dialog.classList.remove('is-closing');
    };
    if (immediate || reduced.matches) void finish();
    else { dialog.classList.add('is-closing'); clearTimeout(closeTimer); closeTimer = window.setTimeout(() => { void finish(); },170); }
  }
  function leap(): void { if (run.phase === 'running' && (run.player.grounded || run.player.coyote > 0)) tone(310,.06); jump(run); }
  const on = { signal: events.signal };
  opener.hidden = false; opener.addEventListener('click',open,on);
  q('[data-game-close]').addEventListener('click',() => close(),on);
  pauseButton.addEventListener('click',pause,on);
  startButton.addEventListener('click',() => start(),on);
  restartButton.addEventListener('click',() => start(true),on);
  q('[data-game-left]').addEventListener('click',() => move(run,-1),on);
  q('[data-game-right]').addEventListener('click',() => move(run,1),on);
  q('[data-game-jump]').addEventListener('click',leap,on);
  dialog.addEventListener('cancel',event => { event.preventDefault(); if (run.phase === 'running') pause(); else close(); },on);
  dialog.addEventListener('close',() => {
    stopLoop(); document.documentElement.classList.remove('cadet-open');
    void audio?.suspend().catch(() => {});
    if (ownsFullscreen && document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    ownsFullscreen = false; opener.focus({ preventScroll:true });
  },on);
  dialog.addEventListener('keydown',event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
    if (run.phase !== 'running') return;
    switch (event.code) {
      case 'ArrowLeft': case 'KeyA': event.preventDefault(); move(run,-1); break;
      case 'ArrowRight': case 'KeyD': event.preventDefault(); move(run,1); break;
      case 'Space': case 'ArrowUp': case 'KeyW': event.preventDefault(); leap(); break;
      case 'KeyP': event.preventDefault(); pause(); break;
    }
  },on);
  canvas.addEventListener('pointerdown',event => {
    if (run.phase !== 'running' || !event.isPrimary) return;
    pointer = { x:event.clientX, y:event.clientY, id:event.pointerId };
    canvas.setPointerCapture(event.pointerId);
  },on);
  canvas.addEventListener('pointerup',event => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX-pointer.x, dy = event.clientY-pointer.y; pointer = null;
    if (Math.abs(dy) > Math.abs(dx) && dy < -22) leap();
    else if (Math.abs(dx) > 22) move(run,dx < 0 ? -1 : 1);
    else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) leap();
  },on);
  canvas.addEventListener('pointercancel',() => { pointer = null; },on);
  q('[data-game-sound]').addEventListener('click',async event => {
    const button = event.currentTarget as HTMLButtonElement;
    sound = !sound;
    if (sound) {
      try { audio ??= new AudioContext(); await audio.resume(); tone(550); }
      catch { sound = false; }
    } else void audio?.suspend().catch(() => {});
    button.textContent = sound ? 'SOUND ON' : 'SOUND OFF'; button.setAttribute('aria-pressed',String(sound));
  },on);
  q('[data-game-quality]').addEventListener('click',event => {
    quality = quality === 'auto' ? 'eco' : 'auto'; degraded = false; slowFrames = 0;
    (event.currentTarget as HTMLElement).textContent = quality === 'auto' ? 'QUALITY AUTO' : 'QUALITY ECO'; resize();
  },on);
  document.addEventListener('visibilitychange',() => { if (document.hidden) pause(); },on);
  window.addEventListener('blur',pause,on);
  document.addEventListener('fullscreenchange',() => { if (!document.fullscreenElement && ownsFullscreen) { ownsFullscreen = false; pause(); } resize(); },on);
  canvas.addEventListener('webglcontextlost',event => {
    event.preventDefault(); contextLost = true; pause();
    q('[data-screen-message]').textContent = 'Graphics paused. Waiting for your device to restore them.';
    startButton.disabled = true;
  },on);
  canvas.addEventListener('webglcontextrestored',() => {
    try {
      renderer?.dispose(); renderer = new Renderer(canvas); contextLost = false;
      resize(); startButton.disabled = false;
      q('[data-screen-message]').textContent = 'Graphics restored. Ready when you are.';
    } catch { q('[data-screen-message]').textContent = 'Please reload this page to restore the game.'; }
  },on);
  const observer = new ResizeObserver(resize); observer.observe(canvas);
  window.addEventListener('pagehide',() => {
    cancelAnimationFrame(revealFrame); clearTimeout(closeTimer); close(true); observer.disconnect(); renderer?.dispose(); renderer = null;
    void audio?.close().catch(() => {}); events.abort(); delete dialog.dataset.mounted;
  }, { once:true });
  updateHUD();
  // Let the native page transition finish before promoting the game to the top layer.
  revealFrame = requestAnimationFrame(() => {
    revealFrame = requestAnimationFrame(() => {
      const transition = (document as Document & { activeViewTransition?: ViewTransition | null }).activeViewTransition;
      const reveal = () => { if (!events.signal.aborted) open(); };
      if (transition) {
        void transition.ready.catch(() => {});
        void transition.finished.then(reveal,reveal);
      } else reveal();
    });
  });
}

mount();
window.addEventListener('pageshow',event => { if (event.persisted) mount(); });
