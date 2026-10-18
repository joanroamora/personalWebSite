import {expect,test,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {siteConfig} from '../site.config.mjs';
import {createPacket,route} from '../src/games/packet-runner/model';
const base=siteConfig.base;
const entries=[['blackout-texas','Blackout Texas'],['deploy-or-die','Deploy or Die'],['packet-runner','Packet Runner'],['orbital-rescue','Orbital Rescue']] as const;
async function play(page:Page,id:string){
 await page.goto(`${base}juegos/${id}/`);await expect(page.locator('[data-arcade]')).toBeVisible();
 await page.locator('[data-arcade-start]').click();await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','tutorial');
 await expect(page.locator('.arcade-instructions')).toBeVisible();await page.locator('[data-arcade-start]').click();await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','running');
}
async function slowFrames(page:Page){await page.clock.install();await page.addInitScript(()=>{window.requestAnimationFrame=callback=>window.setTimeout(()=>callback(performance.now()),100);window.cancelAnimationFrame=window.clearTimeout.bind(window);});}
async function until(page:Page,selector:string,remaining:number){const value=await page.locator(selector).textContent();const [m,s]=value!.split(':').map(Number);await page.clock.runFor(Math.max(0,(m*60+s-remaining)*1000)+500);}

for(const [id,title] of entries){
 test(`${title}: contenedor, tutorial, pausa, reinicio, salida y regreso`,async({page},testInfo)=>{
  const errors:string[]=[];page.on('pageerror',error=>{if(!error.message.includes('ViewTransition'))errors.push(error.message);});
  await page.addInitScript(()=>{let count=0;Element.prototype.requestFullscreen=async()=>{count++;};Object.assign(window,{feature11FullscreenCalls:()=>count});});
  await page.goto(`${base}juegos/${id}/`);const dialog=page.locator('[data-arcade]');await expect(dialog).toBeVisible();
  const box=(await dialog.boundingBox())!;if(testInfo.project.name==='desktop')expect(box.height/box.width).toBeCloseTo(16/9,1);else{await expect(dialog).toHaveCSS('width','390px');await expect(dialog).toHaveCSS('height','844px');}
  await page.locator('[data-arcade-help]').click();await expect(page.locator('.arcade-instructions')).toBeVisible();await page.locator('[data-arcade-start]').click();
  await page.locator('[data-arcade-start]').click();await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','tutorial');await page.locator('[data-arcade-start]').click();
  await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','running');expect(await page.evaluate(()=>{return (window as unknown as {feature11FullscreenCalls():number}).feature11FullscreenCalls();})).toBe(0);
  await page.screenshot({path:testInfo.outputPath(`${id}-playing.png`),animations:'disabled'});
  await page.keyboard.press('KeyP');await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','paused');
  const hud=await page.locator('.arcade-hud').textContent();await page.waitForTimeout(200);expect(await page.locator('.arcade-hud').textContent()).toBe(hud);await expect(page.locator('[data-arcade-start]')).toHaveText('Resume');
  await page.locator('[data-arcade-restart]').click();await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','running');
  await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','paused');await page.locator('[data-arcade-start]').click();
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','paused');
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','paused');await page.locator('[data-arcade-start]').click();
  await page.keyboard.press('Escape');await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','paused');await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();
  await expect(page.locator('[data-arcade-open]')).toBeFocused();await expect(page.locator('html')).not.toHaveClass(/arcade-open/);
  await page.locator('[data-arcade-open]').click();await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','paused');await page.locator('[data-arcade-exit]').click();await expect(dialog).not.toBeVisible();
  await page.getByRole('link',{name:'Volver a Juegos'}).click();await page.goBack();await expect(dialog).toBeVisible();await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','ready');expect(errors).toEqual([]);
 });
 test(`${title}: inglés, accesibilidad, almacenamiento bloqueado y tamaños`,async({page},testInfo)=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get:()=>{throw new Error('Unavailable storage');}});});
  await play(page,id);
  await page.locator('[data-arcade-close]').click();await page.goto(`${base}ar/juegos/${id}/`);
  const dialog=page.locator('[data-arcade]');await expect(dialog).toBeVisible();await expect(dialog).toHaveAttribute('lang','en');await expect(dialog).toHaveCSS('direction','ltr');await expect(dialog).toHaveCSS('animation-name','none');
  let audit=await new AxeBuilder({page}).include('[data-arcade]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(audit.violations).toEqual([]);
  await page.locator('[data-arcade-start]').click();await page.locator('[data-arcade-start]').click();
  audit=await new AxeBuilder({page}).include('[data-arcade]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  for(const size of [{width:320,height:568},{width:768,height:1024},{width:844,height:390}]){
   await page.setViewportSize(size);await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','running');
   const field=(await page.locator('.arcade-playfield').boundingBox())!,hud=(await page.locator('.arcade-hud').boundingBox())!,controls=(await page.locator('.arcade-controls').boundingBox())!;
   expect(field.width).toBeGreaterThan(40);expect(field.height).toBeGreaterThan(40);
   expect(field.y+field.height<=controls.y+2||field.x+field.width<=controls.x+2).toBe(true);
   expect(hud.y+hud.height<=field.y+3||hud.x+hud.width<=field.x+2).toBe(true);
   for(const control of await page.locator('.arcade-controls button').all()){const b=(await control.boundingBox())!;expect(b.width).toBeGreaterThanOrEqual(44);expect(b.height).toBeGreaterThanOrEqual(44);}
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await page.screenshot({path:testInfo.outputPath(`${id}-landscape.png`),animations:'disabled'});await page.locator('[data-arcade-pause]').click();
  await expect(page.locator('.arcade-playfield')).toHaveAttribute('inert','');await page.locator('[data-arcade-exit]').click();await expect(dialog).not.toBeVisible();
 });
}

