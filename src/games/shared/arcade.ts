export const WIDTH = 360, HEIGHT = 480;
export interface Input { x: number; y: number; fire: boolean; slow: boolean; touch: boolean }
export type Action = string;
export interface ArcadeGame {
  reset(): void;
  update(dt: number, input: Input): void;
  action(action: Action): void;
  draw(context: CanvasRenderingContext2D, reduced: boolean): void;
  hud(root: HTMLDialogElement): string;
  result(): { score: number; title: string; message: string; next?:string } | null;
  next?(): void;
  camera?(value: number): void;
  control?(name: string, value: number): void;
}
export type Beep = (frequency: number, duration?: number, type?: OscillatorType) => void;
type Phase = 'ready' | 'tutorial' | 'running' | 'paused' | 'over' | 'help';

/** A document-scoped session: no game loop, input listener or audio survives pagehide. */
export function mountArcade(id: string, factory: (beep: Beep) => ArcadeGame): void {
  const root = document.querySelector<HTMLDialogElement>(`[data-arcade="${id}"]`);
  const launch = document.querySelector<HTMLButtonElement>(`[data-arcade-open="${id}"]`);
  if (!root || !launch || root.dataset.mounted) return;
  const dialog = root, opener = launch;
  dialog.dataset.mounted = 'true';
  const q = <T extends HTMLElement = HTMLElement>(selector: string) => dialog.querySelector<T>(selector)!;
  const canvas = q<HTMLCanvasElement>('canvas'), stage = q('.arcade-stage');
  const context = canvas.getContext('2d', { alpha:false });
  const focusField=()=>{(canvas.hidden?q('.arcade-playfield'):canvas).focus({preventScroll:true});};
  const startButton = q<HTMLButtonElement>('[data-arcade-start]');
  const title = q('.arcade-title'), label = q('[data-screen-label]'), message = q('[data-screen-message]');
  const original = { title:title.textContent!, label:label.textContent!, message:message.textContent! };
  const controller = new AbortController(), on = { signal:controller.signal };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const touch = matchMedia('(pointer: coarse)').matches;
  const held = new Set<string>(), pointers = new Map<number,string>();
  const key = `${id}:best:v1`;
  let best = 0;
  try { best = Math.max(0,Math.min(1e9,Number(localStorage.getItem(key)) || 0)); } catch { /* Optional storage. */ }
  let phase: Phase = 'ready', previous: Phase = 'ready';
  let frame = 0, reveal = 0, last = 0, accumulator = 0, hudTimer = 0, closing = 0;
  let joystick: number | null = null, stickX = 0, stickY = 0;
  let sound = false, audio: AudioContext | null = null, ownsFullscreen = false;
  try { sound=localStorage.getItem(`${id}:sound:v1`)==='on'; } catch { /* Optional preference. */ }
  let fullscreenRequest: Promise<void> | null = null;
  let slowFrames = 0, eco = false;
  const oscillators=new Set<OscillatorNode>();
  const beep: Beep = (frequency,duration=.08,type='square') => {
    if (!sound || !audio || audio.state !== 'running' || oscillators.size>=6) return;
    const oscillator = audio.createOscillator(), gain = audio.createGain();
    oscillator.type = type; oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.025,audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+duration);
    oscillator.connect(gain); gain.connect(audio.destination);
    oscillators.add(oscillator);oscillator.start(); oscillator.stop(audio.currentTime+duration);
    oscillator.onended = () => { oscillators.delete(oscillator);oscillator.disconnect(); gain.disconnect(); };
  };
  const game = factory(beep);
  const announce = (text: string) => { q('.arcade-announcement').textContent = text; };
  function clearInput(): void {
    held.clear(); pointers.clear(); joystick = null; stickX = 0; stickY = 0;
    dialog.querySelectorAll('.is-held').forEach(button=>button.classList.remove('is-held'));
    const stick = dialog.querySelector<HTMLElement>('.arcade-stick');
    if (stick) stick.style.transform = '';
  }
  function stop(): void { cancelAnimationFrame(frame); frame=0; last=0; accumulator=0; clearInput();for(const node of oscillators){try{node.stop();}catch{/* Already stopped. */}}oscillators.clear(); }
  function paint(): void { if (context) { context.imageSmoothingEnabled=false; game.draw(context,reduced.matches); } }
  function updateHUD(): void {
    const notice = game.hud(dialog);
    if (notice && notice !== q('.arcade-announcement').textContent) announce(notice);
    q('[data-arcade-best]').textContent = String(best);
  }
  function display(): void {
    const playing = phase === 'running', help = phase === 'help', tutorial = phase === 'tutorial';
    stage.dataset.phase = phase;
    q('.arcade-playfield').inert=!playing;
    q('.arcade-overlay').hidden = playing;
    q('.arcade-hud').hidden = !playing;
    q('.arcade-controls').hidden = !playing;
    q('[data-arcade-pause]').hidden = !playing;
    q('.arcade-instructions').hidden = !help && !tutorial;
    q('[data-arcade-help]').hidden = phase !== 'ready';
    q('[data-arcade-restart]').hidden = phase !== 'paused';
    q('[data-arcade-exit]').hidden = phase !== 'paused' && phase !== 'over';
    title.textContent = phase === 'paused' ? 'On standby' : tutorial ? 'Quick briefing' : help ? dialog.dataset.manual ?? 'Flight manual' : original.title;
    if (id === 'rail-crane' && help) title.textContent = 'Operator manual';
    if (id === 'torque-trail' && help) title.textContent = 'Rider handbook';
    label.textContent = phase === 'paused' ? 'Your session is waiting' : original.label;
    message.textContent = phase === 'paused' ? 'Take your time. Resume when you are ready.' : original.message;
    startButton.textContent = help ? 'Back' : tutorial ? 'Start Playing →' : phase === 'paused' ? 'Resume' : phase === 'over' ? 'Play Again' : 'Play →';
    const result = phase === 'over' ? game.result() : null;
    q('[data-arcade-next]').hidden=!result?.next;
    if (result) { title.textContent=result.title; label.textContent=`FINAL SCORE / ${result.score}`; message.textContent=result.message;if(result.next)q('[data-arcade-next]').textContent=result.next; }
    updateHUD();
  }
  function pause(): void {
    if (phase !== 'running') return;
    phase='paused'; stop(); display(); void audio?.suspend().catch(()=>{});
    announce('Game paused.');
    if (dialog.open && !document.hidden) startButton.focus({preventScroll:true});
  }
  function finish(): void {
    const result=game.result(); if (!result) return;
    best=Math.max(best,result.score);
    try { localStorage.setItem(key,String(best)); } catch { /* Scores never gate play. */ }
    phase='over'; stop(); display(); paint(); beep(150,.18,'triangle');
    announce(`${result.title}. Final score ${result.score}.`); startButton.focus({preventScroll:true});
  }
  function tick(now: number): void {
    frame=0;
    if (phase !== 'running' || !dialog.open || controller.signal.aborted) return;
    if (!last) last=now;
    const elapsed=(now-last)/1000;
    if (eco && elapsed < 1/30-.001) { frame=requestAnimationFrame(tick); return; }
    last=now;
    slowFrames=elapsed>.029 ? slowFrames+1 : Math.max(0,slowFrames-1);
    if (slowFrames>45) eco=true;
    accumulator+=Math.min(elapsed,.1);
    const input: Input = {
      x:Math.max(-1,Math.min(1,Number(held.has('right'))-Number(held.has('left'))+stickX)),
      y:Math.max(-1,Math.min(1,Number(held.has('down'))-Number(held.has('up'))+stickY)),
      fire:held.has('fire') || touch, slow:held.has('slow'), touch,
    };
    while (accumulator >= 1/60 && !game.result()) { game.update(1/60,input); accumulator-=1/60; }
    paint(); hudTimer+=Math.min(elapsed,.1);
    if (hudTimer>.1) { updateHUD(); hudTimer=0; }
    if (game.result()) { finish(); return; }
    frame=requestAnimationFrame(tick);
  }
  function start(fresh=false): void {
    if (!dialog.open || !context) return;
    if (phase==='help') { phase=previous; display(); startButton.focus({preventScroll:true}); return; }
    if (phase==='ready' && dialog.dataset.guided==='true') { phase='tutorial';display();startButton.focus({preventScroll:true});return; }
    if (fresh || phase !== 'paused') game.reset();
    stop(); phase='running'; display(); paint(); focusField();
    if(sound&&!audio){try{audio=new AudioContext();}catch{sound=false;}}
    void audio?.resume().catch(()=>{}); beep(520,.09,'triangle');
    if (dialog.dataset.allowFullscreen!=='false' && touch && !document.fullscreenElement && !fullscreenRequest && document.documentElement.requestFullscreen) {
      fullscreenRequest=document.documentElement.requestFullscreen().then(()=>{ownsFullscreen=true;}).catch(()=>{}).finally(()=>{fullscreenRequest=null;});
    }
    frame=requestAnimationFrame(tick);
  }
  async function leaveFullscreen(): Promise<void> {
    await fullscreenRequest;
    if (ownsFullscreen && document.fullscreenElement) { try { await document.exitFullscreen(); } catch { /* Navigation may already have exited. */ } }
    ownsFullscreen=false;
  }
  function close(immediate=false): void {
    pause(); stop(); clearTimeout(closing);
    const finishClose=async () => {
      await leaveFullscreen();
      if (dialog.open) dialog.close();
      dialog.classList.remove('is-closing');
    };
    if (immediate || reduced.matches) void finishClose();
    else { dialog.classList.add('is-closing'); closing=window.setTimeout(()=>{void finishClose();},170); }
  }
  function open(): void {
    if (controller.signal.aborted || dialog.open) return;
    clearTimeout(closing); dialog.classList.remove('is-closing');
    dialog.showModal(); document.documentElement.classList.add('arcade-open');
    display(); paint(); startButton.focus({preventScroll:true});
  }
  if (!context || typeof dialog.showModal !== 'function') {
    opener.hidden=false; opener.disabled=true; opener.textContent='This browser cannot start the game. Please use a newer browser.'; return;
  }
  opener.hidden=false;
  opener.addEventListener('click',open,on);
  q('[data-arcade-close]').addEventListener('click',()=>close(),on);
  q('[data-arcade-exit]').addEventListener('click',()=>close(),on);
  q('[data-arcade-pause]').addEventListener('click',pause,on);
  startButton.addEventListener('click',()=>start(),on);
  q('[data-arcade-restart]').addEventListener('click',()=>start(true),on);
  q('[data-arcade-next]').addEventListener('click',()=>{game.next?.();phase='paused';start();},on);
  q('[data-arcade-help]').addEventListener('click',()=>{previous=phase;phase='help';display();startButton.focus({preventScroll:true});},on);
  dialog.addEventListener('cancel',event=>{event.preventDefault();if(phase==='running')pause();else if(phase==='help'){phase=previous;display();}else close();},on);
  dialog.addEventListener('close',()=>{
    stop(); document.documentElement.classList.remove('arcade-open');
    void audio?.suspend().catch(()=>{}); void leaveFullscreen();
    if(!controller.signal.aborted)opener.focus({preventScroll:true});
  },on);
  const movement: Record<string,string>={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ShiftLeft:'slow',ShiftRight:'slow'};
  const actions: Record<string,Action>={KeyB:'bomb',KeyX:'bomb',KeyE:id==='rail-crane'?'view-right':'context',KeyQ:'view-left'};
  dialog.addEventListener('keydown',event=>{
    if (event.altKey || event.metaKey || event.ctrlKey || (event.target instanceof HTMLInputElement)) return;
    if (event.code==='KeyP' && phase==='running') {event.preventDefault();pause();return;}
    if(dialog.dataset.layout==='management')return;
    if (phase!=='running' || (event.target instanceof HTMLButtonElement && ['Space','Enter'].includes(event.code))) return;
    if (movement[event.code]) { event.preventDefault();held.add(movement[event.code]); }
    else if (event.code==='Space') {event.preventDefault();if(id==='galactian')held.add('fire');else if(!event.repeat)game.action('grip');}
    else if (actions[event.code]) {event.preventDefault();if(!event.repeat)game.action(actions[event.code]);}
    updateHUD();
  },on);
  window.addEventListener('keyup',event=>{if(movement[event.code])held.delete(movement[event.code]);if(event.code==='Space')held.delete('fire');},on);
  dialog.querySelectorAll<HTMLButtonElement>('[data-hold]').forEach(button=>{
    button.addEventListener('pointerdown',event=>{
      if(phase!=='running')return;
      event.preventDefault();const action=button.dataset.hold!;pointers.set(event.pointerId,action);held.add(action);button.classList.add('is-held');button.setPointerCapture(event.pointerId);
    },on);
    const release=(event: PointerEvent) => {
      const action=pointers.get(event.pointerId);pointers.delete(event.pointerId);
      if(action && ![...pointers.values()].includes(action))held.delete(action);
      button.classList.remove('is-held');
    };
    button.addEventListener('pointerup',release,on);button.addEventListener('pointercancel',release,on);button.addEventListener('lostpointercapture',release,on);
    button.addEventListener('keydown',event=>{if(['Space','Enter'].includes(event.code)){event.preventDefault();held.add(button.dataset.hold!);}},on);
    button.addEventListener('keyup',()=>held.delete(button.dataset.hold!),on);
  });
  dialog.querySelectorAll<HTMLButtonElement>('[data-action]').forEach(button=>{
    const act=()=>{if(phase==='running'&&!button.disabled){game.action(button.dataset.action as Action);updateHUD();}};
    // A second finger does not reliably emit a click. Trigger on its pointerdown;
    // preserve synthetic keyboard clicks without firing a second action on pointerup.
    button.addEventListener('pointerdown',event=>{if(event.button!==0)return;event.preventDefault();act();if(event.pointerType!=='touch')focusField();},on);
    button.addEventListener('click',event=>{if(event.detail===0){act();if(dialog.dataset.layout!=='management')focusField();}},on);
  });
  const pad=dialog.querySelector<HTMLElement>('[data-joystick]');
  if(pad){
    const position=(event:PointerEvent)=>{
      const bounds=pad.getBoundingClientRect(),radius=bounds.width*.36;
      let x=(event.clientX-bounds.left-bounds.width/2)/radius,y=(event.clientY-bounds.top-bounds.height/2)/radius;
      const length=Math.hypot(x,y);if(length>1){x/=length;y/=length;}
      stickX=Math.abs(x)<.12?0:x;stickY=Math.abs(y)<.12?0:y;
      q<HTMLElement>('.arcade-stick').style.transform=`translate(${x*radius*.65}px,${y*radius*.65}px)`;
    };
    pad.addEventListener('pointerdown',event=>{if(phase!=='running'||joystick!==null)return;event.preventDefault();joystick=event.pointerId;pad.setPointerCapture(event.pointerId);position(event);},on);
    pad.addEventListener('pointermove',event=>{if(joystick===event.pointerId)position(event);},on);
    const release=(event:PointerEvent)=>{if(joystick===event.pointerId){joystick=null;stickX=0;stickY=0;q<HTMLElement>('.arcade-stick').style.transform='';}};
    pad.addEventListener('pointerup',release,on);pad.addEventListener('pointercancel',release,on);pad.addEventListener('lostpointercapture',release,on);
  }
  dialog.querySelector<HTMLInputElement>('[data-camera]')?.addEventListener('input',event=>game.camera?.(Number((event.currentTarget as HTMLInputElement).value)),on);
  dialog.querySelectorAll<HTMLInputElement>('[data-control]').forEach(input=>{
    input.addEventListener('input',()=>{if(phase==='running'){game.control?.(input.dataset.control!,Number(input.value));updateHUD();}},on);
  });
  q('[data-arcade-sound]').addEventListener('click',async()=>{
    sound=!sound;
    if(sound){try{audio??=new AudioContext();await audio.resume();beep(660,.1,'triangle');}catch{sound=false;}}
    else void audio?.suspend().catch(()=>{});
    try { localStorage.setItem(`${id}:sound:v1`,sound?'on':'off'); } catch { /* A blocked store does not disable sound. */ }
    q('[data-arcade-sound]').textContent=sound?'Sound on':'Sound off';q('[data-arcade-sound]').setAttribute('aria-pressed',String(sound));
  },on);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();},on);
  window.addEventListener('blur',pause,on);
  document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&ownsFullscreen){ownsFullscreen=false;pause();}},on);
  window.addEventListener('pagehide',()=>{
    controller.abort();stop();cancelAnimationFrame(reveal);clearTimeout(closing);
    if(dialog.open)dialog.close();document.documentElement.classList.remove('arcade-open');
    void leaveFullscreen();void audio?.close().catch(()=>{});delete dialog.dataset.mounted;
  },{once:true});
  q('[data-arcade-sound]').textContent=sound?'Sound on':'Sound off';q('[data-arcade-sound]').setAttribute('aria-pressed',String(sound));display();paint();
  reveal=requestAnimationFrame(()=>{reveal=requestAnimationFrame(()=>{
    const transition=(document as Document & {activeViewTransition?:ViewTransition|null}).activeViewTransition;
    if(transition){void transition.ready.catch(()=>{});void transition.finished.then(open,open);}else open();
  });});
}
