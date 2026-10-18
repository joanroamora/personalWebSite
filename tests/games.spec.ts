import { expect, test } from '@playwright/test';
import { siteConfig } from '../site.config.mjs';

const base = `${siteConfig.base}juegos/`;
const dialogSelector = '[data-cadet-game]';

test('el arcade y las fichas de muestra funcionan sin JavaScript', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled:false, viewport:testInfo.project.use.viewport });
  const page = await context.newPage();
  await page.goto(base);
  await expect(page.getByRole('link',{ name:'Jugar Cadete Roa' })).toBeVisible();
  await expect(page.locator('.upcoming-game')).toHaveCount(3);
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.screenshot({ path:testInfo.outputPath('arcade.png'), fullPage:true });
  for (const [slug,title] of [['orbita-de-bolsillo','Órbita de bolsillo'],['senal-perdida','Señal perdida'],['jardin-lunar','Jardín lunar']]) {
    await page.goto(`${base}${slug}/`);
    await expect(page.getByRole('heading',{ level:1 })).toHaveText(title);
    await expect(page.getByText('En desarrollo · Ficha de muestra')).toBeVisible();
    await expect(page.locator('canvas, [data-game-start]')).toHaveCount(0);
    await page.getByRole('link',{ name:'Volver a Juegos' }).click();
    await expect(page.getByRole('heading',{ level:1 })).toHaveText('Juegos');
  }
  await page.goto(`${base}cadete-roa/`);
  await expect(page.locator('.no-script')).toBeVisible();
  await expect(page.locator('.no-script')).toContainText('Cadete Roa necesita JavaScript para jugar.');
  await expect(page.getByRole('heading',{ name:'Tu primer entrenamiento.' })).toBeVisible();
  await context.close();
});

test('presentación, partida, pausa, cierre y regreso mantienen una sola sesión', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror',error => {
    // Chromium can cancel a native page transition during rapid navigation.
    // The platform exception has no script stack; ordinary navigation still works.
    if (error.name === 'InvalidStateError' && !error.stack && error.message === 'Transition was aborted because of invalid state. ViewTransition opt-in disabled') return;
    errors.push(error.message);
  });
  await page.goto(base);
  await page.getByRole('link',{ name:'Jugar Cadete Roa' }).click();
  const dialog = page.locator(dialogSelector);
  await expect(dialog).toBeVisible();
  const size = await dialog.boundingBox();
  if (testInfo.project.name === 'mobile') {
    await expect(dialog).toHaveCSS('width','390px'); await expect(dialog).toHaveCSS('height','844px');
  } else { expect(size!.width).toBeLessThanOrEqual(440); expect(size!.height).toBeGreaterThan(size!.width*1.7); }
  await expect(dialog.locator('[data-game-start]')).toBeFocused();
  await page.screenshot({ path:testInfo.outputPath('cadete-presentacion.png'), animations:'disabled' });
  await dialog.locator('[data-game-quality]').click();
  await expect(dialog.locator('[data-game-quality]')).toHaveText('QUALITY ECO');
  await dialog.locator('[data-game-start]').click();
  await expect(dialog.locator('.cadet-stage')).toHaveAttribute('data-state','running');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Space');
  await expect.poll(async () => Number(await dialog.locator('[data-distance]').textContent())).toBeGreaterThan(3);
  await page.screenshot({ path:testInfo.outputPath('cadete-partida.png') });
  await page.keyboard.press('KeyP');
  await expect(dialog.locator('.cadet-stage')).toHaveAttribute('data-state','paused');
  const distance = await dialog.locator('[data-distance]').textContent();
  await page.waitForTimeout(200);
  expect(await dialog.locator('[data-distance]').textContent()).toBe(distance);
  await dialog.locator('[data-game-start]').click();
  await expect(dialog.locator('.cadet-stage')).toHaveAttribute('data-state','running');
  await page.keyboard.press('Escape');
  await expect(dialog.locator('.cadet-stage')).toHaveAttribute('data-state','paused');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  expect(await page.evaluate(() => document.fullscreenElement === null)).toBe(true);
  await expect(page.locator('html')).not.toHaveClass(/cadet-open/);
  await expect(page.locator('[data-game-open]')).toBeFocused();
  await page.locator('[data-game-open]').click();
  await expect(dialog).toBeVisible();
  await dialog.locator('[data-game-close]').click();
  await expect(dialog).not.toBeVisible();
  await page.getByRole('link',{ name:'Volver a Juegos' }).click();
  await page.getByRole('link',{ name:'Jugar Cadete Roa' }).click();
  await expect(page.locator(dialogSelector)).toHaveCount(1);
  await expect(page.locator('.cadet-stage')).toHaveAttribute('data-state','ready');
  expect(errors).toEqual([]);
});