test('Blackout Texas: arrancar, asignar, batería, reparar y terminar la jornada @desktop',async({page},testInfo)=>{
 test.setTimeout(90000);await slowFrames(page);await play(page,'blackout-texas');
 await page.locator('[data-action="start-gas"]').click();await page.clock.runFor(11000);await expect(page.locator('[data-grid-gas]')).not.toContainText('Offline');
 await page.locator('[data-action="auto"]').click();await page.locator('[data-action="select-3"]').click();const before=await page.locator('[data-grid-selection]').textContent();await page.locator('[data-action="increase"]').click();expect(await page.locator('[data-grid-selection]').textContent()).not.toBe(before);
 await page.locator('[data-action="Charge"]').click();await expect(page.locator('[data-action="Charge"]')).toHaveAttribute('aria-pressed','true');await page.clock.runFor(3000);await expect(page.locator('[data-grid-flow]')).toContainText('Charge');
 await page.locator('[data-action="auto"]').click();await until(page,'[data-grid-time]',40);
 await page.locator('[data-action="select-2"]').click();await expect(page.locator('[data-grid-line="2"]')).toContainText('DISCONNECTED');await page.locator('[data-action="repair"]').click();await expect(page.locator('[data-grid-crew]')).toContainText('working');
 await page.clock.runFor(7500);await page.locator('[data-action="auto"]').click();await expect(page.locator('[data-grid-line="2"]')).not.toContainText('DISCONNECTED');
 await page.screenshot({path:testInfo.outputPath('blackout-grid-restored.png')});await page.clock.runFor(45000);await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','over');await expect(page.locator('.arcade-title')).toHaveText('Lights still on');await expect(page.locator('[data-screen-message]')).toContainText('MWh served');
 const best=await page.locator('[data-arcade-best]').textContent();expect(await page.evaluate(()=>localStorage.getItem('blackout-texas:best:v1'))).toBe(best);await page.locator('[data-arcade-next]').click();await expect(page.locator('[data-grid-day]')).toHaveText('DAY 02');
});

