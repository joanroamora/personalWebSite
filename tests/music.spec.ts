import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { siteConfig } from '../site.config.mjs';
import { musicSessionKey } from '../src/utils/music-state';

const base = siteConfig.base;
const audio = (page:Page) => page.locator('[data-music-audio]');
const widget = (page:Page) => page.locator('[data-music-widget]');
async function open(page:Page) { await page.locator('[data-music-disclosure] > summary').click(); }
async function play(page:Page) {
  await open(page);
  await page.getByRole('button',{name:'Activar música',exact:true}).click();
  await expect(widget(page)).toHaveAttribute('data-music-state','playing');
}

test('música opcional: ninguna descarga inicial, reproducción real, volumen y pausa', async ({page}) => {
  const media:string[] = [];
  page.on('request',request => { if (/\.mp3(?:\?|$)/.test(request.url())) media.push(request.url()); });
  await page.goto(base);
  await expect(widget(page)).toBeVisible();
  await expect(audio(page)).not.toHaveAttribute('src');
  await expect(audio(page)).toHaveAttribute('preload','none');
  await open(page);
  await page.getByLabel('Elegir pista').selectOption('tsuioku');
  expect(media).toEqual([]);
  await page.getByRole('button',{name:'Activar música',exact:true}).click();
  await expect(widget(page)).toHaveAttribute('data-music-state','playing');
  await expect.poll(() => audio(page).evaluate((element:HTMLAudioElement) => element.currentTime)).toBeGreaterThan(.02);
  expect(await audio(page).evaluate((element:HTMLAudioElement) => element.paused)).toBe(false);
  expect(media.length).toBeGreaterThan(0);
  const slider = page.getByLabel('Volumen');
  await slider.focus();
  await page.keyboard.press('Home');
  expect(await audio(page).evaluate((element:HTMLAudioElement) => element.volume)).toBe(0);
  await page.keyboard.press('ArrowRight');
  expect(await audio(page).evaluate((element:HTMLAudioElement) => element.volume)).toBeCloseTo(.01);
  await page.getByRole('button',{name:'Pausar música',exact:true}).click();
  expect(await audio(page).evaluate((element:HTMLAudioElement) => element.paused)).toBe(true);
  await expect(widget(page)).toHaveAttribute('data-music-state','paused');
});

test('las cuatro pistas se pueden escuchar y la lista continúa al terminar una canción', async ({page}) => {
  await page.goto(base);
  await play(page);
  for (const id of ['tsuioku','teresa','stone-river','clifford']) {
    await page.getByLabel('Elegir pista').selectOption(id);
    await expect(widget(page)).toHaveAttribute('data-music-state','playing');
    await expect.poll(() => audio(page).evaluate((element:HTMLAudioElement) => Number.isFinite(element.duration) && element.duration > 0)).toBe(true);
    expect(await audio(page).evaluate((element:HTMLAudioElement) => element.paused)).toBe(false);
  }
  await audio(page).evaluate((element:HTMLAudioElement) => { element.currentTime = element.duration - .15; });
  await expect(page.getByLabel('Elegir pista')).toHaveValue('tsuioku');
  await expect(widget(page)).toHaveAttribute('data-music-state','playing');
  await page.getByRole('button',{name:'Siguiente pista',exact:true}).click();
  await expect(page.getByLabel('Elegir pista')).toHaveValue('teresa');
});

test('navegación e historial recuperan pista, posición y volumen sin duplicar audio', async ({page}) => {
  await page.goto(base);
  await play(page);
  await audio(page).evaluate((element:HTMLAudioElement) => { element.currentTime = 18; });
  await page.getByLabel('Volumen').evaluate((input:HTMLInputElement) => { input.value = '37'; input.dispatchEvent(new Event('input',{bubbles:true})); });
  await page.locator('[data-music-close]').click();
  const menu = page.locator('.mobile-menu > summary');
  if (await menu.isVisible()) await menu.click();
  await page.locator('nav:visible a[href$="/blog/"]').first().click();
  await expect(page).toHaveURL(`${base}blog/`);
  await expect.poll(() => widget(page).getAttribute('data-music-state')).toMatch(/playing|blocked/);
  await open(page);
  if (await widget(page).getAttribute('data-music-state') === 'blocked') await page.getByRole('button',{name:'Activar música',exact:true}).click();
  await expect(widget(page)).toHaveAttribute('data-music-state','playing');
  await expect.poll(() => audio(page).evaluate((element:HTMLAudioElement) => element.currentTime)).toBeGreaterThanOrEqual(17.8);
  await expect(page.getByLabel('Volumen')).toHaveValue('37');
  await expect(audio(page)).toHaveCount(1);
  await page.getByRole('button',{name:'Pausar música',exact:true}).click();
  await page.goBack();
  await expect(audio(page)).toHaveCount(1);
  expect(await audio(page).evaluate((element:HTMLAudioElement) => element.paused)).toBe(true);
});