test('un obstáculo termina la partida, permite reintentar y conserva el récord', async ({ page }) => {
  await page.goto(`${base}cadete-roa/`);
  await page.locator('[data-game-start]').click();
  await expect(page.locator('.cadet-stage')).toHaveAttribute('data-state','over',{ timeout:15000 });
  await expect(page.locator('[data-screen-message]')).toContainText('grenades');
  const best = Number(await page.locator('[data-best]').textContent());
  expect(best).toBeGreaterThan(35);
  await page.locator('[data-game-start]').click();
  await expect(page.locator('.cadet-stage')).toHaveAttribute('data-state','running');
  await page.locator('[data-game-pause]').click();
  await page.reload();
  await expect(page.locator('[data-best]')).toHaveText(String(best));
});

test('los controles táctiles y el formato horizontal funcionan @mobile', async ({ page, context }, testInfo) => {
  await page.goto(`${base}cadete-roa/`);
  await page.locator('[data-game-start]').tap();
  for (const action of ['left','jump','right']) await page.locator(`[data-game-${action}]`).tap();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent',{ type:'touchStart',touchPoints:[{x:190,y:420}] });
  await cdp.send('Input.dispatchTouchEvent',{ type:'touchMove',touchPoints:[{x:90,y:420}] });
  await cdp.send('Input.dispatchTouchEvent',{ type:'touchEnd',touchPoints:[] });
  await expect(page.locator('.cadet-stage')).toHaveAttribute('data-state','running');
  await page.locator('[data-game-pause]').tap();
  await page.evaluate(async () => { if (document.fullscreenElement) await document.exitFullscreen(); });
  await page.setViewportSize({ width:844,height:390 });
  await expect(page.locator('[data-game-start]')).toBeInViewport();
  await expect(page.locator('[data-game-close]')).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({ path:testInfo.outputPath('cadete-horizontal.png') });
  await cdp.detach();
});

test('el modo alternativo funciona sin WebGL, con movimiento reducido y almacenamiento bloqueado', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion:'reduce' });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement,type: string,...args: unknown[]) {
      if (type.startsWith('webgl') || type === 'experimental-webgl') return null;
      return Reflect.apply(original,this,[type,...args]);
    } as typeof original;
    Object.defineProperty(window,'localStorage',{ get:() => { throw new Error('Storage blocked'); } });
  });
  await page.goto(`${base}cadete-roa/`);
  await expect(page.locator('.cadet-canvas')).toHaveAttribute('data-renderer','canvas');
  await expect(page.locator(dialogSelector)).toHaveCSS('animation-name','none');
  await page.locator('[data-game-start]').click();
  await page.locator('[data-game-left]').click();
  await expect.poll(async () => Number(await page.locator('[data-distance]').textContent())).toBeGreaterThan(2);
  await page.screenshot({ path:testInfo.outputPath('cadete-canvas-alternativo.png') });
  await page.locator('[data-game-pause]').click();
  await page.locator('[data-game-close]').click();
  await expect(page.locator(dialogSelector)).not.toBeVisible();
});