test('Deploy or Die: servidores, tests, canary, promoción, rollback e incidentes @desktop',async({page},testInfo)=>{
 test.setTimeout(90000);await slowFrames(page);await play(page,'deploy-or-die');await page.locator('[data-action="scale-up"]').click();await page.locator('[data-action="scale-up"]').click();await page.clock.runFor(6500);await expect(page.locator('[data-server-slot="3"] [data-server-health]')).toContainText('healthy');
 await until(page,'[data-ops-time]',175);await page.locator('[data-action="tab-release"]').click();await page.locator('[data-action="tests"]').click();await page.clock.runFor(3500);await expect(page.locator('[data-ops-tests]')).toContainText('PASS');await page.locator('[data-action="canary"]').click();await page.clock.runFor(9500);await expect(page.locator('[data-action="promote"]')).toBeEnabled();await page.locator('[data-action="promote"]').click();await page.clock.runFor(12500);await expect(page.locator('[data-ops-deployments]')).toContainText('deployments 1');
 await page.clock.runFor(13000);await page.locator('[data-action="canary"]').click();await page.clock.runFor(3500);await page.locator('[data-action="rollback"]').click();await page.clock.runFor(3500);await expect(page.locator('[data-ops-deployments]')).toContainText('Rollbacks 1');
 await page.locator('[data-action="tab-platform"]').click();await until(page,'[data-ops-time]',106);await page.locator('[data-action="server-1"]').click();await expect(page.locator('[data-ops-selection]')).toContainText('leaking');await page.locator('[data-action="restart"]').click();await page.clock.runFor(3500);
 await until(page,'[data-ops-time]',77);await page.locator('[data-action="server-1"]').click();await expect(page.locator('[data-ops-selection]')).toContainText('down');await page.locator('[data-action="repair"]').click();await page.clock.runFor(6500);
 await until(page,'[data-ops-time]',47);await expect(page.locator('[data-ops-db]')).toContainText('SLOW');await page.locator('[data-action="optimize"]').click();await page.clock.runFor(500);await page.screenshot({path:testInfo.outputPath('deploy-database-recovery.png')});await page.clock.runFor(52000);
 await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','over');await expect(page.locator('.arcade-title')).toHaveText('Still online');await expect(page.locator('[data-screen-message]')).toContainText('1 healthy deployments');
});

test('Packet Runner: entrega por enlaces reales, TTL, fallos, récord y nueva partida @desktop',async({page},testInfo)=>{
 test.setTimeout(90000);await slowFrames(page);await play(page,'packet-runner');const run=createPacket(),path=route(run.network,run.node,run.destination);
 for(let i=1;i<path.length;i++){const delta=path[i]-path[i-1],direction=delta===1?'right':delta===-1?'left':delta>0?'down':'up';await page.locator(`[data-action="turn-${direction}"]`).click();await page.clock.runFor(800);}
 await expect(page.locator('[data-packet-deliveries]')).toHaveText('1 / 3 deliveries');await page.screenshot({path:testInfo.outputPath('packet-delivered.png')});await page.clock.runFor(180000);await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','over');await expect(page.locator('.arcade-title')).toHaveText('Connection closed');
 expect(Number(await page.locator('[data-arcade-best]').textContent())).toBeGreaterThan(0);await page.locator('[data-arcade-start]').click();await expect(page.locator('[data-packet-failures]')).toHaveText('0 / 3 failed');
});

test('Orbital Rescue: lanzamiento, inercia, frenado y recogida con teclado @desktop',async({page},testInfo)=>{
 await slowFrames(page);await play(page,'orbital-rescue');await page.keyboard.down('ArrowUp');await page.clock.runFor(2000);await page.keyboard.up('ArrowUp');expect(parseFloat((await page.locator('[data-rescue-speed]').textContent())!)).toBeGreaterThan(25);
 await page.keyboard.down('ArrowDown');await page.clock.runFor(4200);await page.keyboard.up('ArrowDown');await expect(page.locator('[data-rescue-passengers]')).toHaveText('1 / 2');expect(parseFloat((await page.locator('[data-rescue-speed]').textContent())!)).toBeLessThan(2);await page.screenshot({path:testInfo.outputPath('orbital-first-rescue.png')});
});