test('errores, bloqueo de autoplay y almacenamiento deshabilitado no rompen la web', async ({page}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window,'localStorage',{get:() => { throw new DOMException('blocked','SecurityError'); }});
    Object.defineProperty(window,'sessionStorage',{get:() => { throw new DOMException('blocked','SecurityError'); }});
    const nativePlay = HTMLMediaElement.prototype.play;
    let denied = true;
    HTMLMediaElement.prototype.play = function() {
      if (denied) { denied = false; return Promise.reject(new DOMException('gesture required','NotAllowedError')); }
      return nativePlay.call(this);
    };
  });
  const errors:string[] = [];
  page.on('pageerror',error => errors.push(error.message));
  await page.goto(base);
  await open(page);
  await page.getByRole('button',{name:'Activar música',exact:true}).click();
  await expect(widget(page)).toHaveAttribute('data-music-state','blocked');
  await page.getByRole('button',{name:'Activar música',exact:true}).click();
  await expect(widget(page)).toHaveAttribute('data-music-state','playing');
  await page.route('**/*.mp3',route => route.fulfill({status:404,body:''}));
  await page.getByRole('button',{name:'Siguiente pista',exact:true}).click();
  await expect(widget(page)).toHaveAttribute('data-music-state','error');
  await page.unroute('**/*.mp3');
  await page.getByLabel('Elegir pista').selectOption('teresa');
  await page.getByRole('button',{name:'Activar música',exact:true}).click();
  await expect(widget(page)).toHaveAttribute('data-music-state','playing');
  expect(errors).toEqual([]);
});

test('pestaña oculta y juegos suspenden el audio sin perder la elección del usuario', async ({page}) => {
  await page.goto(base);
  await play(page);
  await page.evaluate(() => { Object.defineProperty(document,'hidden',{configurable:true,value:true}); document.dispatchEvent(new Event('visibilitychange')); });
  expect(await audio(page).evaluate((element:HTMLAudioElement) => element.paused)).toBe(true);
  await page.evaluate(() => { Object.defineProperty(document,'hidden',{configurable:true,value:false}); document.dispatchEvent(new Event('visibilitychange')); });
  await expect(widget(page)).toHaveAttribute('data-music-state','playing');
  for (const game of ['cadete-roa','galactian']) {
    await page.goto(`${base}juegos/${game}/`);
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(widget(page)).toHaveAttribute('data-music-state','suspended');
    expect(await audio(page).evaluate((element:HTMLAudioElement) => element.paused)).toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(widget(page)).toHaveAttribute('data-music-state','playing');
  }
  const saved = await page.evaluate(key => JSON.parse(sessionStorage.getItem(key)!),musicSessionKey);
  expect(saved.enabled).toBe(true);
});

test('controles accesibles, sin superponer menús, seis idiomas y tamaños pequeños', async ({page},testInfo) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  for (const locale of ['', 'en/', 'zh/', 'hi/', 'ar/', 'fr/']) {
    await page.setViewportSize({width:320,height:740});
    await page.goto(`${base}${locale}`);
    await open(page);
    await expect(page.locator('#music-panel')).toHaveCSS('animation-name','none');
    for (const button of await page.locator('#music-panel button').all()) {
      const box = await button.boundingBox();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
    expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-music-disclosure] > summary')).toBeFocused();
  }
  await page.goto(base);
  for (const viewport of [{width:320,height:740},{width:844,height:390},{width:1440,height:900}]) {
    await page.setViewportSize(viewport);
    if (!(await page.locator('[data-music-disclosure]').evaluate((element:HTMLDetailsElement) => element.open))) await open(page);
    await expect(page.locator('#music-panel')).toBeVisible();
    await expect(page.locator('#music-panel')).toBeInViewport();
    await page.locator('[data-music-close]').click();
  }
  await page.setViewportSize({width:390,height:844});
  await open(page);
  await page.screenshot({path:testInfo.outputPath('music-mobile.png'),fullPage:false,animations:'disabled'});
  await page.locator('[data-language-switcher] > summary').click();
  await expect(page.locator('[data-music-disclosure]')).not.toHaveAttribute('open');
  await open(page);
  await expect(page.locator('[data-language-switcher]')).not.toHaveAttribute('open');
});

test('sin JavaScript la música no se descarga ni deja controles inactivos', async ({browser}) => {
  const context = await browser.newContext({javaScriptEnabled:false});
  const page = await context.newPage();
  const media:string[] = [];
  page.on('request',request => { if (/\.mp3/.test(request.url())) media.push(request.url()); });
  await page.goto(`http://127.0.0.1:4321${base}`);
  await expect(widget(page)).toBeHidden();
  expect(media).toEqual([]);
  await context.close();
});
