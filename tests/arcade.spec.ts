import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { siteConfig } from '../site.config.mjs';
declare global { interface Window { arcadeCompleteFullscreen():void } }
const base=`${siteConfig.base}juegos/`;

for(const [id,title] of [['galactian','Galactian'],['rail-crane','Rail Crane'],['torque-trail','Torque Trail']]){
  test(`${title}: presentación, instrucciones, pausa, reinicio, cierre e historial`,async({page},testInfo)=>{
    const errors:string[]=[];page.on('pageerror',error=>{if(!error.message.includes('ViewTransition'))errors.push(error.message);});
    await page.goto(`${base}${id}/`);
    const dialog=page.locator(`[data-arcade="${id}"]`);
    await expect(dialog).toBeVisible();await expect(page.locator('[data-arcade-start]')).toBeFocused();
    const size=(await dialog.boundingBox())!;
    if(testInfo.project.name==='desktop')expect(size.height/size.width).toBeCloseTo(16/9,1);
    else{await expect(dialog).toHaveCSS('width','390px');await expect(dialog).toHaveCSS('height','844px');}
    await page.screenshot({path:testInfo.outputPath(`${id}-title.png`),animations:'disabled'});
    await page.locator('[data-arcade-help]').click();await expect(page.locator('.arcade-instructions')).toBeVisible();
    await page.locator('[data-arcade-start]').click();await expect(page.locator('.arcade-instructions')).not.toBeVisible();
    await page.locator('[data-arcade-start]').click();await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','running');
    const field=(await page.locator('.arcade-playfield').boundingBox())!,controls=(await page.locator('.arcade-controls').boundingBox())!;
    expect(field.y+field.height).toBeLessThanOrEqual(controls.y+1);
    await page.keyboard.press('KeyP');await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','paused');
    const hud=await page.locator('.arcade-hud').textContent();await page.waitForTimeout(200);expect(await page.locator('.arcade-hud').textContent()).toBe(hud);
    await page.locator('[data-arcade-restart]').click();await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','running');
    await page.keyboard.press('Escape');await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','paused');
    await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();
    await expect.poll(()=>page.evaluate(()=>document.fullscreenElement===null)).toBe(true);
    await expect(page.locator('html')).not.toHaveClass(/arcade-open/);await expect(page.locator('[data-arcade-open]')).toBeFocused();
    await page.locator('[data-arcade-open]').click();await expect(dialog).toBeVisible();await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','paused');
    await page.locator('[data-arcade-start]').click();await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
    await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','paused');
    await page.locator('[data-arcade-exit]').click();await expect(dialog).not.toBeVisible();
    await page.getByRole('link',{name:'Volver a Juegos'}).click();await page.goBack();
    await expect(dialog).toBeVisible();await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','ready');expect(errors).toEqual([]);
  });
  test(`${title}: almacenamiento bloqueado, movimiento reducido, accesibilidad e interfaz inglesa`,async({page})=>{
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get:()=>{throw new Error('Storage disabled');}});});
    await page.goto(`${siteConfig.base}ar/juegos/${id}/`);
    const dialog=page.locator('[data-arcade]');await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('lang','en');await expect(dialog).toHaveCSS('direction','ltr');await expect(dialog).toHaveCSS('animation-name','none');
    await expect(page.locator('[data-arcade-help]')).toHaveText('How to Play');
    const results=await new AxeBuilder({page}).include('[data-arcade]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations).toEqual([]);
    await page.locator('[data-arcade-start]').click();await page.locator('[data-arcade-pause]').click();
    await expect(page.locator('[data-arcade-start]')).toHaveText('Resume');await page.locator('[data-arcade-close]').click();
    await expect(dialog).not.toBeVisible();
    await expect(page.locator('.back-link')).toHaveAttribute('href',`${siteConfig.base}ar/juegos/`);
  });
}

async function hold(page:Page,key:string,milliseconds:number):Promise<void>{await page.keyboard.down(key);await page.clock.runFor(milliseconds);await page.keyboard.up(key);}