test('movimiento táctil simultáneo y cancelación de punteros @mobile',async({page,context})=>{
 const cdp=await context.newCDPSession(page);
 for(const id of ['packet-runner','orbital-rescue']){await play(page,id);const left=(await page.locator('[data-hold="left"]').boundingBox())!,up=(await page.locator('[data-hold="up"]').boundingBox())!;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:1,x:left.x+left.width/2,y:left.y+left.height/2},{id:2,x:up.x+up.width/2,y:up.y+up.height/2}]});await expect(page.locator('[data-hold="left"]')).toHaveClass(/is-held/);await expect(page.locator('[data-hold="up"]')).toHaveClass(/is-held/);await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await expect(page.locator('[data-hold="left"]')).not.toHaveClass(/is-held/);await expect(page.locator('[data-hold="up"]')).not.toHaveClass(/is-held/);await page.locator('[data-arcade-close]').tap();}
 await cdp.detach();
});

test('gestión móvil: desplazamiento interno, selección y ajustes accesibles @mobile',async({page,context})=>{
 const cdp=await context.newCDPSession(page);
 for(const id of ['blackout-texas','deploy-or-die']){
  await play(page,id);const field=page.locator('.arcade-playfield'),bounds=(await field.boundingBox())!;
  const x=bounds.x+bounds.width*.8,start=bounds.y+bounds.height*.8,end=bounds.y+bounds.height*.2;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y:start}]});
  for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:start+(end-start)*i/8}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect.poll(()=>field.evaluate(node=>node.scrollTop)).toBeGreaterThan(0);expect(await page.evaluate(()=>scrollY)).toBe(0);
  if(id==='blackout-texas'){
   await page.locator('[data-action="select-3"]').tap();await expect(page.locator('[data-grid-selection]')).toContainText('HOSPITAL');
   const slider=page.locator('[data-control="assignment"]');await slider.focus();const previous=Number(await slider.inputValue());await page.keyboard.press('ArrowRight');expect(Number(await slider.inputValue())).toBeGreaterThan(previous);
  }else{await page.locator('[data-action="tab-release"]').tap();await expect(page.locator('[data-ops-release]')).toBeVisible();}
  await page.locator('[data-arcade-close]').tap();
 }
 await cdp.detach();
});

test('nuevos juegos: sonido independiente, visibilidad y limpieza de animación/audio @desktop',async({page})=>{
 await page.addInitScript(()=>{
  const pending=new Set<number>(),contexts:AudioContext[]=[],request=window.requestAnimationFrame.bind(window),cancel=window.cancelAnimationFrame.bind(window);
  window.requestAnimationFrame=callback=>{const id=request(time=>{pending.delete(id);callback(time);});pending.add(id);return id;};window.cancelAnimationFrame=id=>{pending.delete(id);cancel(id);};
  const NativeAudio=window.AudioContext;window.AudioContext=class extends NativeAudio{constructor(){super();contexts.push(this);}};
  Object.assign(window,{arcadeResources:()=>({frames:pending.size,audio:contexts.map(context=>context.state)})});
 });
 for(const [id] of entries){
  await page.goto(`${base}juegos/${id}/`);await expect(page.locator('[data-arcade]')).toBeVisible();const sound=page.locator('[data-arcade-sound]');await expect(sound).toHaveText('Sound off');await sound.click();await expect(sound).toHaveText('Sound on');
  expect(await page.evaluate(key=>localStorage.getItem(key),`${id}:sound:v1`)).toBe('on');
  await page.locator('[data-arcade-start]').click();await page.locator('[data-arcade-start]').click();await page.locator('[data-arcade-close]').click();await expect(page.locator('[data-arcade]')).not.toBeVisible();
  await expect.poll(()=>page.evaluate(()=>{return (window as unknown as {arcadeResources():{frames:number;audio:string[]}}).arcadeResources();})).toEqual({frames:0,audio:['suspended']});
  await page.reload();await expect(page.locator('[data-arcade-sound]')).toHaveText('Sound on');
  expect(await page.evaluate(()=>{return (window as unknown as {arcadeResources():{frames:number;audio:string[]}}).arcadeResources().audio;})).toEqual([]);
 }
});
