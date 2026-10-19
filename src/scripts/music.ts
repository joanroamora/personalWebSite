import { musicPosition, musicSessionKey, musicVolumeKey, nextMusicTrack, readMusicState } from '../utils/music-state';

const widget = document.querySelector<HTMLElement>('[data-music-widget]');
if (widget) {
  const disclosure = widget.querySelector<HTMLDetailsElement>('[data-music-disclosure]')!;
  const trigger = disclosure.querySelector('summary')!;
  const audio = widget.querySelector<HTMLAudioElement>('[data-music-audio]')!;
  const select = widget.querySelector<HTMLSelectElement>('[data-music-select]')!;
  const volume = widget.querySelector<HTMLInputElement>('[data-music-volume]')!;
  const output = widget.querySelector<HTMLOutputElement>('[data-music-volume-output]')!;
  const play = widget.querySelector<HTMLButtonElement>('[data-music-play]')!;
  const playLabel = widget.querySelector<HTMLElement>('[data-music-play-label]')!;
  const pauseLabel = widget.querySelector<HTMLElement>('[data-music-pause-label]')!;
  const title = widget.querySelector<HTMLElement>('[data-music-title]')!;
  const artist = widget.querySelector<HTMLElement>('[data-music-artist]')!;
  const options = [...select.options];
  const ids = options.map(option => option.value);
  let raw:string | null = null, savedVolume:string | null = null;
  try { raw = sessionStorage.getItem(musicSessionKey); } catch { /* Private browsing is supported. */ }
  try { savedVolume = localStorage.getItem(musicVolumeKey); } catch { /* Optional preference. */ }
  const state = readMusicState(raw, ids, savedVolume);
  const events = new AbortController();
  const on = { signal:events.signal };
  let loaded = '';
  let restoreTime = state.time;
  let attempt = 0;
  let disposed = false;
  let suspended = false;
  let needsGesture = false;
  let lastSaved = 0;

  function status(name:string) {
    widget!.dataset.musicState = name;
    widget!.querySelectorAll<HTMLElement>('[data-music-message]').forEach(message => { message.hidden = message.dataset.musicMessage !== name; });
    // Keep the visible action as its accessible name.
    playLabel.hidden = state.enabled && !needsGesture;
    pauseLabel.hidden = !state.enabled || needsGesture;
    play.disabled = suspended;
  }
  function save() {
    if (loaded && audio.readyState > 0) state.time = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    try { sessionStorage.setItem(musicSessionKey, JSON.stringify(state)); } catch { /* Playback still works. */ }
  }
  function showTrack() {
    select.value = state.track;
    const option = options.find(option => option.value === state.track)!;
    title.textContent = option.textContent;
    artist.textContent = option.dataset.musicArtistName ?? '';
    volume.value = String(Math.round(state.volume * 100));
    output.value = `${volume.value}%`;
    audio.volume = state.volume;
  }
  function prepare() {
    if (loaded === state.track) return;
    const option = options.find(option => option.value === state.track)!;
    loaded = state.track;
    audio.src = option.dataset.musicSource!;
    // No source is attached and no media request occurs before opt-in.
    audio.load();
  }
  async function start() {
    if (disposed || !state.enabled || document.hidden || suspended) return;
    const token = ++attempt;
    needsGesture = false;
    status('loading');
    prepare();
    try {
      await audio.play();
      if (disposed || token !== attempt || !state.enabled || document.hidden || suspended) {
        if (disposed || !state.enabled || document.hidden || suspended) audio.pause();
        return;
      }
      status('playing');
      save();
    } catch (error) {
      if (disposed || token !== attempt) return;
      needsGesture = error instanceof DOMException && error.name === 'NotAllowedError';
      // An autoplay policy is not the user changing their preference to off.
      if (!needsGesture) state.enabled = false;
      status(needsGesture ? 'blocked' : 'error');
      save();
    }
  }
  function stop() {
    ++attempt;
    audio.pause();
    save();
    status(suspended && state.enabled ? 'suspended' : 'paused');
  }
  function choose(id:string) {
    ++attempt;
    audio.pause();
    state.track = id;
    state.time = restoreTime = 0;
    // The next track is loaded only if music has been enabled.
    loaded = '';
    audio.removeAttribute('src');
    audio.load();
    showTrack();
    save();
    if (state.enabled) void start();
  }
  function close(restoreFocus = false) { disclosure.open = false; if (restoreFocus) trigger.focus(); }
  function resumeFromSession() {
    // A bfcache document may contain an older opt-in than the page just left.
    try {
      const saved = sessionStorage.getItem(musicSessionKey);
      if (saved) Object.assign(state, readMusicState(saved, ids));
    } catch { /* Keep the in-memory choice if storage is unavailable. */ }
    ++attempt;
    audio.pause();
    restoreTime = state.time;
    if (loaded === state.track && audio.readyState > 0) {
      audio.currentTime = musicPosition(restoreTime, audio.duration);
      restoreTime = 0;
    }
    showTrack();
    status(state.enabled && suspended ? 'suspended' : 'paused');
    if (state.enabled) void start();
  }
  function gameState() {
    const next = Boolean(document.querySelector('dialog[data-arcade][open],dialog[data-cadet-game][open]'));
    if (suspended === next) return;
    suspended = next;
    if (suspended) { close(); stop(); } else {
      play.disabled = false;
      if (state.enabled) void start(); else status('paused');
    }
  }

  play.addEventListener('click', () => {
    state.enabled = needsGesture || !state.enabled;
    needsGesture = false;
    if (state.enabled) { save(); void start(); } else stop();
  }, on);
  widget.querySelector('[data-music-next]')!.addEventListener('click', () => choose(nextMusicTrack(ids, state.track)), on);
  select.addEventListener('change', () => choose(select.value), on);
  volume.addEventListener('input', () => {
    state.volume = Number(volume.value) / 100;
    audio.volume = state.volume;
    output.value = `${volume.value}%`;
    try { localStorage.setItem(musicVolumeKey, String(state.volume)); } catch { /* Optional. */ }
    save();
  }, on);
  audio.addEventListener('loadedmetadata', () => {
    if (restoreTime) { audio.currentTime = musicPosition(restoreTime, audio.duration); restoreTime = 0; }
  }, on);
  audio.addEventListener('ended', () => choose(nextMusicTrack(ids, state.track)), on);
  audio.addEventListener('error', () => {
    if (!loaded || disposed) return;
    ++attempt;
    state.enabled = false;
    audio.pause();
    status('error');
    save();
  }, on);
  audio.addEventListener('timeupdate', () => {
    if (Date.now() - lastSaved > 2000) { lastSaved = Date.now(); save(); }
  }, on);
  widget.querySelector('[data-music-close]')!.addEventListener('click', () => close(true), on);
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && disclosure.open) { event.preventDefault(); close(true); } }, on);
  document.addEventListener('pointerdown', event => { if (event.target instanceof Node && !widget.contains(event.target)) close(); }, on);
  disclosure.addEventListener('toggle', () => {
    if (disclosure.open) document.querySelectorAll<HTMLDetailsElement>('[data-language-switcher],[data-navigation-disclosure]').forEach(menu => { menu.open = false; });
  }, on);
  document.querySelectorAll<HTMLDetailsElement>('[data-language-switcher],[data-navigation-disclosure]').forEach(menu => menu.addEventListener('toggle', () => { if (menu.open) close(); }, on));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else resumeFromSession();
  }, on);
  // Observe only the game windows, not every frame or unrelated DOM mutation.
  const games = [...document.querySelectorAll('dialog[data-arcade],dialog[data-cadet-game]')];
  const observer = new MutationObserver(gameState);
  games.forEach(game => observer.observe(game, { attributes:true, attributeFilter:['open'] }));
  window.addEventListener('pagehide', event => {
    save();
    ++attempt;
    audio.pause();
    close();
    if (!event.persisted) { disposed = true; events.abort(); observer.disconnect(); audio.removeAttribute('src'); audio.load(); }
  }, on);
  window.addEventListener('pageshow', event => { if (event.persisted) resumeFromSession(); }, on);

  showTrack();
  status('off');
  gameState();
  widget.hidden = false;
  // Only an opt-in from this tab may resume across ordinary document navigation.
  if (state.enabled) void start();
}