test('Galactian: vuelo, disparo, bomba, aterrizaje completo y despegue @desktop',async({page},testInfo)=>{
  test.setTimeout(90000);await page.clock.install();
  await page.goto(`${base}galactian/`);await expect(page.locator('[data-arcade]')).toBeVisible();
  await page.locator('[data-arcade-start]').click();await page.clock.runFor(1300);
  await hold(page,'ArrowLeft',425);await page.keyboard.down('Space');await page.clock.runFor(28000);
  await page.keyboard.press('KeyB');await expect(page.locator('[data-flight-bombs]')).toHaveText('4');
  expect(Number(await page.locator('[data-flight-fuel]').getAttribute('value'))).toBeLessThan(70);
  await page.keyboard.down('Shift');await page.clock.runFor(2200);
  await expect(page.locator('[data-action="context"]')).toBeEnabled();await page.keyboard.press('KeyE');
  await page.keyboard.up('Shift');await page.keyboard.up('Space');await page.clock.runFor(5000);
  await expect(page.locator('[data-action="context"]')).toHaveText('Take Off');await expect(page.locator('[data-fuel-value]')).toHaveText('100%');await expect(page.locator('[data-hull-value]')).toHaveText('100%');await expect(page.locator('[data-flight-bombs]')).toHaveText('5');
  await page.screenshot({path:testInfo.outputPath('galactian-resupply.png')});
  await page.keyboard.press('KeyE');await page.clock.runFor(1400);await expect(page.locator('[data-flight-warning]')).not.toHaveText(/Fully supplied/);
  await page.keyboard.press('KeyP');await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','paused');
});

test('Rail Crane: recogida real, cámara, primera entrega y timeout @desktop',async({page},testInfo)=>{
  test.setTimeout(90000);await page.clock.install();
  // Exercise a low-refresh device while advancing a whole operation, with real
  // keyboard input and the same elapsed-time simulation used in production.
  await page.addInitScript(()=>{window.requestAnimationFrame=callback=>window.setTimeout(()=>callback(performance.now()),100);window.cancelAnimationFrame=window.clearTimeout.bind(window);});
  await page.goto(`${base}rail-crane/`);
  await page.locator('[data-arcade-start]').click();await hold(page,'KeyS',750);await page.keyboard.press('Space');
  await expect(page.locator('[data-crane-held]')).toHaveText('HOOKED / C-12');
  await hold(page,'KeyW',1000);await hold(page,'KeyD',500);await page.clock.runFor(500);
  await hold(page,'KeyS',2700);await page.keyboard.press('Space');await page.clock.runFor(500);
  await expect(page.locator('[data-crane-count]')).toHaveText('1/3');await expect(page.locator('[data-crane-streak]')).toContainText('STREAK ×1');
  const order=await page.locator('[data-crane-order]').textContent();await page.locator('[data-action="view-right"]').click();await page.clock.runFor(1000);
  await expect(page.locator('[data-crane-bay]')).not.toHaveText('VIEW 01 / 06');await expect(page.locator('[data-crane-order]')).toHaveText(order!);
  await page.screenshot({path:testInfo.outputPath('rail-crane-delivery.png')});
  await page.clock.runFor(220000);await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','over');await expect(page.locator('[data-arcade-start]')).toHaveText('Play Again');await expect(page.locator('[data-screen-message]')).toContainText('1 of 3 deliveries');
  await expect.poll(()=>page.evaluate(()=>Number(localStorage.getItem('rail-crane:best:v1')))).toBeGreaterThan(0);
  await page.locator('[data-arcade-start]').click();await expect(page.locator('[data-crane-count]')).toHaveText('0/3');
});

test('Galactian: fin de misión, récord persistente y Play Again @desktop',async({page},testInfo)=>{
  test.setTimeout(90000);await page.clock.install();
  await page.addInitScript(()=>{window.requestAnimationFrame=callback=>window.setTimeout(()=>callback(performance.now()),100);window.cancelAnimationFrame=window.clearTimeout.bind(window);});
  await page.goto(`${base}galactian/`);await page.locator('[data-arcade-start]').click();
  await page.clock.runFor(1300);await hold(page,'KeyA',600);await page.keyboard.down('Space');await page.clock.runFor(70000);await page.keyboard.up('Space');
  await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','over');await expect(page.locator('[data-arcade-start]')).toHaveText('Play Again');
  const best=await page.locator('[data-arcade-best]').textContent();expect(await page.evaluate(()=>localStorage.getItem('galactian:best:v1'))).toBe(best);
  await page.screenshot({path:testInfo.outputPath('galactian-game-over.png')});
  await page.locator('[data-arcade-start]').click();await expect(page.locator('[data-fuel-value]')).toHaveText('100%');await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','running');
  await page.reload();await expect(page.locator('[data-arcade-best]')).toHaveText(best!);
});

test('el cierre espera fullscreen pendiente y no deja una sesión activa @mobile',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.addInitScript(()=>{
    let fullscreen:Element|null=null,resolveEntry:(()=>void)|undefined;
    Object.defineProperty(document,'fullscreenElement',{get:()=>fullscreen});
    Element.prototype.requestFullscreen=()=>new Promise<void>(resolve=>{resolveEntry=()=>{fullscreen=document.documentElement;resolve();document.dispatchEvent(new Event('fullscreenchange'));};});
    document.exitFullscreen=async()=>{fullscreen=null;document.dispatchEvent(new Event('fullscreenchange'));};
    Object.assign(window,{arcadeCompleteFullscreen:()=>resolveEntry?.()});
  });
  await page.goto(`${base}rail-crane/`);await page.locator('[data-arcade-start]').tap();await page.locator('[data-arcade-close]').tap();
  await page.evaluate(()=>window.arcadeCompleteFullscreen());
  await expect(page.locator('[data-arcade]')).not.toBeVisible();await expect(page.locator('html')).not.toHaveClass(/arcade-open/);expect(await page.evaluate(()=>document.fullscreenElement)).toBe(null);await expect(page.locator('[data-arcade-open]')).toBeFocused();
});

test('táctil: joystick y bomba simultáneos, grúa diagonal y orientación @mobile',async({page,context},testInfo)=>{
  // Resize the emulated viewport in windowed mode; native fullscreen ownership
  // and its asynchronous close are covered independently above.
  await page.addInitScript(()=>{Object.defineProperty(Element.prototype,'requestFullscreen',{value:undefined,configurable:true});});
  const cdp=await context.newCDPSession(page);
  for(const id of ['galactian','rail-crane']){
    await page.goto(`${base}${id}/`);await page.locator('[data-arcade-start]').tap();
    if(id==='galactian'){
      await page.waitForTimeout(1400);const pad=(await page.locator('[data-joystick]').boundingBox())!,bomb=(await page.locator('[data-action="bomb"]').boundingBox())!;
      const points=[{id:1,x:pad.x+pad.width*.8,y:pad.y+pad.height*.3},{id:2,x:bomb.x+bomb.width/2,y:bomb.y+bomb.height/2}];
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points});await page.waitForTimeout(150);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      await expect(page.locator('[data-flight-bombs]')).toHaveText('4');
    }else{
      const left=(await page.locator('[data-hold="right"]').boundingBox())!,down=(await page.locator('[data-hold="down"]').boundingBox())!;
      expect(left.width).toBeGreaterThanOrEqual(44);expect(down.height).toBeGreaterThanOrEqual(44);
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:3,x:left.x+left.width/2,y:left.y+left.height/2},{id:4,x:down.x+down.width/2,y:down.y+down.height/2}]});await page.waitForTimeout(300);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      await expect(page.locator('[data-crane-order]')).toBeVisible();
    }
    await page.locator('[data-arcade-pause]').tap();
    await page.evaluate(async()=>{if(document.fullscreenElement)await document.exitFullscreen();});
    await page.setViewportSize({width:844,height:390});await expect(page.locator('[data-arcade-start]')).toBeInViewport();await expect(page.locator('[data-arcade-close]')).toBeInViewport();
    await page.locator('[data-arcade-start]').tap();await expect(page.locator('.arcade-controls')).toBeInViewport();
    await page.screenshot({path:testInfo.outputPath(`${id}-landscape.png`)});
    await page.locator('[data-arcade-close]').tap();await expect(page.locator('html')).not.toHaveClass(/arcade-open/);
    await page.setViewportSize({width:320,height:568});await page.locator('[data-arcade-open]').tap();await page.locator('[data-arcade-start]').tap();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(page.locator('[data-arcade-close]')).toBeInViewport();
    await page.locator('[data-arcade-close]').tap();await page.setViewportSize({width:390,height:844});
  }
  await cdp.detach();
});

test('el catálogo nuevo funciona sin JavaScript y cada ficha conserva instrucciones',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto(base);
  await expect(page.locator('.new-game')).toHaveCount(3);await expect(page.locator('canvas')).toHaveCount(0);
  for(const id of ['galactian','rail-crane','torque-trail']){await page.goto(`${base}${id}/`);await expect(page.locator('.arcade-noscript')).toBeVisible();await expect(page.locator('.arcade-page-instructions')).toBeVisible();}
  await context.close();
});

test('la preferencia de sonido persiste sin reproducir antes de una interacción',async({page})=>{
  await page.goto(`${base}rail-crane/`);await page.locator('[data-arcade-sound]').click();await expect(page.locator('[data-arcade-sound]')).toHaveText('Sound on');
  await page.reload();await expect(page.locator('[data-arcade-sound]')).toHaveText('Sound on');await page.locator('[data-arcade-start]').click();await page.locator('[data-arcade-pause]').click();
});
